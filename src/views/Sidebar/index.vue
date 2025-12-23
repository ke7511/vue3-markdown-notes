<script setup lang="ts">
import { useNoteStore } from '@/stores/note'
import SidebarHeader from './modules/SidebarHeader.vue'
import NoteItem from './modules/SidebarNoteItem.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const noteStore = useNoteStore()
const route = useRoute()
const router = useRouter()

const { sidebarSize } = storeToRefs(useSidebarStore())
const { width } = useWindowSize()
const isSidebarVisible = computed(
  () => sidebarSize.value > 0 && width.value > 850
)

// 新建笔记
const handleCreateNote = async () => {
  const newNoteId = await noteStore.createNote()
  router.push(`/${newNoteId}`)
}

// 编辑标题
const handleEdit = (id: string, title: string) => {
  noteStore.updateNoteTitle(id, title)
}

// 删除笔记
const handleDelete = (id: string) => {
  ElMessageBox.confirm('您确定要删除这篇笔记吗？此操作不可撤销。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await noteStore.deleteNote(id)
    if (route.params.noteId === id) {
      if (noteStore.noteList.length > 0) {
        router.push(`/${noteStore.noteList[0].id}`)
      } else {
        router.push('/')
      }
    }
    ElMessage.success('删除成功')
  })
}

// 路由跳转
const handleNavigate = (id: string) => {
  router.push(`/${id}`)
}
</script>
<template>
  <el-splitter-panel
    v-if="isSidebarVisible"
    v-model:size="sidebarSize"
    min="8%"
    max="25%"
  >
    <div class="panel-list">
      <!-- NoteList -->
      <SidebarHeader @create-note="handleCreateNote" />
      <div class="note-content">
        <NoteItem
          v-for="note in noteStore.noteList"
          :key="note.id"
          :note="note"
          :active="note.id === $route.params.noteId"
          @edit="handleEdit"
          @delete="handleDelete"
          @navigate="handleNavigate"
        />
      </div>
    </div>
  </el-splitter-panel>
</template>

<style lang="scss" scoped>
:deep(.el-splitter-panel) {
  position: relative;
  box-sizing: border-box;
}
.panel-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7f6;

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
