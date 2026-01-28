/*
 * 日报信息管理Store
 * 使用Pinia实现的状态管理，用于管理每日学习报告
 * 包含报告的增删改查、统计分析等功能
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import mockData from '../mock/dailyReports.json'

export const useReportStore = defineStore('reports', () => {
  // 日报
  const reports = ref([])

  // 分页相关状态
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 弹窗相关状态
  const dialogVisible = ref(false)
  const editingData = ref(null)

  // 表格列配置
  const columns = ref([
    { prop: 'date', label: '日期', minWidth: 140 },
    { prop: 'discipline', label: '学科' },
    { prop: 'examHalfTime', label: '考试做完一半时间' },
    { prop: 'examFinishTime', label: '考试做完时间' },
    { prop: 'halfTimeCompletion', label: '考试一半时间完成量' },
    { prop: 'mistakeList', label: '错题照片', minWidth: 140, render: true },
    { prop: 'todo-list', label: 'TODOs', render: true },
    { label: '操作', fixed: 'right', width: 80, operation: true }
  ])

  // 弹窗控制方法
  function showDialog(row = null) {
    editingData.value = row
    dialogVisible.value = true
  }

  function hideDialog() {
    dialogVisible.value = false
    editingData.value = null
  }

  // 清理blob URL的函数
  function cleanupBlobUrls(reportsData) {
    return reportsData.map(report => {
      if (report.mistakeList && Array.isArray(report.mistakeList)) {
        // 过滤掉blob URL，只保留有效的图片URL或base64数据
        report.mistakeList = report.mistakeList.filter(photo => {
          return typeof photo === 'string' && !photo.startsWith('blob:')
        })
      }
      return report
    })
  }

  // 初始化数据
  function initReports() {
    // 使用mock数据初始化
    reports.value = mockData.dailyReports
  }

  // 初始化
  initReports()

  // 计算属性
  // 获取所有报告
  const allReports = computed(() => reports.value)

  // 获取报告总数
  const totalReports = computed(() => reports.value.length)

  // 获取当前页报告
  const currentPageReports = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return reports.value.slice(start, end)
  })

  // 按学科分组的报告
  const reportsByDiscipline = computed(() => {
    return reports.value.reduce((groups, report) => {
      const discipline = report.discipline || '其他'
      if (!groups[discipline]) {
        groups[discipline] = []
      }
      groups[discipline].push(report)
      return groups
    }, {})
  })

  // 动作
  // 创建新报告
  // @param {Object} reportData - 报告数据
  // @returns {void}
  function createReport(reportData) {
    const newReport = {
      id: `day${Date.now()}`, // 生成唯一ID
      ...reportData
    }
    reports.value.push(newReport)
  }

  // 更新报告
  // @param {string} id - 报告ID
  // @param {Object} data - 更新的数据
  // @returns {void}
  function updateReport(id, data) {
    const index = reports.value.findIndex((report) => report.id === id)
    if (index !== -1) {
      reports.value[index] = { ...reports.value[index], ...data }
    }
  }

  // 设置当前页码
  // @param {number} page - 页码
  // @returns {void}
  function setCurrentPage(page) {
    currentPage.value = page
  }

  // 设置每页大小
  // @param {number} size - 每页大小
  // @returns {void}
  function setPageSize(size) {
    pageSize.value = size
    // 切换每页大小时重置为第一页
    currentPage.value = 1
  }



  return {
    // 状态
    reports,
    currentPage,
    pageSize,
    dialogVisible,
    editingData,
    columns,

    // 计算属性
    allReports,
    totalReports,
    currentPageReports,
    reportsByDiscipline,

    // 方法
    createReport,
    updateReport,
    setCurrentPage,
    setPageSize,
    showDialog,
    hideDialog
  }
})
