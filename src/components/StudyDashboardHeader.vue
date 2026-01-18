<template>
  <div class="header">
    <!-- 上部区域: 标题 + 时间信息 -->
    <div class="header-top">
      <div class="header-left">
        <h1>备考月视图与日报</h1>
        <p>规划每周学习任务，记录每日学习情况</p>
      </div>

      <div class="header-right">
        <!-- 时间信息 -->
        <div class="time-info-container">
          <div class="time-info-block">
            <div class="time-info-main">
              <span class="time-value-large" id="currentDate"
                >{{ currentYear }}年{{ currentMonth }}月{{ currentDate }}日 星期{{ weekdayName }}</span
              >
            </div>
            <div class="time-info-label">今日</div>
          </div>

          <div class="time-divider">|</div>

          <div class="time-info-block">
            <div class="time-info-main">
              <span class="time-value-large" id="currentWeek">第{{ currentWeek }}周</span>
            </div>
            <div class="time-info-label">{{ weekInfo[currentWeek] }}</div>
          </div>

          <div class="time-divider">|</div>

          <div class="time-info-block urgent">
            <div class="time-info-main">
              <span class="time-value-large countdown" id="daysLeft">{{ daysLeft }}天</span>
            </div>
            <div class="time-info-label">至DSE考试倒计时</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下部区域: 重点关注提示 -->
    <div class="header-tips">
      <div class="urgent-alert">
        <div class="alert-title">
          <span class="alert-icon">⚠️</span>
          <span class="alert-text">学习提示</span>
        </div>
        <ul class="alert-list">
          <li v-for="alert in alerts" :key="alert.id" class="alert-item">
            <span :class="['alert-dot', alert.type]"></span>
            <span class="alert-message">{{ alert.message }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimeStore } from '../stores/timeStore'
import { useSystemStore } from '../stores/systemStore'

const timeStore = useTimeStore()
const systemStore = useSystemStore()

const weekdayName = computed(() => timeStore.weekdayName)
const currentWeek = computed(() => timeStore.currentWeek)
const daysLeft = computed(() => timeStore.daysLeft)
const currentYear = computed(() => timeStore.currentYear)
const currentMonth = computed(() => timeStore.currentMonth)
const currentDate = computed(() => timeStore.currentDate)

const weekInfo = computed(() => systemStore.weeklyThemeTitle)
const alerts = computed(() => systemStore.alerts)

</script>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-right {
    width: 100%;
  }

  .time-info-container {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .header h1 {
    font-size: 1.4rem;
  }

  .header p {
    font-size: 0.85rem;
  }

  .urgent-alert {
    padding: 12px 16px;
  }

  .alert-message {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 16px 12px;
  }

  .header h1 {
    font-size: 1.2rem;
  }

  .time-info-container {
    gap: 10px;
  }

  .time-info-block {
    min-width: 50px;
  }

  .time-value-large {
    font-size: 0.9rem;
  }

  .time-info-label {
    font-size: 0.65rem;
  }
}
</style>
