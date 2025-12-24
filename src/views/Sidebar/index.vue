<script setup lang="ts">
import { useNoteStore } from '@/stores/note'
import SidebarHeader from './modules/SidebarHeader.vue'
import NoteItem from './modules/SidebarNoteItem.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'

const noteStore = useNoteStore()
const sidebarStore = useSidebarStore()
const { isMobile, isCollapsed, isMobileOpen } = storeToRefs(sidebarStore)
</script>

<template>
  <aside
    class="panel-list"
    :class="{
      'desktop-expanded': !isMobile && !isCollapsed,
      'desktop-collapsed': !isMobile && isCollapsed,
      'mobile-mode': isMobile,
      'mobile-open': isMobile && isMobileOpen
    }"
  >
    <!-- NoteList -->
    <SidebarHeader />
    <div class="note-content">
      <NoteItem
        v-for="note in noteStore.noteList"
        :key="note.id"
        :note="note"
        :active="note.id === $route.params.noteId"
      />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
// 侧边栏宽度变量
$sidebar-width: 240px;
$sidebar-collapsed-width: 60px;

.panel-list {
  width: $sidebar-width;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  overflow: hidden;

  // 桌面端展开状态
  &.desktop-expanded {
    transition: width 0.3s ease;
    width: $sidebar-width;
  }

  // 桌面端收起状态（迷你模式）
  &.desktop-collapsed {
    width: $sidebar-collapsed-width;
    transition: width 0.3s ease;
    .note-content {
      // 收起时隐藏笔记列表内容
      opacity: 0;
      pointer-events: none;
    }
  }

  // 移动端抽屉模式
  &.mobile-mode {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
    box-shadow: none;

    &.mobile-open {
      transform: translateX(0);
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    }
  }

  .note-content {
    scrollbar-width: thin;
    scrollbar-color: #a8a8a8 var(--bg-color);
    flex: 1;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 10px 10px 0;
    transition: opacity 0.2s ease;
  }
}
</style>
