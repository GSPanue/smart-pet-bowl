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

      <el-card v-else>
        Main
      </el-card>
    </el-row>
  </el-col>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { Loading } from 'element-ui';
import store from 'store';
import { isLength } from 'validator';
import shortUUID from 'short-uuid';
import { getAPIURL } from '@/helpers';

const api = getAPIURL();

let loadingInstance = null;

export default {
  computed: {
    ...mapGetters([
      'getFetched',
      'getConnected',
      'getDevice'
    ]),
    shouldShowApp() {
      const hasFetched = this.getFetched;
      const isConnected = this.getConnected

      return hasFetched && isConnected;
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
        /**
         * @todo Connect to WebSocket after fetching readings
         */
        this.createWebSocket();

        const deviceId = data.id;
        const petId = data.pet_id;

        this.setDevice({
          id: deviceId
        });

        return this.axios.get(`${api}/pet/find`, {
          params: {
            id: petId
          }
        });
      }).then(({ data }) => {
        this.setPet({
          name: data.name,
          species: data.species
        });

        this.setFetched(true);
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
</style>
