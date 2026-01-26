<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-left">
        <BrandFeatures />
      </div>

      <div class="register-right">
        <h2>创建账号</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input type="text" v-model="formData.name" placeholder="请输入用户名" required />
            </div>
          </div>

          <div class="form-group">
            <label>邮箱</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input type="email" v-model="formData.email" placeholder="请输入邮箱" required />
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder="请输入密码（至少6位）"
                required
              />
              <span class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                placeholder="请再次输入密码"
                required
              />
            </div>
          </div>

          <button type="submit" class="register-btn" :disabled="isLoading">
            {{ isLoading ? '注册中...' : '➜ 注册' }}
          </button>

          <div class="footer-links">
            已有账号？ <a href="/login" @click.prevent="goToLogin">立即登录</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BrandFeatures from '../components/BrandFeatures.vue'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function goToLogin() {
  router.push('/')
}

async function handleRegister() {
  // 验证密码是否一致
  if (formData.password !== formData.confirmPassword) {
    alert('两次输入的密码不一致，请重新输入')
    return
  }

  // 验证密码长度
  if (formData.password.length < 6) {
    alert('密码长度至少为6位')
    return
  }

  try {
    isLoading.value = true

    // 发送注册请求到后端API
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '注册失败')
    }

    const data = await response.json()
    console.log('注册成功:', data)

    // 注册成功后跳转到登录页面
    alert('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.register-card {
  display: flex;
  width: 900px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.register-left {
  flex: 1;
  background: linear-gradient(135deg, #3b59f5 0%, #7c4dff 100%);
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}



.register-right {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.register-right h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
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

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #1a73e8;
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

.register-btn:hover:not(:disabled) {
  background-color: #1557b0;
}

.register-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
