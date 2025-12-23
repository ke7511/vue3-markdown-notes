<script setup lang="ts">
import Sidebar from '@/views/Sidebar/index.vue'
import { ref } from 'vue'

// 记录编辑区宽度
const editorSize = ref(550)
const handleResizeEnd = () => {
  localStorage.setItem('editor-size', editorSize.value + '')
}
</script>

<template>
  <div class="app-container">
    <el-splitter @resize-end="handleResizeEnd">
      <Sidebar ref="childNoteList"></Sidebar>
      <router-view
        @editor-size="(val: number) => (editorSize = val)"
      ></router-view>
    </el-splitter>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  --el-border-color-light: #f5f7f6;
  height: 100vh;
  width: 100vw;
}
</style>
