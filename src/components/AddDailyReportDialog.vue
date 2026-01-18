<template>
  <!-- 添加日报弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    center
    class="add-daily-report-dialog"
  >
    <!-- 日报表单 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="150px"
      style="max-height: 500px; overflow-y: auto"
    >
      <el-form-item label="日期" required>
        <el-date-picker
          v-model="formData.date"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          disabled
        />
      </el-form-item>

      <el-form-item label="学科" required>
        <el-select v-model="formData.discipline" placeholder="选择学科" style="width: 100%">
          <el-option label="数学" value="数学" />
          <el-option label="英语" value="英语" />
          <el-option label="物理" value="物理" />
          <el-option label="化学" value="化学" />
          <el-option label="生物" value="生物" />
          <el-option label="历史" value="历史" />
          <el-option label="地理" value="地理" />
        </el-select>
      </el-form-item>

      <el-form-item label="考试做完一半时间" required>
        <el-time-picker
          v-model="formData.examHalfTime"
          placeholder="选择时间"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="考试做完时间" required>
        <el-time-picker
          v-model="formData.examFinishTime"
          placeholder="选择时间"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="考试一半时间完成量" required>
        <el-input v-model="formData.halfTimeCompletion" placeholder="例如：50%" />
      </el-form-item>

      <el-form-item label="错题照片" required>
        <el-upload
          v-model:file-list="uploadFileList"
          :auto-upload="false"
          :multiple="true"
          list-type="picture-card"
          accept="image/*"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="previewVisible" title="预览" width="800px" class="preview-dialog">
          <img w-full :src="previewImage" alt="预览图片" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFormSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editingData: {
    type: Object,
    default: null
  }
})

// 事件
const emit = defineEmits(['close', 'submit'])

// 弹窗可见性，通过计算属性双向绑定
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('close', value)
  }
})

// 是否为编辑模式
const isEditMode = computed(() => {
  return !!props.editingData
})

// 弹窗标题
const dialogTitle = computed(() => {
  return isEditMode.value ? '编辑日报' : '添加日报'
})

// 表单引用
const formRef = ref(null)

// 用于处理复杂字段的临时输入
const uploadFileList = ref([])
const previewVisible = ref(false)
const previewImage = ref('')

// 上传组件处理函数
function handlePictureCardPreview(file) {
  previewImage.value = file.url || file.thumbUrl
  previewVisible.value = true
}

function handleRemove(file, fileList) {
  uploadFileList.value = fileList
}

// 表单数据
const formData = ref({
  date: new Date(), // 设置初始值为当前日期
  discipline: '',
  examHalfTime: null,
  examFinishTime: null,
  halfTimeCompletion: '',
  mistakeList: []
})

// 表单验证规则
const rules = ref({
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  discipline: [{ required: true, message: '请选择学科', trigger: 'change' }],
  examHalfTime: [{ required: true, message: '请选择考试做完一半时间', trigger: 'change' }],
  examFinishTime: [{ required: true, message: '请选择考试做完时间', trigger: 'change' }],
  halfTimeCompletion: [{ required: true, message: '请输入考试一半时间完成量', trigger: 'change' }],
  // 自定义验证错题照片
  mistakeList: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (uploadFileList.value.length === 0) {
          callback(new Error('请上传错题照片'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
})

// 表单提交函数
function handleFormSubmit() {
  // 验证表单
  formRef.value.validate((valid) => {
    if (valid) {
      // 创建一个提交用的数据副本，避免直接修改表单数据
      const submitData = { ...formData.value }

      // 处理表单数据 - 从上传文件列表中提取图片URL
      submitData.mistakeList = uploadFileList.value
        ? uploadFileList.value.map((file) => file.url || file.thumbUrl).filter(Boolean)
        : []

      // 处理时间字段，将Date对象转换为HH:mm格式的字符串，null转换为空字符串
      const formatTime = (time) => {
        if (!time) return ''
        if (time instanceof Date) {
          return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
        }
        return time
      }

      submitData.examHalfTime = formatTime(submitData.examHalfTime)
      submitData.examFinishTime = formatTime(submitData.examFinishTime)

      // 如果日期是Date对象，转换为字符串
      if (submitData.date instanceof Date) {
        submitData.date = submitData.date
          .toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          .replace(/\//g, '-')
      }

      // 打印提交的数据（可以替换为实际的提交逻辑）
      console.log('提交的日报数据:', submitData)

      // 关闭弹窗
      dialogVisible.value = false

      // 触发提交事件
      emit('submit', submitData)

      // 重置表单
      resetForm()
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}

// 重置表单函数
function resetForm() {
  // 重置表单数据
  formData.value = {
    date: new Date(), // 设置默认日期为当前日期
    discipline: '',
    examHalfTime: null,
    examFinishTime: null,
    halfTimeCompletion: '',
    mistakeList: []
  }

  // 重置上传文件列表
  uploadFileList.value = []
  previewVisible.value = false
  previewImage.value = ''
}

// 监听弹窗可见性变化，当弹窗打开时填充编辑数据
watch(dialogVisible, (newValue) => {
  if (newValue) {
    if (isEditMode.value) {
      // 编辑模式，填充数据
      const editingData = props.editingData

      // 填充基本字段
      // 转换中文日期格式为Date对象可解析的格式
      const formatDate = (dateStr) => {
        if (!dateStr) return new Date() // 如果没有日期，使用当前日期
        // 匹配中文日期格式：2025年03月18日
        const match = dateStr.match(/(\d+)年(\d+)月(\d+)日/)
        if (match) {
          return new Date(`${match[1]}-${match[2]}-${match[3]}`)
        }
        return new Date(dateStr)
      }

      // 处理时间字段，将字符串格式的时间转换为Date对象
      const processTimeField = (timeStr) => {
        if (!timeStr) return null
        // 如果时间字段不是字符串格式，直接返回
        if (typeof timeStr !== 'string') return timeStr
        // 将HH:mm格式的字符串转换为Date对象
        const [hours, minutes] = timeStr.split(':')
        if (hours && minutes) {
          const date = new Date()
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          return date
        }
        return timeStr
      }

      formData.value = {
        date: editingData.dateStr ? formatDate(editingData.dateStr) : new Date(),
        discipline: editingData.discipline || '',
        examHalfTime: processTimeField(editingData.examHalfTime),
        examFinishTime: processTimeField(editingData.examFinishTime),
        halfTimeCompletion: editingData.halfTimeCompletion || '',
        mistakeList: []
      }

      // 处理错题照片，将mistakeList转换为uploadFileList格式
      if (editingData.mistakeList && editingData.mistakeList.length > 0) {
        uploadFileList.value = editingData.mistakeList.map((url, index) => ({
          uid: Date.now() + index, // 生成唯一ID
          name: `错题照片${index + 1}`,
          status: 'success',
          url: url
        }))
      } else {
        uploadFileList.value = []
      }
    } else {
      // 添加模式，重置表单
      resetForm()
    }
  }
})

// 暴露方法给父组件
defineExpose({
  resetForm
})
</script>

<style>
/* 全局样式，确保能应用到对话框 */
@media (max-width: 768px) {
  .el-dialog--center.add-daily-report-dialog {
    width: 100%;
    margin: 0;
    height: 100%;
    max-width: 100%;
  }
}
</style>
