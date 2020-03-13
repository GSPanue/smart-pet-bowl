<template>
  <el-row
    class="container"
    type="flex"
    flexDirection="row"
    justify="center"
    align="middle"
  >
    <el-card class="card">
      <div class="heading">
        <span v-if="!shouldShowRegister">Sign In</span>
        <span v-else>Register</span>
      </div>

      <!-- Sign In Form -->
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        status-icon
      >
        <!-- Email Address Field -->
        <el-form-item
          class="form-item"
          label="Email Address"
          prop="emailAddress"
        >
          <el-input v-model="form.emailAddress" size="small" :disabled="loading" />
        </el-form-item>

        <!-- Password Field -->
        <el-form-item class="form-item" label="Password" prop="password">
          <el-input @focus="clearConfirmPassword" v-model="form.password" size="small" :disabled="loading" show-password />
        </el-form-item>

        <el-form-item
          v-if="shouldShowRegister"
          class="form-item"
          label="Confirm Password"
          prop="confirmPassword"
        >
          <el-input v-model="form.confirmPassword" size="small" :disabled="loading" show-password />
        </el-form-item>
      </el-form>

      <el-row type="flex" justify="center" align="middle">
        <el-col>
          <h5 v-if="!shouldShowRegister && !loading">Don't have an account?
            <a class="link" @click="showRegister">Register</a>
          </h5>

          <h5 v-else-if="!loading">Already have an account?
            <a class="link" @click="showSignIn">Sign In</a>
          </h5>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" size="medium" :loading="loading" @click="handleSubmit">
            <span v-if="!shouldShowRegister">Sign In</span>
            <span v-else>Submit</span>
          </el-button>
        </el-col>
      </el-row>

    </el-card>

    <!-- Error Dialog -->
    <el-dialog
      title="Error"
      :visible.sync="dialogVisible"
      top="0"
      width="32.5%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <span>You have entered an invalid email address or password.</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleDialog">
          OK
        </el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import{ getAPIURL } from '@/helpers';
import { isEmail, isLength, equals } from 'validator';

const api = getAPIURL();

export default {
  data() {
    const checkEmailAddress = (rule, value, callback) => {
      const isRegisterForm = this.shouldShowRegister;

      if (!isEmail(value)) {
        callback(new Error('Please enter your email address.'));
      }
      else if (isRegisterForm) {
        this.axios.get(`${api}/account/exists`, {
          params: {
            q: value
          }
        }).then(() => {
          callback(new Error('This email address is already in use.'));
        }).catch(() => {
          callback();
        });
      }
      else {
        callback();
      }
    };

    const checkPassword = (rule, value, callback) => {
      const isRegisterForm = this.shouldShowRegister;

      if (isLength(value, { max: 0 })) {
        callback(new Error('Please enter your password.'));
      }
      else if (isRegisterForm && isLength(value, { max: 5 })) {
        callback(new Error('Your password must be at least 6 characters long.'));
      }
      else {
        callback();
      }
    };

    const checkConfirmPassword = (rule, value, callback) => {
      const password = this.form.password;

      if (isLength(value, { max: 0 })) {
        callback(new Error('Please confirm your password.'));
      }
      else if (!equals(value, password)) {
        callback(new Error('This password and confirm password do not match.'));
      }
      else {
        callback();
      }
    };

    return {
      form: {
        emailAddress: '',
        password: '',
        confirmPassword: ''
      },
      shouldShowRegister: false,
      formRules: {
        emailAddress: [
          { validator: checkEmailAddress, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: checkConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false,
      dialogVisible: false
    }
  },
  methods: {
    showRegister() {
      this.shouldShowRegister = true;
      this.$refs['form'].resetFields();
    },
    showSignIn() {
      this.shouldShowRegister = false;
      this.$refs['form'].resetFields();
    },
    clearConfirmPassword() {
      this.form.confirmPassword = '';
      this.$refs['form'].clearValidate('confirmPassword');
    },
    handleSubmit() {
      this.loading = true;

      const isSignInForm = !this.shouldShowRegister;
      const form = this.$refs['form'];

      form.validate((valid) => {
        const account = this.form;

        if (valid) {
          if (isSignInForm) {
            this.axios.post(`${api}/account/auth`, {
              emailAddress: account.emailAddress,
              password: account.password
            }).then(({ data }) => {
              /**
               * @todo: Persist login and navigate to homepage.
               */
              console.log(data);
            }).finally(() => {
              this.loading = false;
            });
          }
          else {
            this.axios.post(`${api}/account/create`, {
              emailAddress: account.emailAddress,
              password: account.password
            }).finally(() => {
              this.loading = false;
              this.showSignIn();
            });
          }
        }
        else {
          this.loading = false;
        }
      });
    },
    handleDialog() {
      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}

.card {
  max-width: 358px;
  width: 100%;
}

.heading {
  font-size: 24px;
  padding: 20px 0 40px 0;
}

.form-item {
  margin-bottom: 20px;
}

.el-form >>> .el-form-item__label {
  line-height: 24px;
}

.link {
  font-weight: 500;
  cursor: pointer;
}

.el-dialog__wrapper {
  display: flex;
  align-items: center;
}
</style>
