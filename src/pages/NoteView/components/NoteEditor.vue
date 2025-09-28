<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { NoteType } from '@/stores/note'
import { useNoteStore } from '@/stores/note'

// Props
const props = defineProps<{
  currentNote: NoteType | null
}>()
const emit = defineEmits(['update:noteContent'])

const noteStore = useNoteStore()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

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

// 创建一个方法，用于聚焦 textarea
const focusTextarea = async () => {
  await nextTick() // 确保 DOM 更新完毕
  if (textareaRef.value && noteContent.value === '') {
    textareaRef.value.focus()
  }
}

// 使用 defineExpose 将方法暴露给父组件
defineExpose({
  focusTextarea
})
</script>

<template>
  <div v-if="currentNote" class="editor-pane">
    <textarea
      ref="textareaRef"
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
    padding: 10px 20px 15px;
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
