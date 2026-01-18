<template>
  <div
    class="task-card"
    :class="{ dragging: isDragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="task-subject" :class="`subject-${task.subject}`">{{ subjectName }}</div>
    <div class="task-title">{{ task.title }}</div>
    <div class="task-meta">
      <div v-if="task.description">{{ task.description }}</div>
      <div>时长：{{ task.duration }}小时</div>
      <div>
        优先级：<span :style="{ color: priorityColor }">{{ priorityLabel }}</span>
      </div>
      <div v-if="task.reference">参考：{{ task.reference }}</div>
    </div>
    <div class="task-actions">
      <button class="action-btn edit" @click.stop="$emit('edit', task)">✏️</button>
      <button class="action-btn delete" @click.stop="deleteTask">🗑️</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['delete', 'edit'])

const isDragging = ref(false)

const subjectNames = {
  chinese: '语文',
  english: '英语',
  math: '数学',
  physics: '物理',
  chemistry: '化学',
  biology: '生物'
}

const subjectName = computed(() => subjectNames[props.task.subject] || props.task.subject)

const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444'
}

const priorityColor = computed(() => priorityColors[props.task.priority] || '#000')

const priorityLabel = computed(() => {
  const map = { low: '低', medium: '中', high: '高' }
  return map[props.task.priority] || props.task.priority
})



function deleteTask() {
  if (confirm('确定要删除这个任务吗？')) {
    emit('delete', props.task.id)
  }
}

function onDragStart(e) {
  isDragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('taskId', props.task.id)
  e.dataTransfer.setData('sourceDay', props.date)
}

function onDragEnd() {
  isDragging.value = false
}
</script>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .task-card {
    padding: 12px 16px;
  }

  .task-title {
    font-size: 0.9rem;
  }

  .task-meta {
    font-size: 0.8rem;
  }

  .task-actions {
    opacity: 1;
    top: 8px;
    right: 8px;
  }

  .action-btn {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .task-card {
    padding: 10px 12px;
    margin-bottom: 8px;
  }

  .task-checkbox {
    width: 16px;
    height: 16px;
  }

  .task-subject {
    font-size: 0.7rem;
    padding: 2px 6px;
  }

  .task-title {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .task-meta > div {
    margin-bottom: 3px;
  }
}
</style>
