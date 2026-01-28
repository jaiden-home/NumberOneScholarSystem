<template>
  <div class="month-view">
    <!-- 月视图头部 - 整合时间信息 -->
    <div class="month-header">
      <!-- 月份标题和操作按钮 -->
      <div class="month-title-row">
        <div class="month-title">
          {{ currentYear }}年{{ currentMonth }}月：
          <span id="month-subtitle">{{ weeklyThemeTitle[store.currentWeekTab] }}</span>
        </div>
        <div class="week-nav">
          <div
            v-for="week in store.tabWeeks"
            :key="week"
            class="week-tab"
            :class="{ active: store.currentWeekTab === week }"
            @click="setCurrentWeekTab(week)"
          >
            第{{ week }}周
          </div>
        </div>
      </div>
    </div>

    <!-- 当前周信息 -->
    <div class="current-week-info">
      <div class="week-range">第{{ store.currentWeekTab }}周：{{ store.currentRangeStr }}</div>
      <button class="btn-settings" :class="{ 'disabled': isCurrentWeekPast }" @click="openSettings">⚙️ 设置</button>
    </div>

    <!-- 周计划表格 -->
    <div class="week-plan-grid">
      <div v-for="(dayInfo, index) in store.currentWeekDate" :key="index" class="day-column">
        <div class="day-header" :class="{ today: dayInfo.isToday }">
          {{ dayInfo.weekday }}
          <div class="day-date">{{ dayInfo.dateStr }}</div>
        </div>

        <div
          class="tasks-container"
          :data-day="dayInfo.date"
          @dragover.prevent
          @drop="onDrop($event, dayInfo.date)"
        >
          <TaskCard
            v-for="task in dayInfo.schedules"
            :key="task.id"
            :task="task"
            :date="dayInfo.date"
            :is-past-date="store.isDateBeforeToday(dayInfo.date)"
            @delete="store.removeTask"
            @edit="editTask"
          />

          <div v-if="dayInfo.schedules.length === 0" class="empty-day" :class="{ 'disabled': store.isDateBeforeToday(dayInfo.date) }" @click="!store.isDateBeforeToday(dayInfo.date) && openAdd(index)">
            <div class="empty-day-icon">📝</div>
            <div>{{ store.isDateBeforeToday(dayInfo.date) ? '已过期' : '点击添加任务' }}</div>
          </div>

          <button v-else class="add-task-btn" :class="{ 'disabled': store.isDateBeforeToday(dayInfo.date) }" @click="!store.isDateBeforeToday(dayInfo.date) && openAdd(index)">{{ store.isDateBeforeToday(dayInfo.date) ? '已过期' : '+ 添加任务' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskCard from './TaskCard.vue'
import { useScheduleStore } from '../stores/scheduleStore'
import { useSystemStore } from '../stores/systemStore'
import { useTimeStore } from '../stores/timeStore'
import { computed } from 'vue'

const store = useScheduleStore()
const { weeklyThemeTitle } = useSystemStore()
const { currentYear, currentMonth } = useTimeStore()

const emit = defineEmits(['open-sidebar'])

// 检查当前周是否为过去的周
const isCurrentWeekPast = computed(() => {
  const currentWeek = store.currentWeekDate
  if (!currentWeek || currentWeek.length === 0) return false
  // 检查当前周是否有任何日期在今天或今天之后
  // 如果所有日期都在今天之前，则返回true
  return !currentWeek.some(day => !store.isDateBeforeToday(day.date))
})

function setCurrentWeekTab(week) {
  store.setCurrentWeekTab(week)
}

function openAdd(day) {
  emit('open-sidebar', { day })
}

function editTask(task) {
  emit('open-sidebar', { task })
}

function onDrop(event, targetDay) {
  const taskId = event.dataTransfer.getData('taskId')
  const sourceDay = event.dataTransfer.getData('sourceDay')

  if (sourceDay !== targetDay && !store.isDateBeforeToday(targetDay)) {
    store.moveTask(parseInt(taskId), targetDay)
  }
}

// 打开设置按钮
function openSettings() {
  if (!isCurrentWeekPast.value) {
    emit('open-sidebar')
  }
}
</script>

<style scoped>
/* 设置按钮样式 */
.btn-settings {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(74, 111, 255, 0.2);
}

.btn-settings:hover {
  background-color: #3a5fdd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 111, 255, 0.3);
}

.btn-settings:active {
  transform: translateY(0);
}

.btn-settings.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #e5e7eb;
  color: #6b7280;
}

.btn-settings.disabled:hover {
  background-color: #e5e7eb;
  transform: none;
  box-shadow: none;
}

/* MonthView 响应式样式 */
@media (max-width: 768px) {
  /* 调整整体容器 */
  .month-view {
    padding: 12px;
  }

  /* 调整月份标题行 */
  .month-title-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .month-title {
    font-size: 1.2rem;
    text-align: center;
  }

  /* 调整周导航 - 移动端 Tab 风格 */
  .week-nav {
    display: flex;
    gap: 4px;
    flex-wrap: nowrap;
    background-color: #eff6ff;
    padding: 4px;
    border-radius: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .week-tab {
    /* 重置 main.css 中的样式 */
    border: none;
    background: transparent;
    padding: 0;
    margin: 0;

    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    font-size: 14px;
    color: #64748b;
    border-radius: 8px;
    transition: all 0.3s ease;
    /* 确保触摸区域 */
    min-width: 44px;
    min-height: 44px;
  }

  .week-tab.active {
    background-color: #ffffff;
    color: var(--primary, #3b82f6);
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    transform: none;
    border: none;
  }

  /* 调整周计划表格，添加横向滚动 */
  .week-plan-grid {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap;
    gap: 12px;
  }

  .current-week-info {
    background-color: #f9fafb;
  }

  .btn-settings {
    background: none;
    color: #000;
    box-shadow: none;
    padding: 0;
  }

  .btn-settings.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #6b7280;
  }

  /* 调整日期列宽度 */
  .day-column {
    flex: 0 0 280px;
    min-width: 280px;
  }

  /* 调整日期头部 */
  .day-header {
    padding: 10px;
    font-size: 0.9rem;
  }

  .day-date {
    font-size: 0.8rem;
  }

  /* 调整任务容器 */
  .tasks-container {
    padding: 10px;
  }

  /* 调整空任务区域 */
  .empty-day {
    padding: 20px;
  }

  .empty-day-icon {
    font-size: 1.5rem;
  }

  /* 调整添加任务按钮 */
  .add-task-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  /* 调整月份标题 */
  .month-title {
    font-size: 1rem;
  }

  /* 调整周导航 */
  /* .week-tab 样式已在 768px 媒体查询中统一处理，此处移除以避免冲突 */

  /* 调整日期列宽度 */
  .day-column {
    flex: 0 0 240px;
    min-width: 240px;
  }

  /* 调整日期头部 */
  .day-header {
    padding: 8px;
    font-size: 0.8rem;
  }

  /* 调整空任务区域 */
  .empty-day {
    padding: 16px;
  }

  .empty-day-icon {
    font-size: 1.2rem;
  }

  /* 调整添加任务按钮 */
  .add-task-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

/* 禁用状态样式 */
.empty-day.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-task-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #e5e7eb;
  color: #6b7280;
}

.add-task-btn.disabled:hover {
  background-color: #e5e7eb;
  transform: none;
  box-shadow: none;
}
</style>
