<template>
  <SystemHeader />
  <div class="container">
    <StudyDashboardHeader />
    <MonthView @open-sidebar="openSidebar" />
    <DailyReportSection ref="reportSectionRef" />

    <div class="quick-add" @click="addDailyReport()">+</div>

    <TaskSidebar :is-open="isSidebarOpen" :initial-data="editingTask" @close="closeSidebar" />

    <TodoPanel />
  </div>
</template>

<script setup>
import SystemHeader from '../components/SystemHeader.vue'
import StudyDashboardHeader from '../components/StudyDashboardHeader.vue'
import TodoPanel from '../components/TodoPanel.vue'
import DailyReportSection from '../components/DailyReportSection.vue'
import MonthView from '../components/MonthView.vue'
import TaskSidebar from '../components/TaskSidebar.vue'
import { ref } from 'vue'

const isSidebarOpen = ref(false)
const editingTask = ref(null)
const reportSectionRef = ref(null)

function openSidebar(payload) {
  if (payload && payload.task) {
    editingTask.value = payload.task
  } else if (payload && payload.day !== undefined) {
    editingTask.value = { week: payload.day } // 传递星期几索引
  } else {
    editingTask.value = null
  }
  isSidebarOpen.value = true
}

function closeSidebar() {
  isSidebarOpen.value = false
  editingTask.value = null
}

// 添加日报函数
function addDailyReport() {
  // 调用DailyReportSection组件的generateReport方法
  if (reportSectionRef.value) {
    reportSectionRef.value.handleAddReport()
  }
}
</script>

<style scoped>
/* DashboardView 页面响应式样式 */
@media (max-width: 768px) {
  /* 调整容器边距 */
  .container {
    padding: 16px;
  }

  /* 调整快速添加按钮位置 */
  .quick-add {
    bottom: 30px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  /* 进一步调整容器边距 */
  .container {
    padding: 12px;
  }
}
</style>
