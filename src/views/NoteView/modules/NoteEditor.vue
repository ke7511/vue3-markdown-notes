<script setup lang="ts">
import { watch, ref, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { NoteType } from '@/stores/note'
import { useNoteStore } from '@/stores/note'

// Props
const props = defineProps<{
  currentNote: NoteType | null
}>()

const noteStore = useNoteStore()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 监听 noteContent 的变化，并更新笔记内容
const noteContent = defineModel<string>({ required: true })
const saveNoteContent = useDebounceFn((newContent: string) => {
  if (props.currentNote) {
    noteStore.updateNoteContent(props.currentNote.id, newContent)
  }
}, 800)

watch(noteContent, (newContent) => {
  saveNoteContent(newContent)
})

// 创建一个方法，用于聚焦 textarea
const focusTextarea = async () => {
  if (textareaRef.value && noteContent.value === '') {
    textareaRef.value.focus()
  }
}

// 定义 emit 事件
const emit = defineEmits<{
  editorScroll: [ratio: number]
}>()

// 编辑区滚动事件处理：计算滚动比例并通知父组件
const handleScroll = () => {
  const textarea = textareaRef.value
  if (!textarea) return

  const scrollTop = textarea.scrollTop
  const scrollHeight = textarea.scrollHeight - textarea.clientHeight

  // 计算滚动比例
  const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0
  emit('editorScroll', ratio)
}

// 使用 defineExpose 将方法和 ref 暴露给父组件
defineExpose({
  focusTextarea,
  textareaRef
})
</script>

<template>
  <div v-if="currentNote" class="editor-pane">
    <textarea
      ref="textareaRef"
      v-model="noteContent"
      class="editor-textarea"
      placeholder="请输入内容..."
      @scroll="handleScroll"
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
    scrollbar-color: var(--scrollbar-color);
    width: 100%;
    height: 100%;
    padding: 10px 20px 15px;
    border: none;
    outline: none;
    resize: none;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 16px;
    line-height: 1.5;
    background-color: var(--page-bg);
    color: var(--text-color);
  }
}
.placeholder {
  padding: 20px;
  color: #909399;
}
</style>
