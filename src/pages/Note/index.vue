<script setup lang="ts">
import { useNoteStore, type NoteType } from '@/stores/note'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const noteStore = useNoteStore()
const currentNote = ref<NoteType | null>()

// 接收路由传来的noteId
// watch会在 noteId 变化时自动重新运行
const route = useRoute()
watch(
  () => route.params.noteId,
  (newId) => {
    const id = Array.isArray(newId) ? newId[0] : newId
    const note = noteStore.getNoteById(id)
    if (note) {
      currentNote.value = note
    } else {
      ElMessage.error('找不到您的笔记')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="currentNote" class="note-content">
    <h1>{{ currentNote.title }}</h1>
    <div class="markdown-body">
      {{ currentNote.content }}
    </div>
  </div>
  <div v-else>
    <p>笔记不存在，或正在加载中...</p>
  </div>
</template>

<style scoped>
.note-content {
  height: 100%;
}
</style>
