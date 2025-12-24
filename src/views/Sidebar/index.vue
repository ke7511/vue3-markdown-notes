<script setup lang="ts">
import { useNoteStore } from '@/stores/note'
import SidebarHeader from './modules/SidebarHeader.vue'
import NoteItem from './modules/SidebarNoteItem.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'

const noteStore = useNoteStore()
const { isSidebarVisible } = storeToRefs(useSidebarStore())
</script>

<template>
  <aside class="panel-list" :class="{ collapsed: !isSidebarVisible }">
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
.panel-list {
  width: 240px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f7f6;
  overflow: hidden;
  transition: width 0.3s ease;

  // 收起状态
  &.collapsed {
    width: 0;
  }

  .note-content {
    scrollbar-width: thin;
    scrollbar-color: #a8a8a8 #f5f7f6;
    flex: 1;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 10px 10px 0;
  }
}
</style>
