<template>
  <div>
    <!-- Todo 浮层切换按钮 -->
    <div class="todo-toggle-btn" :class="{ active: isOpen }" @click="toggle">📋</div>

    <!-- Todo 浮层面板 -->
    <div class="todo-float-panel" :class="{ active: isOpen }">
      <div class="todo-header" @click="toggle">
        <h3>快速待办 (Todo)</h3>
        <span style="font-size: 1.5rem; cursor: pointer">&times;</span>
      </div>
      <div class="todo-list-container">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <input type="checkbox" :checked="todo.completed" @change="store.toggleTodo(todo.id)" />
          <span class="todo-item-text">{{ todo.text }}</span>
          <span style="cursor: pointer; color: #999" @click="store.removeTodo(todo.id)">×</span>
        </div>
      </div>
      <div class="todo-input-area">
        <input
          v-model="newTodo"
          type="text"
          class="todo-input"
          placeholder="添加新的待办事项..."
          @keyup.enter="add"
        />
        <button
          class="btn btn-primary"
          style="padding: 8px 12px; width: auto; margin-top: 0"
          @click="add"
        >
          添加
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const store = useTaskStore()
const todos = computed(() => store.simpleTodos)
const isOpen = ref(false)
const newTodo = ref('')

function toggle() {
  isOpen.value = !isOpen.value
}

function add() {
  if (newTodo.value.trim()) {
    store.addTodo(newTodo.value)
    newTodo.value = ''
  }
}
</script>
