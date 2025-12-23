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
    <Sidebar></Sidebar>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}
</style>
