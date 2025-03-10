<route lang="yaml">
meta:
  title: 登录
  constant: true
  layout: false
</route>

<script lang="ts" setup name="Login">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const banner = new URL('../assets/images/login-banner.png', import.meta.url).href
const title = import.meta.env.VITE_APP_TITLE

// 表单类型，login 登录，reset 重置密码
const formType = ref('login')
const loading = ref(false)
const redirect = ref(route.query.redirect?.toString() ?? '/')

// 登录
const loginFormRef = ref<FormInstance>()
const loginForm = ref({
  username: localStorage.login_username || '',
  password: '',
  remember: !!localStorage.login_username,
})
const loginRules = ref<FormRules>({
  username: [
    { required: true, trigger: 'blur', message: '请输入用户名' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' },
  ],
})
function handleLogin() {
  loginFormRef.value && loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      userStore.login(loginForm.value).then(() => {
        loading.value = false
        if (loginForm.value.remember) {
          localStorage.setItem('login_username', loginForm.value.username)
        }
        else {
          localStorage.removeItem('login_username')
        }
        router.push(redirect.value)
      }).catch(() => {
        loading.value = false
      })
    }
  })
}

// 注册
const registerFormRef = ref<FormInstance>()
const registerForm = ref({
  username: '',
  captcha: '',
  password: '',
  checkPassword: '',
})
const registerRules = ref<FormRules>({
  username: [
    { required: true, trigger: 'blur', message: '请输入用户名' },
  ],
  captcha: [
    { required: true, trigger: 'blur', message: '请输入验证码' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' },
  ],
  checkPassword: [
    { required: true, trigger: 'blur', message: '请再次输入密码' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        }
        else {
          callback()
        }
      },
    },
  ],
})
function handleRegister() {
  ElMessage({
    message: '注册模块仅提供界面演示，无实际功能，需开发者自行扩展',
    type: 'warning',
  })
  registerFormRef.value && registerFormRef.value.validate((valid) => {
    if (valid) {
      // 这里编写业务代码
    }
  })
}

// 重置密码
const resetFormRef = ref<FormInstance>()
const resetForm = ref({
  username: localStorage.login_username || '',
  captcha: '',
  newPassword: '',
})
const resetRules = ref<FormRules>({
  username: [
    { required: true, trigger: 'blur', message: '请输入用户名' },
  ],
  captcha: [
    { required: true, trigger: 'blur', message: '请输入验证码' },
  ],
  newPassword: [
    { required: true, trigger: 'blur', message: '请输入新密码' },
    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' },
  ],
})
function handleReset() {
  ElMessage({
    message: '重置密码模块仅提供界面演示，无实际功能，需开发者自行扩展',
    type: 'warning',
  })
  resetFormRef.value && resetFormRef.value.validate((valid) => {
    if (valid) {
      // 这里编写业务代码
    }
  })
}

function testusername(username: string) {
  if (username === 'test') {
    return ElMessage.warning('当前暂不提供普通用户访问权限！')
  }
  loginForm.value.username = username
  loginForm.value.password = '123456'
  handleLogin()
}
</script>

<template>
  <div style="height: 100vh;">
    <div class="bg-banner" />
    <div id="login-box">
      <div class="login-banner">
        <div class="logo" />
        <img :src="banner" class="banner">
      </div>
      <el-form v-show="formType === 'login'" ref="loginFormRef" :model="loginForm" :rules="loginRules"
        class="login-form" autocomplete="on">
        <div class="title-container">
          <h3 class="title">
            欢迎来到 {{ title }} ! 👋🏻
          </h3>
        </div>
        <div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名" text tabindex="1" autocomplete="on">
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:user" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" tabindex="2" autocomplete="on"
              show-password @keyup.enter="handleLogin">
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:lock" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="flex-bar">
          <el-checkbox v-model="loginForm.remember">
            记住我
          </el-checkbox>
          <!-- <el-link type="primary" :underline="false" @click="formType = 'reset'">
            忘记密码了?
          </el-link> -->
        </div>
        <el-button :loading="loading" type="primary" size="large" style="width: 100%;" @click.prevent="handleLogin">
          登录
        </el-button>
        <div class="sub-link">
          <!-- <span class="text">还没有帐号?</span> -->
          <!-- <el-link type="primary" :underline="false" @click="formType = 'register'"> -->
          <!-- <el-link type="primary" :underline="false">
            创建新帐号
          </el-link> -->
        </div>
        <!-- <div style="margin-top: 20px; margin-bottom: -20px; text-align: center;">
          <el-divider>演示账号一键登录</el-divider>
          <el-button type="primary" size="small" plain @click="testusername('admin')">
            admin
          </el-button>
          <el-button size="small" plain @click="testusername('test')">
            test
          </el-button>
        </div> -->
      </el-form>
      <el-form v-show="formType === 'register'" ref="registerFormRef" :model="registerForm" :rules="registerRules"
        class="login-form" auto-complete="on">
        <div class="title-container">
          <h3 class="title">
            探索从这里开始! 🚀
          </h3>
        </div>
        <div>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名" tabindex="1" autocomplete="on">
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:user" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input v-model="registerForm.captcha" placeholder="验证码" tabindex="2" autocomplete="on">
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:key" />
                </el-icon>
              </template>
              <template #append>
                <el-button>发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="密码" tabindex="3" autocomplete="on"
              show-password>
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:lock" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPassword">
            <el-input v-model="registerForm.checkPassword" type="password" placeholder="确认密码" tabindex="4"
              autocomplete="on" show-password>
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:lock" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-button :loading="loading" type="primary" size="large" style="width: 100%; margin-top: 20px;"
          @click.prevent="handleRegister">
          注册
        </el-button>
        <div class="sub-link">
          <span class="text">已经有帐号?</span>
          <el-link type="primary" :underline="false" @click="formType = 'login'">
            去登录
          </el-link>
        </div>
      </el-form>
      <el-form v-show="formType === 'reset'" ref="resetFormRef" :model="resetForm" :rules="resetRules"
        class="login-form" auto-complete="on">
        <div class="title-container">
          <h3 class="title">
            忘记密码了? 🔒
          </h3>
        </div>
        <div>
          <el-form-item prop="username">
            <el-input v-model="resetForm.username" placeholder="用户名" tabindex="1" autocomplete="on">
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:user" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input v-model="resetForm.captcha" placeholder="验证码" tabindex="2" autocomplete="on">
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:key" />
                </el-icon>
              </template>
              <template #append>
                <el-button>发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input v-model="resetForm.newPassword" type="password" placeholder="新密码" tabindex="3" autocomplete="on"
              show-password>
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:lock" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-button :loading="loading" type="primary" size="large" style="width: 100%; margin-top: 20px;"
          @click.prevent="handleReset">
          确认
        </el-button>
        <div class="sub-link">
          <el-link type="primary" :underline="false" @click="formType = 'login'">
            返回登录
          </el-link>
        </div>
      </el-form>
    </div>
    <Copyright />
  </div>
</template>

<style lang="scss" scoped>
[data-mode="mobile"] {
  #login-box {
    position: relative;
    width: 100%;
    height: calc(100% - 35px);
    top: inherit;
    left: inherit;
    transform: translateX(0) translateY(0);
    flex-direction: column;
    justify-content: start;
    border-radius: 0;
    box-shadow: none;

    .login-banner {
      width: 100%;
      padding: 20px 0;

      .banner {
        position: relative;
        right: inherit;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        display: inherit;
        top: inherit;
        transform: translateY(0);
      }
    }

    .login-form {
      width: 100%;
      min-height: auto;
      padding: 30px;
    }
  }

  .copyright {
    position: relative;
    bottom: 0;
    padding-bottom: 10px;
  }
}

:deep(input[type="password"]::-ms-reveal) {
  display: none;
}

.bg-banner {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--el-fill-color-lighter), var(--el-bg-color-page));
  background: url("../assets/images/bg.jpg");
  background-size: cover;
  // filter: blur(3px);
}

#login-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow);
  background: #47c4c0;

  .login-banner {
    position: relative;
    width: 450px;
    overflow: hidden;

    .banner {
      width: 100%;

      @include position-center(y);
    }

    .logo {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      background: url("../assets/images/logo.png") no-repeat;
      background-size: contain;
      box-shadow: var(--el-box-shadow-light);
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 500px;
    width: 500px;
    padding: 50px;
    overflow: hidden;

    .title-container {
      position: relative;

      .title {
        font-size: 1.3em;
        color: var(--el-text-color-primary);
        margin: 0 auto 30px;
        font-weight: bold;
      }
    }
  }

  .el-form-item {
    margin-bottom: 24px;

    :deep(.el-input) {
      height: 48px;
      line-height: inherit;
      width: 100%;

      input {
        height: 48px;
      }

      .el-input__prefix,
      .el-input__suffix {
        display: flex;
        align-items: center;
      }

      .el-input__prefix {
        left: 10px;
      }

      .el-input__suffix {
        right: 10px;
      }
    }
  }

  .flex-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .sub-link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    .text {
      margin-right: 10px;
    }
  }
}

.copyright {
  position: absolute;
  bottom: 30px;
  width: 100%;
  margin: 0;
}
</style>
