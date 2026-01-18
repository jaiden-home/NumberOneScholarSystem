/*
 * 时间管理Store
 * 使用Pinia实现的状态管理，用于管理时间信息、日期计算、周数据生成等功能
 */
import { defineStore } from 'pinia'

export const useTimeStore = defineStore('time', () => {

  // 系统开始学习时间
  const initStartDate = new Date('2025/9/1')

  // DES 考试开始时间
  const examDate = new Date(2028, 3, 10)

  // 当前时间
  const currentTime = new Date()

  // 周名字
  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六']

  // 当前显示的年份
  const currentYear = currentTime.getFullYear()

  // 当前显示的月份
  const currentMonth = currentTime.getMonth() + 1

  // 当前显示周
  const weekday = currentTime.getDay()

  // 当前显示周名
  const weekdayName = weekdayNames[currentTime.getDay()]

  // 当前显示的日
  const currentDate = currentTime.getDate()

  // 当前循环周
  const currentWeek = calculateCurrentWeek()

  // 距考试时间
  const daysLeft = getDaysDifference(examDate, currentTime)

  // 计算当前日期属于第几周
  function calculateCurrentWeek  ()  {
    const firstDayOfWeek = initStartDate.getDay()
    // 调整：ISO标准中周一是一周的开始（0表示周一）, 将周日(0)调整为6，周一(1)调整为0，以此类推
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    // 循环周数取模
    const cycleWeekDay = getCycleWeekDay(currentTime,initStartDate,adjustedFirstDay)
    return cycleWeekDay === 0 ? 4 : cycleWeekDay
  }

  // 时间相关计算函数
  function getDaysDifference(startDate, endDate) {
    return Math.ceil((startDate - endDate) / (1000 * 60 * 60 * 24)) + 1
  }

  // 计算循环周数
  function getCycleWeekDay (startTime,endDate,firstDay ){
    return Math.ceil((getDaysDifference(startTime, endDate) + firstDay) / 7) % 4
  }

  return {
    currentTime,
    currentYear,
    currentMonth,
    currentWeek,
    weekday,
    weekdayName,
    currentDate,
    initStartDate,
    examDate,
    daysLeft,
  }

})
