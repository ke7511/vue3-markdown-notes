<script setup lang="ts">
import { ref } from 'vue'

// 笔记列表宽度
const sidebarSize = ref(180)
// 关闭笔记列表前的宽度，使笔记列表在打开时保持上次关闭时的宽度
let lastSidebarSize = 25

// 点击关闭笔记列表
const closeSidebar = () => {
  lastSidebarSize = sidebarSize.value
  sidebarSize.value = 0
}

// 点击开启笔记列表
const openSidebar = () => {
  sidebarSize.value = lastSidebarSize
}
</script>

<template>
  <div class="app-container">
    <el-splitter>
      <el-splitter-panel
        v-if="sidebarSize > 0"
        v-model:size="sidebarSize"
        min="8%"
        max="20%"
      >
        <div class="panel-list">
          <!-- NoteList -->
          <NoteList @close-sidebar="closeSidebar"></NoteList>
        </div>
      </el-splitter-panel>
      <router-view
        :sidebar-size="sidebarSize"
        @open-sidebar="openSidebar"
      ></router-view>
    </el-splitter>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
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
