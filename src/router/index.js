import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import Cookies from 'js-cookie'

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
  // 获取SESSION cookie
  const session = Cookies.get('SESSION')

  // 是否登录
  const isLogin = !session || session === ''

  // 登录和注册页面 检查
  if (to.path === '/' || to.path === '/register') {
    // 如果已经登录则跳转/dashboard
    if(!isLogin){
      return next('/dashboard')
    }
    return next()
  }

  // 如果SESSION不存在或为空，则重定向到登录页面
  if (isLogin) {
    return next('/')
  }

  // 否则允许访问
  next()
})

export default router
