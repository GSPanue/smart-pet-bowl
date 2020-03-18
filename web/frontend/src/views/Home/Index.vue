<template>
  <el-col v-if="!loading" class="container" type="flex" justify="center" align="middle">
    <!-- Sign Out -->
    <el-row class="sign-out-container" type="flex" justify="end">
      <el-button type="primary" size="medium" @click="handleSignOut">
        Sign Out
      </el-button>
    </el-row>

    <!-- Content -->
    <el-row
      class="card-container"
      type="flex"
      flexDirection="row"
      justify="center"
      align="middle"
    >
      <!-- Bind Device Card -->
      <el-card v-if="!getDevice" class="bind-card">
        <div class="heading">
          <span>Bind Device</span>
        </div>

        <!-- Bind Device Form -->
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          status-icon
        >
          <el-form-item
            class="form-item"
            label="Device ID"
            prop="deviceId"
          >
            <el-input v-model="form.deviceId" size="small" :disabled="submitting" />
          </el-form-item>

          <el-row type="flex">
            <el-col>
              <el-form-item
                class="form-item"
                label="Pet Name"
                prop="petName"
              >
                <el-input v-model="form.petName" size="small" :disabled="submitting" />
              </el-form-item>
            </el-col>
            <el-col :offset="2">
              <el-form-item
                class="form-item"
                label="Pet Species"
                prop="petSpecies"
              >
                <el-input v-model="form.petSpecies" size="small" :disabled="submitting" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class="button-container" align="right">
            <el-button
              class="bind-button"
              type="primary"
              size="medium"
              :loading="submitting"
              @click="handleSubmit"
            >
              Submit
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-col
        v-else
        type="flex"
        class="data-container"
      >
        <el-row>
          <el-card>
            <div v-if="!hasReadings">
              There is no data to display. Waiting for new data...
            </div>
            <div v-else-if="hasInsufficientReadings">
              Accumulating data for the chart... This may take up to 5 minutes.
            </div>
            <div v-else>
              <h3 class="chart-heading">Smart Pet Bowl</h3>
              <el-button
                size="small"
                @click="handleRange('ALL')"
                :disabled="showAll"
              >
                ALL
              </el-button>
              <el-button
                size="small"
                @click="handleRange('24H')"
                :disabled="!showAll"
              >
                24H
              </el-button>
              <vue-apex-charts
                type="area"
                :series="createSeries()"
                :options="createOptions()"
                height="220"
              />
            </div>
          </el-card>
        </el-row>
        <el-row class="table-container">
          <el-card>
            <el-table
              class="table"
              :data="createTableData()"
              size="small"
            >
              <el-table-column property="name" label="Name" align="center" />
              <el-table-column property="species" label="Species" align="center" />
              <el-table-column property="weight" label="Current Weight" align="center" />
            </el-table>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { Loading } from 'element-ui';
import store from 'store';
import { isLength } from 'validator';
import shortUUID from 'short-uuid';
import VueApexCharts from 'vue-apexcharts';
import { getAPIURL, sortByDate } from '@/helpers';

const api = getAPIURL();

let loadingInstance = null;

export default {
  components: {
    VueApexCharts
  },
  computed: {
    ...mapGetters([
      'getFetched',
      'getConnected',
      'getDevice',
      'getPet',
      'getReadings'
    ]),
    shouldShowApp() {
      const hasFetched = this.getFetched;
      const isConnected = this.getConnected

      return hasFetched && isConnected;
    },
    hasReadings() {
      const readings = this.getReadings;

      if (readings) {
        return readings.length > 0;
      }

      return false;
    },
    hasInsufficientReadings() {
      const readings = this.getReadings;

      if (readings.length > 1) {
        const d1 = new Date(readings[0].timestamp);
        const d2 = new Date(readings[readings.length - 1].timestamp);

        const difference = Math.abs(d1 - d2);
        const minutes = Math.floor((difference / 1000) / 60);

        return minutes <= 5;
      }

      return true;
    }
  },
  data() {
    const checkDeviceId = (rule, value, callback) => {
      if (isLength(value, { max: 0 })) {
        callback(new Error('Please enter your device ID.'));
      }
      else {
        this.axios.get(`${api}/device/exists`, {
          params: {
            q: value
          }
        }).then(() => {
          callback(new Error('This device is already in use.'));
        }).catch(() => {
          callback();
        });
      }
    }

    const checkPetName = (rule, value, callback) => {
      if (isLength(value, { max: 0 })) {
        callback(new Error('Please enter your pet\'s name.'));
      }
      else {
        callback();
      }
    }

    const checkPetSpecies = (rule, value, callback) => {
      if (isLength(value, { max: 0 })) {
        callback(new Error('Please enter your pet\'s species.'));
      }
      else {
        callback();
      }
    }

    return {
      loading: true,
      submitting: false,
      form: {
        deviceId: '',
        petName: '',
        petSpecies: ''
      },
      showAll: true,
      formRules: {
        deviceId: [
          { validator: checkDeviceId, trigger: 'blur' }
        ],
        petName: [
          { validator: checkPetName, trigger: 'blur' }
        ],
        petSpecies: [
          { validator: checkPetSpecies, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'createWebSocket',
      'destroyWebSocket'
    ]),
    ...mapMutations([
      'setFetched',
      'setDevice',
      'setPet',
      'setReadings',
      'resetStore'
    ]),
    handleSubmit() {
      this.submitting = true;

      const form = this.$refs['form'];

      form.validate((valid) => {
        if (valid) {
          const formData = this.form;

          const accountId = store.get('account').id;
          const deviceId = formData.deviceId;
          const petId = shortUUID.generate();

          const deviceItem = {
            id: formData.deviceId,
            accountId,
            petId
          }

          const petItem = {
            id: petId,
            name: formData.petName,
            species: formData.petSpecies
          }

          this.axios.post(`${api}/pet/create`, {
            ...petItem
          }).then(() => {
            return this.axios.post(`${api}/device/create`, {
              ...deviceItem
            });
          }).then(() => {
            this.resetState();
            this.loadApp();
          }).catch(() => {
            this.resetState();

            loadingInstance = Loading.service({
              text: 'Something went wrong...',
              background: 'rgb(255, 255, 255)'
            });
          });
        }
        else {
          this.submitting = false;
        }
      });
    },
    handleSignOut() {
      const isConnectedToWebSocket = this.getConnected;

      store.remove('account');
      this.$router.push('/signin');

      if (isConnectedToWebSocket) {
        this.destroyWebSocket();
      }

      this.resetStore();
    },
    loadApp() {
      loadingInstance = Loading.service({
        text: 'Loading...',
        background: 'rgb(255, 255, 255)'
      });

      const accountId = store.get('account').id;

      this.axios.get(`${api}/device/find`, {
        params: {
          id: accountId
        }
      }).then(({ data }) => {
        const deviceId = data.id;
        const petId = data.pet_id;

        this.setDevice({
          id: deviceId
        });

        return Promise.all([
          this.axios.get(`${api}/pet/find`, {
            params: {
              id: petId
            }
          }),
          this.axios.get(`${api}/readings/all`, {
            params: {
              id: deviceId
            }
          })
        ]);
      }).then((values) => {
        const { data: petData } = values[0];
        const { data: readingsData } = values[1];

        this.setPet({
          name: petData.name,
          species: petData.species
        });

        this.setReadings(sortByDate(readingsData));
        this.setFetched(true);

        this.createWebSocket();
      }).catch((error) => {
        const errorCode = error.response.status;

        if (errorCode !== 404) {
          loadingInstance.close();

          loadingInstance = Loading.service({
            text: 'Something went wrong...',
            background: 'rgb(255, 255, 255)'
          });
        }
        else {
          this.loading = false;
          loadingInstance.close();
        }
      });
    },
    handleRange(range) {
      this.showAll = range === 'ALL';
    },
    createTableData() {
      const pet = this.getPet;
      const readings = this.getReadings;
      const latestWeight = (readings.length > 0) ?
        (readings[readings.length - 1].weight) : 0;

      return [{
        name: pet.name,
        species: pet.species,
        weight: `${latestWeight}g`
      }];
    },
    createSeries() {
      const shouldShowAll = this.showAll;
      let readings = this.getReadings.map((reading) => ([
        reading.timestamp,
        reading.weight
      ]));

      if (!shouldShowAll) {
        const yesterdayDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

        readings = readings.filter((reading) => {
          if (new Date(reading[0]) > yesterdayDate) {
            return true;
          }

          return false;
        });
      }

      return [{
        name: 'Weight',
        data: readings
      }]
    },
    createOptions() {
      return {
        chart: {
          zoom: {
            enabled: true
          },
          toolbar: {
            show: true,
            tools: {
              download: false,
              selection: false,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: false,
              reset: true
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          x: {
            format: 'HH:mm:ss TT, dd MMMM yyyy'
          }
        },
        yaxis: {
          opposite: true,
          labels: {
            formatter: (value) => (
              `${value}g`
            )
          },
          title: {
            text: 'Weight (g)'
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: true,
            datetimeUTC: true,
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMMM yyyy',
              day: 'dd MMMM yyyy',
              hour: 'HH:mm:ss',
              minute: 'HH:mm:ss'
            }
          },
          tooltip: {
            enabled: false
          }
        },
        stroke: {
          curve: 'straight',
          width: 3
        }
      }
    },
    resetState() {
      this.loading = true;
      this.submitting = false;
      this.form = {
        deviceId: '',
        petName: '',
        petSpecies: ''
      }
    }
  },
  mounted() {
    this.loadApp();
  },
  watch: {
    shouldShowApp(state) {
      if (state) {
        this.loading = false;
        loadingInstance.close();
      }
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-container {
  flex: 1;
}

.bind-card {
  max-width: 420px;
  width: 100%;
}

.heading {
  font-size: 24px;
  padding: 20px 0 20px 0;
}

.form-item {
  margin-bottom: 20px;
}

.el-form >>> .el-form-item__label {
  line-height: 24px;
}

.button-container {
  margin-top: 10px;
}

.bind-button {
  width: 100%;
}

.sign-out-container {
  padding: 10px;
}

.data-container {
  max-width: 680px;
}

.chart-heading {
  font-weight: 500;
}

div >>> .apexcharts-toolbar {
  margin-top: -5px;
  right: 37px !important;
}

.table-container {
  padding-top: 15px;
}

.table {
  color: #303133;
}

.table >>> .el-table__row > td {
  background-color: initial !important;
}

.table >>> th.is-leaf {
  padding-top: 0px;
  padding-bottom: 8px;
  font-weight: 600;
  color: #303133;
}
</style>
