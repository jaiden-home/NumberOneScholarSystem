<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-left">
        <BrandFeatures />
      </div>

      <div class="login-right">
        <h2>欢迎登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input type="text" v-model="username" placeholder="请输入注册邮箱" required />
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="请输入密码"
                required
              />
              <span class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </span>
            </div>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '➜ 登录' }}
          </button>
        </form>

        <div class="footer-links">
          还没有账号？ <a href="/register" @click.prevent="goToRegister">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import BrandFeatures from '../components/BrandFeatures.vue'
import request from '../utils/request'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }

  try {
    isLoading.value = true

    // 发送登录请求到后端API
    const data = await request.post('/users/login', {
      email: username.value,
      password: password.value
    })

    console.log('登录成功:', data)

    // 更新用户信息到store
    userStore.updateUserInfo(data.data.user)

    // 设置SESSION cookie
    document.cookie = 'SESSION=user_' + data.data.user.id + '; path=/; max-age=2592000' // 30 天有效期
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败: ' + (error.response?.data?.message || error.message || '登录失败'))
  } finally {
    isLoading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-card {
  display: flex;
  width: 900px;
  height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #3b59f5 0%, #7c4dff 100%); /* Match screenshot closer */
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}



.login-right {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-right h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  transition: border-color 0.3s;
}

.input-wrapper:focus-within {
  border-color: #3b59f5;
}

.input-icon {
  color: #999;
  margin-right: 10px;
  font-size: 16px;
}

.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 0;
  font-size: 14px;
  color: #333;
}

.toggle-password {
  cursor: pointer;
  color: #999;
  margin-left: 10px;
  user-select: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #1a73e8; /* Blue */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.login-btn:hover {
  background-color: #1557b0;
}

.footer-links {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.footer-links a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
