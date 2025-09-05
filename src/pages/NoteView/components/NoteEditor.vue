<script setup lang="ts">
import { watch, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { NoteType } from '@/stores/note'
import { useNoteStore } from '@/stores/note'

// Props
const props = defineProps<{
  currentNote: NoteType | null
}>()
const emit = defineEmits(['update:noteContent'])

const noteStore = useNoteStore()

// 监听 noteContent 的变化，并更新笔记内容
const noteContent = defineModel<string>({ required: true })
const saveNoteContent = useDebounceFn((newContent: string) => {
  if (props.currentNote) {
    noteStore.updateNoteContent(props.currentNote.id, newContent)
  }
}, 500)

watch(noteContent, (newContent) => {
  saveNoteContent(newContent)
})
</script>

<template>
  <div v-if="currentNote" class="editor-pane">
    <textarea
      v-model="noteContent"
      class="editor-textarea"
      placeholder="请输入内容..."
    />
  </div>
  <div v-else class="placeholder">
    <div>请在左侧选择一篇笔记，或新建一篇笔记。</div>
  </div>
</template>

<style scoped lang="scss">
.editor-pane {
  flex: 1;
  box-sizing: border-box;

  .editor-textarea {
    display: block;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #a8a8a8 #fff;
    width: 100%;
    height: 100%;
    padding: 10px 20px 0;
    border: none;
    outline: none;
    resize: none;
    white-space: pre-wrap;
    word-break: break-word;
    font: 16px/1.5 'inherit';
  }
}
.placeholder {
  padding: 20px;
  color: #909399;
}
</style>
