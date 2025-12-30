<script setup lang="ts">
import { useNoteStore } from '@/stores/note'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'
import { Close, Plus, Fold, Expand } from '@element-plus/icons-vue'

const sidebarStore = useSidebarStore()
const { isMobile, isCollapsed } = storeToRefs(sidebarStore)
const { toggleSidebar, closeSidebar } = sidebarStore
const { createNote } = useNoteStore()
</script>

<template>
  <!-- 侧边栏头部 -->
  <div
    class="sidebar-header"
    :class="{ 'mini-mode': !isMobile && isCollapsed }"
  >
    <div class="note-create">
      <!-- 标题（迷你模式时隐藏） -->
      <h3 v-show="isMobile || !isCollapsed">笔记列表</h3>
      <!-- 新建按钮 -->
      <el-button
        :icon="Plus"
        text
        circle
        title="新建笔记"
        @click="createNote"
      />
    </div>

    <!-- 移动端：关闭按钮 -->
    <el-button
      v-if="isMobile"
      :icon="Close"
      text
      circle
      title="关闭"
      @click="closeSidebar"
    />

    <!-- 桌面端：展开/收起切换按钮 -->
    <el-button
      v-else
      :icon="isCollapsed ? Expand : Fold"
      text
      circle
      :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
      @click="toggleSidebar"
    />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-header {
  height: 32px;
  padding: 10px 10px;
  background-color: var(--bg-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  transition: padding 0.3s ease;

  :deep(.el-button):hover {
    background-color: var(--title-color-bg);
  }

  .note-create {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;

    h3 {
      margin: 0;
      flex-shrink: 0;
      white-space: nowrap;
    }
  }

  // 迷你模式样式
  &.mini-mode {
    flex-direction: column;
    padding: 10px 5px;
    height: auto;
    gap: 8px;

    // 展开按钮在上
    > .el-button {
      order: 1;
    }

    // 新建笔记按钮在下
    .note-create {
      order: 2;
      flex-direction: column;
    }
  }
}
</style>
