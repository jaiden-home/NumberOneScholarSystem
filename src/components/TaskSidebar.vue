<template>
  <div class="sidebar" :class="{ active: isOpen }">
    <div class="sidebar-header">
      <h2>{{ isEdit ? '编辑任务' : '添加新任务' }}</h2>
      <button class="close-sidebar" @click="close">×</button>
    </div>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label class="form-label"><span class="required"> * </span>任务名称</label>
        <input
          v-model="form.title"
          type="text"
          class="form-control"
          placeholder="例如：完成数学真题卷"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label"><span class="required"> * </span>科目</label>
        <select v-model="form.subject" class="form-control" required>
          <option value="">选择科目</option>
          <option value="chinese">语文</option>
          <option value="english">英语</option>
          <option value="math">数学</option>
          <option value="physics">物理</option>
          <option value="chemistry">化学</option>
          <option value="biology">生物</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label"><span class="required"> * </span>分配到星期 </label>
        <select v-model="form.week" class="form-control" required>
          <option value="">选择星期</option>
          <option :value="0">周一</option>
          <option :value="1">周二</option>
          <option :value="2">周三</option>
          <option :value="3">周四</option>
          <option :value="4">周五</option>
          <option :value="5">周六</option>
          <option :value="6">周日</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">任务描述</label>
        <textarea
          v-model="form.description"
          class="form-control"
          rows="3"
          placeholder="详细描述任务内容..."
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">预估时长</label>
          <select v-model="form.duration" class="form-control">
            <option value="0.5">30分钟</option>
            <option value="1">1小时</option>
            <option value="1.5">1.5小时</option>
            <option value="2">2小时</option>
            <option value="2.5">2.5小时</option>
            <option value="3">3小时</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">优先级</label>
          <select v-model="form.priority" class="form-control">
            <option value="low">低优先级</option>
            <option value="medium">中优先级</option>
            <option value="high">高优先级</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">参考资料</label>
        <input
          v-model="form.reference"
          type="text"
          class="form-control"
          placeholder="例如：课本P45-52, 真题2018-2022"
        />
      </div>

      <button type="submit" class="btn btn-primary">保存任务</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useScheduleStore } from '../stores/scheduleStore'

const props = defineProps({
  isOpen: Boolean,
  initialData: Object
})

const emit = defineEmits(['close'])
const store = useScheduleStore()

const isEdit = ref(false)
const form = ref({
  title: '',
  subject: '',
  week: '',
  description: '',
  duration: '1',
  priority: 'medium',
  reference: ''
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      isEdit.value = true
      form.value = { ...newVal }
    } else {
      isEdit.value = false
      resetForm()
    }
  },
  { immediate: true }
)

// 同时监听isOpen，如果是新打开的则重置表单（通常由父组件传递null initialData处理，但显式重置更安全）
watch(
  () => props.isOpen,
  (val) => {
    if (val && !props.initialData) {
      // 如果打开时没有数据，可能需要预设日期（如果可用）
      // 目前只需确保在非编辑模式下重置
      if (!isEdit.value) resetForm()
    }
  }
)

function resetForm() {
  form.value = {
    title: '',
    subject: '',
    week: props.initialData?.week || '', // 如果部分传递则保留日期
    date: props.initialData?.date || '', // 如果部分传递则保留日期
    description: '',
    duration: '1',
    priority: 'medium',
    reference: ''
  }
}

function close() {
  emit('close')
}

function submitForm() {
  // 更新新的日期
  form.value.date = store.getDateByWeekday(form.value.week)
  // 是否是编辑
  if (isEdit.value) {
    // 为了简单起见，我们先删除旧任务再添加新任务，或在store中实现updateTask
    store.removeTask(form.value.id)
    store.addTask(form.value)
  } else {
    store.addTask(form.value)
  }
  close()
  alert('任务已保存！')
}
</script>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 100% !important;
    max-width: 100% !important;
  }

  .sidebar-header {
    padding: 16px 20px;
  }

  form {
    padding: 0 20px 20px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-control {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .sidebar-header h2 {
    font-size: 1.2rem;
  }

  .close-sidebar {
    font-size: 1.5rem;
    padding: 0;
  }

  .btn-primary {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>
