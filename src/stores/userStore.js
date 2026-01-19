/*
 * 用户信息管理Store
 * 使用Pinia实现的状态管理，用于管理用户基本信息、学习目标和个人设置
 * 包含用户信息的增删改查、学习目标管理等功能
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  // 用户基本信息
  const userInfo = ref({
    id: 1,
    name: '张三',
    studentId: '2025001',
    grade: '高三',
    class: '1班',
    avatar: '',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    joinDate: '2025-09-01'
  })

  // 学习目标
  const learningGoals = ref({
    totalScore: 680, // 总分目标
    subjects: {
      chinese: 120,
      math: 140,
      english: 130,
      physics: 90,
      chemistry: 85,
      biology: 95
    },
    examDate: '2028-06-07', // 目标考试日期
    currentRank: 50, // 当前班级排名
    targetRank: 10 // 目标班级排名
  })

  // 学科偏好
  const subjectPreferences = ref({
    favoriteSubjects: ['math', 'physics'],
    weakSubjects: ['english', 'biology'],
    studyOrder: ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english']
  })

  // 学习统计
  const learningStats = ref({
    totalStudyHours: 245.5,
    averageDailyHours: 6.8,
    completedCourses: 12,
    achievedGoals: 3
  })

  // 个人设置
  const settings = ref({
    notificationEnabled: true,
    theme: 'light',
    language: 'zh-CN',
    autoSave: true,
    studyReminder: {
      enabled: true,
      time: '09:00'
    },
    goalReminder: {
      enabled: true,
      frequency: 'weekly'
    }
  })

  // 计算属性
  // 获取用户全名
  const fullName = computed(() => userInfo.value.name)

  // 获取用户身份信息
  const userIdentity = computed(() => {
    return `${userInfo.value.grade} ${userInfo.value.class} - ${userInfo.value.studentId}`
  })

  // 获取总分目标进度百分比
  const totalScoreProgress = computed(() => {
    // 假设当前总分是620（实际应该从成绩系统获取）
    const currentScore = 620
    return Math.min(100, Math.round((currentScore / learningGoals.value.totalScore) * 100))
  })

  // 获取各学科目标进度
  const subjectsProgress = computed(() => {
    // 假设当前各学科成绩
    const currentScores = {
      chinese: 110,
      math: 135,
      english: 115,
      physics: 82,
      chemistry: 80,
      biology: 88
    }

    return Object.entries(learningGoals.value.subjects).map(([subject, target]) => {
      const current = currentScores[subject] || 0
      return {
        subject,
        target,
        current,
        progress: Math.min(100, Math.round((current / target) * 100))
      }
    })
  })

  // 获取已完成的学习目标数量
  const completedGoalsCount = computed(() => learningStats.value.achievedGoals)

  // 计算学习效率评分
  const efficiencyScore = computed(() => {
    // 基于学习时长和完成任务情况计算效率
    // 这里简化处理，实际应该有更复杂的算法
    return Math.min(
      5,
      Math.round(learningStats.value.averageDailyHours * 0.8 + completedGoalsCount.value * 0.2)
    )
  })

  // 动作
  // 更新用户基本信息
  // @param {Object} data - 用户信息数据（部分更新）
  // @returns {void}
  function updateUserInfo(data) {
    userInfo.value = { ...userInfo.value, ...data }
  }

  // 更新学习目标
  // @param {Object} goals - 学习目标数据
  // @returns {void}
  function updateLearningGoals(goals) {
    learningGoals.value = { ...learningGoals.value, ...goals }
  }

  // 更新学科目标
  // @param {string} subject - 学科名称
  // @param {number} score - 目标分数
  // @returns {void}
  function updateSubjectGoal(subject, score) {
    learningGoals.value.subjects[subject] = score
  }

  // 更新学科偏好
  // @param {Object} preferences - 学科偏好数据
  // @returns {void}
  function updateSubjectPreferences(preferences) {
    subjectPreferences.value = { ...subjectPreferences.value, ...preferences }
  }

  // 添加/移除收藏学科
  // @param {string} subject - 学科名称
  // @returns {void}
  function toggleFavoriteSubject(subject) {
    const index = subjectPreferences.value.favoriteSubjects.indexOf(subject)
    if (index === -1) {
      subjectPreferences.value.favoriteSubjects.push(subject)
    } else {
      subjectPreferences.value.favoriteSubjects.splice(index, 1)
    }
  }

  // 添加/移除薄弱学科
  // @param {string} subject - 学科名称
  // @returns {void}
  function toggleWeakSubject(subject) {
    const index = subjectPreferences.value.weakSubjects.indexOf(subject)
    if (index === -1) {
      subjectPreferences.value.weakSubjects.push(subject)
    } else {
      subjectPreferences.value.weakSubjects.splice(index, 1)
    }
  }

  // 更新学习统计
  // @param {Object} stats - 学习统计数据
  // @returns {void}
  function updateLearningStats(stats) {
    learningStats.value = { ...learningStats.value, ...stats }
  }

  // 更新个人设置
  // @param {Object} newSettings - 个人设置数据
  // @returns {void}
  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
  }

  // 切换通知开关
  // @returns {void}
  function toggleNotifications() {
    settings.value.notificationEnabled = !settings.value.notificationEnabled
  }

  // 切换主题
  // @param {string} theme - 主题名称 (light, dark)
  // @returns {void}
  function setTheme(theme) {
    settings.value.theme = theme
    // 实际应用中这里应该更新DOM或CSS变量
    document.documentElement.setAttribute('data-theme', theme)
  }

  // 重置所有用户数据
  // @returns {void}
  function resetUserData() {
    // 重置为初始值
    userInfo.value = {
      id: 1,
      name: '张三',
      studentId: '2025001',
      grade: '高三',
      class: '1班',
      avatar: '',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      joinDate: '2025-09-01'
    }

    learningGoals.value = {
      totalScore: 680,
      subjects: {
        chinese: 120,
        math: 140,
        english: 130,
        physics: 90,
        chemistry: 85,
        biology: 95
      },
      examDate: '2028-06-07',
      currentRank: 50,
      targetRank: 10
    }

    subjectPreferences.value = {
      favoriteSubjects: ['math', 'physics'],
      weakSubjects: ['english', 'biology'],
      studyOrder: ['math', 'physics', 'chemistry', 'biology', 'chinese', 'english']
    }

    learningStats.value = {
      totalStudyHours: 245.5,
      averageDailyHours: 6.8,
      completedCourses: 12,
      achievedGoals: 3
    }

    settings.value = {
      notificationEnabled: true,
      theme: 'light',
      language: 'zh-CN',
      autoSave: true,
      studyReminder: {
        enabled: true,
        time: '09:00'
      },
      goalReminder: {
        enabled: true,
        frequency: 'weekly'
      }
    }
  }

  // 持久化
  // 从localStorage读取保存的状态
  const savedUserState = localStorage.getItem('user-state')
  if (savedUserState) {
    const state = JSON.parse(savedUserState)
    if (state.userInfo) userInfo.value = state.userInfo
    if (state.learningGoals) learningGoals.value = state.learningGoals
    if (state.subjectPreferences) subjectPreferences.value = state.subjectPreferences
    if (state.learningStats) learningStats.value = state.learningStats
    if (state.settings) {
      settings.value = state.settings
      // 应用主题设置
      document.documentElement.setAttribute('data-theme', settings.value.theme)
    }
  }

  // 监听用户状态变化并持久化到localStorage
  watch(
    [userInfo, learningGoals, subjectPreferences, learningStats, settings],
    () => {
      localStorage.setItem(
        'user-state',
        JSON.stringify({
          userInfo: userInfo.value,
          learningGoals: learningGoals.value,
          subjectPreferences: subjectPreferences.value,
          learningStats: learningStats.value,
          settings: settings.value
        })
      )
    },
    { deep: true }
  )

  return {
    userInfo,
    learningGoals,
    subjectPreferences,
    learningStats,
    settings,
    fullName,
    userIdentity,
    totalScoreProgress,
    subjectsProgress,
    completedGoalsCount,
    efficiencyScore,
    updateUserInfo,
    updateLearningGoals,
    updateSubjectGoal,
    updateSubjectPreferences,
    toggleFavoriteSubject,
    toggleWeakSubject,
    updateLearningStats,
    updateSettings,
    toggleNotifications,
    setTheme,
    resetUserData
  }
})
