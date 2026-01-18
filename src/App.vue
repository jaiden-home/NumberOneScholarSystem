<template>
  <router-view></router-view>
</template>

<script setup>
// 布局逻辑现在由特定的视图或布局处理（如果需要）。
// App.vue 作为根路由器出口。
</script>

<style>
/* 用于移动设备兼容性的全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* 移动优先的响应式设计 */
@media (max-width: 768px) {
  html,
  body {
    font-size: 14px;
  }

  .container {
    padding: 10px !important;
  }
}

@media (max-width: 480px) {
  html,
  body {
    font-size: 13px;
  }

  .container {
    padding: 5px !important;
  }
}
</style>
