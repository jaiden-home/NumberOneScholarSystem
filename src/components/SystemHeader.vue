<template>
  <header class="system-header">
    <div class="header-content">
      <div class="brand">
        <div class="logo-icon">
          <!-- Simple Book/Person Icon SVG -->
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4Z"
              fill="#3B82F6"
            />
            <path
              d="M6 19C6 16.2386 8.23858 14 11 14H13C15.7614 14 18 16.2386 18 19V20H6V19Z"
              fill="#3B82F6"
            />
            <path
              d="M4 6V18C4 18 6 20 12 20C18 20 20 18 20 18V6C20 6 18 8 12 8C6 8 4 6 4 6Z"
              stroke="#3B82F6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="brand-name">备考系统</span>
      </div>

      <div class="nav-right">
        <!-- Desktop Navigation -->
        <nav class="main-nav">
          <a href="#" class="nav-item active">月视图</a>
          <a href="#" class="nav-item">学习分析</a>
          <a href="#" class="nav-item">目标管理</a>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <svg
            v-if="!isMobileMenuOpen"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="#374151"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#374151"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="user-actions">

          <div class="user-profile" @click="toggleUserMenu">
            <div class="avatar">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
                <path
                  d="M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M12 14C8.68629 14 6 16.6863 6 20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20C18 16.6863 15.3137 14 12 14Z"
                  fill="#9CA3AF"
                />
              </svg>
            </div>
            <span class="username">{{ userStore.userInfo.name || '考生姓名' }}</span>
            <div class="user-menu" v-if="isUserMenuOpen">
              <div class="menu-item" @click.stop="handleLogout">退出登录</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <nav class="mobile-nav">
        <a href="#" class="nav-item active">月视图</a>
        <a href="#" class="nav-item">学习分析</a>
        <a href="#" class="nav-item">目标管理</a>
        <div class="nav-item" @click="handleLogout">退出登录</div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import Cookies from 'js-cookie'

const router = useRouter()
const userStore = useUserStore()
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

async function handleLogout() {
  try {
    // 发送登出请求到后端API
    const response = await fetch('http://localhost:3000/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('登出失败')
    }

    // 清除前端cookie
    Cookies.remove('SESSION', { path: '/' })

    // 跳转到登录页面
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
    // 即使后端请求失败，也清除cookie并跳转到登录页面
    Cookies.remove('SESSION', { path: '/' })
    router.push('/login')
  }
}
</script>

<style scoped>
.system-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.header-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  color: #2563eb; /* Blue color matching the logo roughly */
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.main-nav {
  display: flex;
  gap: 24px;
}

.nav-item {
  text-decoration: none;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 0;
}

.nav-item:hover {
  color: #2563eb;
}

.nav-item.active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-badge {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.badge-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: #f3f4f6;
}

.username {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 120px;
  z-index: 1000;
}

.menu-item {
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 6px;
  margin: 4px;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #ef4444;
}

.mobile-nav .nav-item:last-child {
  color: #ef4444;
  font-weight: 500;
}

/* Mobile Menu Styles */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  z-index: 99;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  gap: 12px;
}

.mobile-nav .nav-item {
  padding: 8px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .system-header {
    padding: 0 16px;
  }

  .main-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .username {
    display: none;
  }

  .nav-right {
    gap: 16px;
  }
}
</style>
