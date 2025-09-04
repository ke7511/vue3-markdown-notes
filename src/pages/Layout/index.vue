<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'

// 笔记列表宽度
const sidebarSize = ref(Number(localStorage.getItem('sidebar-size') ?? 180))
// 关闭笔记列表前的宽度，使笔记列表在打开时保持上次关闭时的宽度
let lastSidebarSize = Number(localStorage.getItem('lastSidebar-size')) || 180

// 点击关闭笔记列表
const closeSidebar = () => {
  lastSidebarSize = sidebarSize.value
  sidebarSize.value = 0
}

// 点击开启笔记列表
const openSidebar = () => {
  sidebarSize.value = lastSidebarSize
}
watch(
  sidebarSize,
  useDebounceFn((val) => {
    localStorage.setItem('sidebar-size', val + '')
    if (val > 0) {
      localStorage.setItem('lastSidebar-size', val + '')
    } else {
      localStorage.setItem('sidebar-size', '0')
    }
  }, 500)
)

const editorSize = ref<number>(550)
const handleResizeEnd = () => {
  console.log(editorSize.value + '')
  localStorage.setItem('editor-size', editorSize.value + '')
}
</script>

<template>
  <div class="app-container">
    <el-splitter @resize-end="handleResizeEnd">
      <el-splitter-panel
        v-if="sidebarSize > 0"
        v-model:size="sidebarSize"
        min="8%"
        max="20%"
      >
        <div class="panel-list">
          <!-- NoteList -->
          <NoteList
            :sidebar-size="sidebarSize"
            @close-sidebar="closeSidebar"
          ></NoteList>
        </div>
      </el-splitter-panel>
      <router-view
        :sidebar-size="sidebarSize"
        @open-sidebar="openSidebar"
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

  :deep(.el-splitter-panel) {
    position: relative;
    // padding: 10px 10px;
    box-sizing: border-box;

    .panel-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #f5f7f6;

      h3 {
        margin: 0;
        flex-shrink: 0; /* 防止标题被压缩 */
      }
    }
  }
}
</style>
