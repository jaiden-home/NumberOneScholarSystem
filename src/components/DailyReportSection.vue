<template>
  <div class="daily-report-section">
    <div class="section-header">
      <div class="section-title">学习日报</div>
      <div class="report-header-right">
        <button
          class="btn btn-primary"
          id="addReportBtn"
          style="padding: 8px 16px; font-size: 0.9rem"
          @click="handleAddReport"
        >
          📝 添加日报
        </button>
      </div>
    </div>

    <!-- 日报表格 -->
    <el-table
      border
      stripe
      :data="store.currentPageReports"
      class="daily-report-table"
      ref="tableRef"
      style="width: 100%"
    >
      <el-table-column
        v-for="column in store.columns"
        :key="column.prop || column.label"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
        :width="column.width"
        :fixed="column.fixed"
      >
        <template v-if="column.operation || column.render" #default="scope">
          <span v-if="column.prop === 'hours'" class="study-hours">{{ scope.row.hours }}</span>
          <el-button
            v-else-if="column.label === '操作'"
            link
            type="primary"
            size="small"
            @click="handleAddReport(scope.row)"
            style="color: #4a6fff"
            >编辑</el-button
          >
          <div v-else-if="column.prop === 'mistakeList'" class="mistake-photos">
            <span
              v-if="!scope.row[column.prop] || scope.row[column.prop].length === 0"
              class="no-photos"
              >无</span
            >
            <div v-for="(photo, index) in scope.row[column.prop]" :key="index" class="photo-item">
              <el-image
                :src="photo"
                :alt="`错题${index + 1}`"
                class="mistake-photo"
                :preview-src-list="scope.row[column.prop]"
                fit="cover"
                preview-teleported
              >
              </el-image>
            </div>
          </div>
          <div v-else-if="column.prop === 'todo-list'" class="todo-list">
            <div v-if="scope.row[column.prop] && scope.row[column.prop].length > 0">
              <div v-for="(todo, index) in scope.row[column.prop]" :key="index" class="todo-item">
                {{ index + 1 }}. {{ todo }}
              </div>
            </div>
            <div v-else class="no-todos">无</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="store.currentPage"
        v-model:page-size="store.pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, prev, pager, next, jumper"
        :total="store.totalReports"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加日报弹窗组件 -->
    <AddDailyReportDialog
      :visible="store.dialogVisible"
      :editing-data="store.editingData"
      @close="store.hideDialog"
      @submit="handleReportSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddDailyReportDialog from './AddDailyReportDialog.vue' // 导入添加日报弹窗组件
import { useReportStore } from '../stores/reportStore' // 导入报告Store

// 获取报告Store
const store = useReportStore()

// 表格引用
const tableRef = ref(null)

// 分页事件处理
function handleSizeChange(newSize) {
  store.setPageSize(newSize)
}

function handleCurrentChange(newPage) {
  store.setCurrentPage(newPage)
}

function handleAddReport(row = null) {
  store.showDialog(row)
}

// 处理表单提交
function handleReportSubmit(reportData) {
  if (store.editingData) {
    // 编辑操作
    store.updateReport(store.editingData.id, reportData)
  } else {
    store.createReport(reportData) // 添加操作
  }
  // 触发添加日报事件
  emit('add-report', reportData)
  // 隐藏弹窗
  store.hideDialog()
}

// 暴露添加日报函数给父组件
const emit = defineEmits(['add-report'])
// 静态展示下不需要暴露额外函数
defineExpose({
  handleAddReport
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pagination-container {
    justify-content: flex-start;
  }
}

.mistake-photos {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.photo-item {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}

.mistake-photo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.no-photos {
  color: #999;
  font-style: italic;
}

/* TODOs样式 */
.todo-list {
  padding: 5px;
}

.todo-item {
  margin-bottom: 3px;
  font-size: 14px;
  line-height: 1.4;
}

.no-todos {
  color: #999;
  font-style: italic;
}
</style>
