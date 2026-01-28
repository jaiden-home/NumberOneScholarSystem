/*
 * 排班信息管理Store
 * 使用Pinia实现的状态管理，用于管理学习或工作排班
 * 包含周排班表、时间段设置、学科分配等功能
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useTimeStore } from './timeStore'

export const useScheduleStore = defineStore('schedule', () => {
  // 引用时间store
  const timeStore = useTimeStore()
  // 可用的周列表（当前月共4周）
  const tabWeeks = [1, 2, 3, 4]
  // tab选中当前周
  const currentWeekTab = ref(timeStore.currentWeek)
  // 本月周的范围
  const weekRange = ref([])
  // 当前周的时间范围
  const currentRangeStr = ref('')
  // 月的周总数据；
  const weekData = ref({ 1: null, 2: null, 3: null, 4: null })
  // 排班表数组
  const schedules = ref([])
  // 获取当前周的日期列表
  const currentWeekDate = computed(() => weekData.value[currentWeekTab.value] || [])
  // 设置当前tab是那周
  const setCurrentWeekTab = (week) => (currentWeekTab.value = week)
  // 获得本月开始时间和结束时间
  const {
    startDate,
    endDate,
    weekRange: temp
  } = getWeekDataRange(
    new Date(`${timeStore.currentYear}/${timeStore.currentMonth}/${timeStore.currentDate}`),
    timeStore.currentWeek,
    timeStore.weekday
  )
  // 当前周的时间范围-按周请求
  weekRange.value = temp
  // 当前周的显示文案
  currentRangeStr.value = showCurrentRange(weekRange.value[currentWeekTab.value - 1])
  // 通过周几来获得当前日期
  const getDateByWeekday = (week) => currentWeekDate.value[week]?.date
  // 获取当前月时间范围
  function getWeekDataRange(date = new Date(), week, weekday) {
    // 星期天转成7
    const adjustedWeekday = weekday ? weekday : 7
    // 第1周星期一距离当前有多少天
    const dayPreludeWeek = 7 * week + adjustedWeekday - 7
    // 第1周第一天的日期
    const startDate = formatDate(calculateDate(date, -dayPreludeWeek))
    // 最后1周最后一天的日期
    const endDate = formatDate(calculateDate(new Date(startDate), 4 * 7))
    // 存储4周的日期范围
    const weekRange = []
    // 循环生成4周的日期范围
    for (let i = 0; i < 4; i++) {
      // 计算本周的开始日期
      const weekStartDate = new Date(startDate)
      weekStartDate.setDate(weekStartDate.getDate() + i * 7)

      // 计算本周的结束日期（开始日期 + 7天）
      const weekEndDate = calculateDate(weekStartDate, 7)

      // 格式化日期并添加到范围数组
      weekRange.push({
        startDate: formatDate(weekStartDate),
        endDate: formatDate(weekEndDate)
      })
    }
    // 返回时间范围
    return {
      startDate,
      endDate,
      weekRange
    }
  }
  // 计算相对于给定日期的目标日期
  function calculateDate(date, days) {
    const timestamp = new Date(date).getTime()
    const oneDayMs = 24 * 60 * 60 * 1000 // 一天的毫秒数
    const newTimestamp = timestamp + days * oneDayMs
    // 显示需求：当天不进入计算
    const adjustedTimestamp = days > 0 ? newTimestamp - oneDayMs : newTimestamp + oneDayMs
    return new Date(adjustedTimestamp)
  }
  // 将Date对象格式化为字符串
  function formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // JavaScript月份从0开始，需要+1
    const day = date.getDate()
    return `${year}/${month}/${day}`
  }
  // 显示当前日期范围的格式化文本
  function showCurrentRange({ startDate, endDate }) {
    const [, fromMonth, fromDay] = startDate.split('/')
    const [, toMonth, toDay] = endDate.split('/')
    return fromMonth === toMonth
      ? `${fromMonth}月${fromDay}~${toDay}日`
      : `${fromMonth}月${fromDay}日~${toMonth}月${toDay}日`
  }
  // 从tasks引用更新weekData任务的函数
  function updateWeekDataSchedules() {
    weekData.value[currentWeekTab.value].forEach((item) => {
      // 清空表的任务数组
      item.schedules = []
      // 任务是一天则把当前任务更新
      schedules.value.forEach((schedule) => {
        if (item.date === schedule.date) {
          item.schedules.push(schedule)
        }
      })
    })
  }
  // 添加新任务
  function addTask(task) {
    schedules.value.push({
      id: Date.now(),
      week: currentWeekTab.value,
      ...task
    })
  }
  // 删除任务
  function removeTask(id) {
    const index = schedules.value.findIndex((t) => t.id === id)
    if (index !== -1) schedules.value.splice(index, 1)
  }
  // 移动任务到指定日期
  function moveTask(id, targetDay) {
    const task = schedules.value.find((t) => t.id === id)
    if (task) {
      task.date = targetDay
      // 根据新的日期更新星期信息
      const dayInfo = weekData.value[currentWeekTab.value].find(item => item.date === targetDay)
      if (dayInfo) {
        task.week = weekData.value[currentWeekTab.value].indexOf(dayInfo)
      }
    }
  }

  // 检查日期是否在当前日期之前
  function isDateBeforeToday(dateStr) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(dateStr)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }
  // 从localStorage加载保存的状态
  function loadSavedState() {
    const savedState = localStorage.getItem('scholar-system-state')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        // 如果有保存的排班数据，则恢复到schedules中
        schedules.value = state.schedules || []
      } catch (error) {
        console.error('加载保存的状态失败:', error)
      }
    }
  }
  // 将data平均分成指定份数，赋值给weekData
  function splitDataIntoWeeks(data, weekCount) {
    const itemsPerWeek = Math.ceil(data.length / weekCount)
    for (let i = 0; i < weekCount; i++) {
      const startIndex = i * itemsPerWeek
      const endIndex = startIndex + itemsPerWeek
      weekData.value[i + 1] = data.slice(startIndex, endIndex)
    }
  }
  // ------------- mock数据 -------------- //
  const generateMockDataByDateRange = (startDateStr, endDateStr) => {
    // 将外部变量移到函数内部定义
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const weekdayMap = {
      monday: '星期一',
      tuesday: '星期二',
      wednesday: '星期三',
      thursday: '星期四',
      friday: '星期五',
      saturday: '星期六',
      sunday: '星期日'
    }

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    const mockData = []
    const today = new Date()

    // 验证日期有效性
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date format. Please use "YYYY/MM/DD" format.')
      return mockData
    }

    // 确保startDate <= endDate
    if (startDate > endDate) {
      console.error('startDate must be before or equal to endDate.')
      return mockData
    }

    // 遍历日期区间
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1 // 转换为0-6（周一到周日）
      const dayName = weekDays[dayIndex]
      const dateNum = currentDate.getDate()
      const monthNum = currentDate.getMonth() + 1
      const yearNum = currentDate.getFullYear()

      // 检查是否是今天
      const isToday =
        currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getDate() === today.getDate()

      mockData.push({
        date: `${yearNum}/${monthNum}/${dateNum}`,
        dateStr: `${monthNum}月${dateNum}日`,
        isToday: isToday,
        schedules: [],
        weekday: weekdayMap[dayName]
      })

      // 移动到下一天
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return mockData
  }
  const data = generateMockDataByDateRange(startDate, endDate)
  // ----------------------------------- //
  // 监听任务变化并更新weekData
  watch([schedules, currentWeekTab], () => updateWeekDataSchedules(), { deep: true })
  // 监听状态变化并持久化到localStorage
  watch(
    [schedules],
    () =>
      localStorage.setItem('scholar-system-state', JSON.stringify({ schedules: schedules.value })),
    { deep: true }
  )
  // 监听currentWeekTab变化，更新当前周的时间范围
  watch(currentWeekTab, (week) => {
    currentRangeStr.value = showCurrentRange(weekRange.value[week - 1])
  })

  // 切成4份数据
  splitDataIntoWeeks(data, 4)
  // 初始化加载保存的状态
  loadSavedState()
  // 初始更新weekData任务，并在任务变化时更新
  updateWeekDataSchedules()
  return {
    currentWeekTab, // 选中那个周
    currentRangeStr, // 显示周的时间范围
    tabWeeks, // 周tab栏
    currentWeekDate, // 当周的日期
    schedules, // 排班列表
    setCurrentWeekTab, // 设置当前周 currentWeekTab
    getDateByWeekday, // 获取周几是几号
    addTask, // 添加任务
    removeTask, // 删除任务
    moveTask, // 移动任务到指定日期
    isDateBeforeToday // 检查日期是否在当前日期之前
  }
})
