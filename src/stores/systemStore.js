/*
 * 系统信息管理Store
 * 使用Pinia实现的状态管理，用于管理系统配置和状态
 * 包含系统设置、提示信息、版本信息、备份恢复等功能
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  // 主题名称
  const weeklyThemeTitle = {
    1: '模拟实战定位',
    2: '真题大纲归纳',
    3: '错题分析总结',
    4: '专项练习提升'
  }

  // 学习提示数据
  const alerts = ref([
    { id: 1, type: 'red', message: '你的数学成绩数据分析显示需要提升' },
    { id: 2, type: 'red', message: '你的数学考试完成时间需要优化' },
    { id: 3, type: 'orange', message: '你的数学学习目标需要重新调整' },
    { id: 4, type: 'orange', message: '你的语文目标需要重新调整' }
  ])

  return {
    weeklyThemeTitle,
    alerts
  }
})
