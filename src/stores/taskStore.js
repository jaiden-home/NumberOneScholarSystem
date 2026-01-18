/*
 * 学习任务管理Store
 * 使用Pinia实现的状态管理，用于管理学习任务、日报、待办事项、学习提示和时间信息
 * 包含任务的增删改查、状态持久化、周视图数据处理、时间计算等功能
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTaskStore = defineStore('tasks', () => {
  // 常量

  // 当前时间
  const now = ref(new Date('2025/10/1'))

  // 可用的周列表（当前月共4周）
  const availableWeeks = ['1', '2', '3', '4']

  // 时间相关常量
  const initStartDate = new Date('2025/9/1') // 系统开始学习时间
  const examDate = new Date(2028, 3, 10) // DES 考试开始时间
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  // 状态
  // 当前选中的周（默认为第1周）
  const currentWeek = ref('1')



  // 当前显示的月份
  const currentMonth = ref('')

  // 周数据结构
  // 按周号组织，每个周包含7天的信息
  // day对象结构：{ date, day, key, weekday, dateStr, tasks }
  // - date: 日期数字
  // - day: 英文星期几 (monday, tuesday, ...)
  // - key: 同day，用于标识
  // - weekday: 中文星期几
  // - dateStr: 格式化日期字符串
  // - tasks: 当天的任务数组
  const weekData = ref({})

  // 中文星期几映射
  const weekdayMap = {
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日'
  }

  // 英文星期几数组（周一到周日）
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  // 生成动态周数据的函数
  const generateWeekData = (date = new Date()) => {
    const dateInfo = getDateInfo(date, false)

    // 设置currentMonth
    currentMonth.value = `${dateInfo.year}年${dateInfo.month + 1}月`

    // 创建当前月的第一天
    const firstDayOfMonth = new Date(dateInfo.year, dateInfo.month, 1)

    // 找到本月的第一个星期一
    // 如果第一天不是星期一，则找到上一个星期一
    let firstMonday = new Date(firstDayOfMonth)
    const firstDayWeekday = firstMonday.getDay() // 0-6, 0是星期日
    const daysToFirstMonday = firstDayWeekday === 1 ? 0 : (1 - firstDayWeekday + 7) % 7
    firstMonday.setDate(firstMonday.getDate() + daysToFirstMonday)

    // 生成4周的数据
    const newWeekData = {}

    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const weekDaysData = []
      const currentDate = new Date(firstMonday)

      // 计算本周的起始日期
      currentDate.setDate(currentDate.getDate() + (weekNum - 1) * 7)

      // 生成本周7天的数据
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayDate = new Date(currentDate)
        dayDate.setDate(dayDate.getDate() + dayIndex)

        const dayName = weekDays[dayIndex]
        const dateNum = dayDate.getDate()
        const monthNum = dayDate.getMonth() + 1

        // 检查是否是今天
        const today = new Date()
        const isToday = dayDate.getFullYear() === today.getFullYear() &&
                       dayDate.getMonth() === today.getMonth() &&
                       dayDate.getDate() === today.getDate()

        weekDaysData.push({
          date: dateNum,
          day: dayName,
          key: dayName,
          isToday: isToday,
          weekday: weekdayMap[dayName],
          dateStr: `${monthNum}月${dateNum}日`,
          tasks: []
        })
      }

      newWeekData[weekNum] = weekDaysData
    }

    weekData.value = newWeekData
  }

  // 初始生成周数据
  generateWeekData(now.value)

  // 计算当前日期属于第几周
  const calculateCurrentWeek = () => {
    // 使用与 adjustedCycleWeekDay 相同的逻辑计算当前周次
    // 开始那天是星期几（0-6，0是周日）
    const firstDayOfWeek = initStartDate.getDay()
    // 调整：ISO标准中周一是一周的开始（0表示周一）, 将周日(0)调整为6，周一(1)调整为0，以此类推
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    // 计算循环周数
    const cycleWeekDay = Math.ceil((getDaysDifference(now.value, initStartDate) + adjustedFirstDay) / 7) % 4
    return cycleWeekDay === 0 ? '4' : cycleWeekDay.toString()
  }

  // 从tasks引用更新weekData任务的函数
  // 功能：将tasks数组中的任务分配到weekData中对应的日期
  // 实现步骤：
  // 1. 清空weekData中所有日期的tasks数组
  // 2. 遍历tasks数组，将每个任务添加到对应的日期中
  // 3. 匹配规则：根据task.week与weekData的周数以及task.day与weekData中day对象的day属性进行匹配
  const updateWeekDataTasks = () => {
    // 清空所有任务数组
    Object.values(weekData.value).forEach((week) => {
      week.forEach((day) => {
        day.tasks = []
      })
    })

    // 将任务分配到对应的周和日期
    tasks.value.forEach((task) => {
      const week = weekData.value[task.week]
      if (week) {
        const day = week.find((d) => d.day === task.day)
        if (day) {
          day.tasks.push(task)
        }
      }
    })
  }
  // 任务数组
  // task对象结构：{ id, week, day, title, subject, description, duration, priority, completed }
  // - id: 任务唯一标识
  // - week: 任务所属周数
  // - day: 任务所属星期几
  // - title: 任务标题
  // - subject: 学科 (chinese, english, ...)
  // - description: 任务描述
  // - duration: 预计时长（小时）
  // - priority: 优先级 (high, medium, low)
  // - completed: 完成状态
  const tasks = ref([])

  // 每日学习报告
  // 按星期几组织，记录每天的学习情况
  // report对象结构：{ date, weekday, status, hours, efficiency, mood, notes }
  // - date: 日期字符串
  // - weekday: 中文星期几
  // - status: 状态 (completed, in-progress)
  // - hours: 学习时长（小时）
  // - efficiency: 效率评分 (1-5)
  // - mood: 心情表情
  // - notes: 学习笔记
  const reports = ref({
    monday: {
      date: '3月11日',
      weekday: '周一',
      status: 'completed',
      hours: 7.5,
      efficiency: 4.5,
      mood: '😊',
      notes: '完成了语文和英语模拟考，英语听力部分还需要加强'
    },
    tuesday: {
      date: '3月12日',
      weekday: '周二',
      status: 'completed',
      hours: 6.0,
      efficiency: 3.8,
      mood: '😐',
      notes: '数学考试时间不够，最后两道大题没做完，需要提升解题速度'
    },
    wednesday: {
      date: '3月13日',
      weekday: '周三',
      status: 'in-progress',
      hours: 4.5,
      efficiency: 4.0,
      mood: '😔',
      notes: '上午分析数学错题收获很大，下午有点疲劳，效率下降'
    }
  })

  // 简单待办事项
  // todo对象结构：{ id, text, completed }
  // - id: 待办事项唯一标识
  // - text: 待办事项内容
  // - completed: 完成状态
  const simpleTodos = ref([
    { id: 1, text: '明天早上 8 点前完成数学错题本整理', completed: false },
    { id: 2, text: '给班主任发邮件确认模拟考时间', completed: true },
    { id: 3, text: '下载最新的英语听力材料', completed: false }
  ])

  // 学习提示数据
  // alert对象结构：{ id, type, message }
  // - id: 提示唯一标识
  // - type: 提示类型 (red, orange)
  // - message: 提示内容
  const alerts = ref([
    { id: 1, type: 'red', message: '你的数学成绩数据分析显示需要提升' },
    { id: 2, type: 'red', message: '你的数学考试完成时间需要优化' },
    { id: 3, type: 'orange', message: '你的数学学习目标需要重新调整' },
    { id: 4, type: 'orange', message: '你的语文目标需要重新调整' }
  ])

  // 计算属性
  // 根据星期几获取任务列表
  // @param {string} day - 星期几 (monday, tuesday, ...)
  // @returns {ComputedRef<Array>} - 当天的任务数组
  const getTasksByDay = (day) => computed(() => tasks.value.filter((t) => t.day === day))

  // 获取当前周的信息
  // @returns {Object} - 周信息对象
  // @property {Object} titles - 各周的主题
  // @property {string} range - 当前周的日期范围
  // @property {string} title - 当前周的主题
  // @property {string} weekNum - 当前周号
  const weekInfo = computed(() => {
    // 动态计算各周的日期范围
    const ranges = {}
    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const weekDays = weekData.value[weekNum]
      if (weekDays && weekDays.length > 0) {
        const firstDay = weekDays[0].dateStr
        const lastDay = weekDays[6].dateStr
        ranges[weekNum] = `${firstDay} - ${lastDay}`
      }
    }

    const titles = {
      1: '模拟实战定位',
      2: '真题大纲归纳',
      3: '错题分析总结',
      4: '专项练习提升'
    }

    return {
      titles,
      range: ranges[currentWeek.value] || '',
      title: titles[currentWeek.value] || titles['1'],
      weekNum: currentWeek.value
    }
  })

  // 获取当前周的日期列表
  // @returns {Array} - 当前周的7天数据数组
  const weekDates = computed(() => {
    return weekData.value[currentWeek.value] || weekData.value['3']
  })

  // 时间相关计算函数
  function getDaysDifference(startDate, endDate) {
    return Math.ceil((startDate - endDate) / (1000 * 60 * 60 * 24)) + 1
  }

  // 统一日期处理函数
  function getDateInfo(date, monthStartFromOne = true) {
    const d = new Date(date)
    return {
      year: d.getFullYear(),
      month: monthStartFromOne ? d.getMonth() + 1 : d.getMonth(),
      date: d.getDate(),
      weekday: weekdays[d.getDay()],
      dayName: weekDays[(d.getDay() === 0 ? 6 : d.getDay() - 1)] // 获取英文星期几名称
    }
  }

  // 当前日期信息
  const currentDate = computed(() => {
    return getDateInfo(now.value)
  })

  // 调整后的循环周次
  const adjustedCycleWeekDay = computed(() => {
    // 开始那天是星期几（0-6，0是周日）
    const firstDayOfWeek = initStartDate.getDay()
    // 调整：ISO标准中周一是一周的开始（0表示周一）, 将周日(0)调整为6，周一(1)调整为0，以此类推
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    // 计算循环周数
    const cycleWeekDay = Math.ceil((getDaysDifference(now.value, initStartDate) + adjustedFirstDay) / 7) % 4
    return cycleWeekDay === 0 ? 4 : cycleWeekDay
  })

  // 距考试时间
  const daysLeft = computed(() => {
    return getDaysDifference(examDate, now.value)
  })

  // 动作
  // 添加新任务
  // @param {Object} task - 任务对象
  // @param {string} task.day - 星期几 (monday, tuesday, ...)
  // @param {string} task.title - 任务标题
  // @param {string} task.subject - 学科
  // @param {string} task.description - 任务描述
  // @param {string} task.duration - 时长（小时）
  // @param {string} task.priority - 优先级 (high, medium, low)
  // @returns {void}
  function addTask(task) {
    tasks.value.push({
      id: Date.now(),
      week: currentWeek.value,
      completed: false,
      ...task
    })
  }

  // 删除任务
  // @param {number} id - 任务ID
  // @returns {void}
  function removeTask(id) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) tasks.value.splice(index, 1)
  }

  // 切换任务完成状态
  // @param {number} id - 任务ID
  // @returns {void}
  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.completed = !task.completed
  }

  // 更新学习报告
  // @param {string} day - 星期几 (monday, tuesday, ...)
  // @param {Object} data - 报告数据（部分更新）
  // @returns {void}
  function updateReport(day, data) {
    reports.value[day] = { ...reports.value[day], ...data }
  }

  // 添加待办事项
  // @param {string} text - 待办事项内容
  // @returns {void}
  function addTodo(text) {
    simpleTodos.value.push({
      id: Date.now(),
      text,
      completed: false
    })
  }

  // 删除待办事项
  // @param {number} id - 待办事项ID
  // @returns {void}
  function removeTodo(id) {
    const index = simpleTodos.value.findIndex((t) => t.id === id)
    if (index !== -1) simpleTodos.value.splice(index, 1)
  }

  // 切换待办事项完成状态
  // @param {number} id - 待办事项ID
  // @returns {void}
  function toggleTodo(id) {
    const todo = simpleTodos.value.find((t) => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  // 设置当前选中的周
  // @param {string} week - 周号
  // @returns {void}
  function setWeek(week) {
    currentWeek.value = week
  }



  // 持久化
  // 从localStorage读取保存的状态
  // 如果存在保存的状态，则恢复tasks、reports、simpleTodos和alerts，但不恢复currentWeek
  const savedState = localStorage.getItem('scholar-system-state')
  if (savedState) {
    const state = JSON.parse(savedState)
    if (state.tasks) {
      // 为没有week属性的任务设置默认值
      tasks.value = state.tasks.map(task => ({
        ...task,
        week: task.week || currentWeek.value
      }))
    }
    if (state.reports) reports.value = state.reports
    if (state.simpleTodos) simpleTodos.value = state.simpleTodos
    if (state.alerts) alerts.value = state.alerts
  }

  // 无论是否有保存的状态，都设置为当前周
  currentWeek.value = calculateCurrentWeek()

  // 初始更新weekData任务，并在任务变化时更新
  updateWeekDataTasks()

  // 监听任务变化并更新weekData
  // 当tasks数组发生变化（包括任务的增删改）时，自动更新weekData中的任务分配
  // 使用deep: true确保深度监听对象变化
  watch(
    tasks,
    () => {
      updateWeekDataTasks()
    },
    { deep: true }
  )

  // 监听状态变化并持久化到localStorage
  // 当tasks、reports、simpleTodos、currentWeek或alerts发生变化时
  // 自动将状态保存到localStorage，实现数据持久化
  // 使用deep: true确保深度监听对象变化
  watch(
    [tasks, reports, simpleTodos, currentWeek, alerts],
    () => {
      localStorage.setItem(
        'scholar-system-state',
        JSON.stringify({
          tasks: tasks.value,
          reports: reports.value,
          simpleTodos: simpleTodos.value,
          currentWeek: currentWeek.value,
          alerts: alerts.value
        })
      )
    },
    { deep: true }
  )

  return {
    currentWeek,
    tasks,
    reports,
    simpleTodos,
    alerts,
    availableWeeks,
    currentMonth,
    getTasksByDay,
    weekInfo,
    weekDates,
    addTask,
    removeTask,
    toggleTask,
    updateReport,
    addTodo,
    removeTodo,
    toggleTodo,
    setWeek,
    // 时间相关属性
    currentDate,
    adjustedCycleWeekDay,
    daysLeft,
  }
})
