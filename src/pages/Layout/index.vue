<script setup lang="ts">
import { ref } from 'vue'
import { Close, Expand } from '@element-plus/icons-vue'

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
        <div class="panel-content">
          <!-- NoteList -->
          <NoteList @close-sidebar="closeSidebar"></NoteList>
        </div>
      </el-splitter-panel>
      <el-splitter-panel min="30%">
        <div v-if="sidebarSize < 1" class="toggle-button-wrapper">
          <el-icon style="cursor: pointer" @click="openSidebar">
            <Expand />
          </el-icon>
        </div>
        <div class="panel-content">
          <div :class="{ iconShow: sidebarSize < 1 }">
            <h3>编辑器</h3>
          </div>
          <RouterView />
        </div>
      </el-splitter-panel>
      <el-splitter-panel size="40%" min="30%">
        <div class="panel-content">
          <h3>预览区</h3>
        </div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  width: 100vw;

  :deep(.el-splitter-panel) {
    padding: 10px 10px;
    position: relative;

    .panel-content h3 {
      margin: 0px;
    }

    .toggle-button-wrapper {
      position: absolute;
      left: 0;
      top: 13px;
    }

    .iconShow {
      margin-left: 8px;
      transition: all 0.7s;
    }
  }
}
</style>
