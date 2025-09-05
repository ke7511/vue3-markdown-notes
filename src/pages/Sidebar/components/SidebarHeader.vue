<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { Close, Plus } from '@element-plus/icons-vue'
import { defineEmits } from 'vue'

const useSidebar = useSidebarStore()
// Emits
const emit = defineEmits(['close-sidebar', 'create-note'])

// 关闭侧边栏
const closeSidebar = () => emit('close-sidebar')

// 新建笔记
const handleCreateNote = () => emit('create-note')
</script>

<template>
  <!-- 侧边栏头部 -->
  <div class="sidebar-header">
    <div class="note-create">
      <h3>笔记列表</h3>
      <!-- 新建按钮 -->
      <el-button
        v-if="useSidebar.sidebarSize > 153"
        :icon="Plus"
        text
        circle
        title="新建笔记"
        @click="handleCreateNote"
      />
    </div>
    <!-- 关闭按钮 -->
    <el-button
      v-if="useSidebar.sidebarSize > 129"
      :icon="Close"
      text
      circle
      title="关闭笔迹列表"
      @click="closeSidebar"
    />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-header {
  height: 32px;
  padding: 10px 10px;
  background-color: #f5f7f6;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .note-create {
    display: flex;
    align-items: center;
    h3 {
      margin: 0;
      flex-shrink: 0;
    }
  }
}
</style>
