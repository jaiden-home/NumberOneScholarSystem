import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

// 函数：获取指定名称的cookie值
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ]
})

// 导航守卫：检查SESSION cookie
router.beforeEach((to, from, next) => {
  // 登录和注册页面不需要检查
  if (to.path === '/' || to.path === '/register') {
    next()
    return
  }

  // 获取SESSION cookie
  const session = getCookie('SESSION')

  // 如果SESSION不存在或为空，则重定向到登录页面
  if (!session || session === '') {
    next('/')
    return
  }

  // 否则允许访问
  next()
})

export default router
