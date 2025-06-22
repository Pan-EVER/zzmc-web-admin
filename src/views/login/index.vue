<template>
  <div class="login-box">
    <div class="login-logo">
      <!-- <svg-icon name="logo" :size="45" /> -->
      <img src="@/assets/images/logo2-new.png" width="45" />
      <h1 class="mb-0 ml-2 text-3xl font-bold">中轴精控-后台管理</h1>
    </div>
    <a-form layout="horizontal" :model="loginFormModel" @submit.prevent="handleSubmit">
      <a-form-item>
        <a-input v-model:value="loginFormModel.username" size="large" placeholder="请输入用户名" autocomplete="username">
          <template #prefix><UserOutlined /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="loginFormModel.password"
          size="large"
          type="password"
          placeholder="请输入密码"
          autocomplete="current-password"
        >
          <template #prefix><LockOutlined /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" :loading="loading" block>
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const mockUserList = [
  {
    username: 'admin',
    password: 'a4586',
  },
  {
    username: 'liuhao',
    password: 'zzmc2025',
  }
]
const loading = ref(false)
const loginFormModel = ref({
  username: '',
  password: '',
  verifyCode: '',
  captchaId: '',
})

const handleSubmit = () => {
  const { username, password } = loginFormModel.value
  if (username.trim() == '' || password.trim() == '') {
    return message.warning('用户名或密码不能为空！')
  }
  // message.loading('登录中...', 0)
  loading.value = true
  console.log(loginFormModel.value)
  // params.password = md5(password)
  // 校验用户名和密码
  const user = mockUserList.find(item => item.username === username && item.password === password)
  console.log('user', user);

  if (!user) {
    message.error('用户名或密码错误！')
    loading.value = false
    return
  }
  // 存一个当前的时间戳到localStorage
  localStorage.setItem('loginTime', JSON.stringify(Date.now()))
  localStorage.setItem('username', JSON.stringify(user.username))
  message.success('登录成功！')
  setTimeout(() => router.push('/home-manage'))
  // setTimeout(() => router.replace((route.query.redirect as string) || '/'))
  loading.value = false
  message.destroy()
}
</script>

<style scoped lang="scss">
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding-top: 240px;
  background: url('@/assets/login.svg');
  background-size: 100%;

  .login-logo {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .svg-icon {
      font-size: 48px;
    }
  }

  :deep(.ant-form) {
    width: 400px;

    .ant-col {
      width: 100%;
    }

    .ant-form-item-label {
      padding-right: 6px;
    }
  }
}
</style>
