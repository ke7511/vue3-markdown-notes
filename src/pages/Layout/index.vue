<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import Sidebar from '@/pages/Sidebar/index.vue'

// 记录编辑区宽度
const editorSize = ref<number>(550)
const handleResizeEnd = () => {
  localStorage.setItem('editor-size', editorSize.value + '')
}

const childNoteList = ref()
provide('open-sidebar', () => {
  if (childNoteList.value) {
    childNoteList.value.openSidebar()
    console.log('open-sidebar 被调用')
  } else {
    console.warn('Sidebar 尚未挂载')
  }
})
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
