<script setup lang="ts">
import { watch, ref, nextTick, onUnmounted } from 'vue'
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
}, 800)

watch(noteContent, (newContent) => {
  saveNoteContent(newContent)
})

// 组件卸载时保存内容
onUnmounted(() => {
  if (props.currentNote) {
    noteStore.updateNoteContent(props.currentNote.id, noteContent.value)
  }
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

// 处理Tab缩进
const indentation = '  '
const handleTab = (e: KeyboardEvent) => {
  // 1. 阻止默认的 Tab 行为 (切换焦点)
  e.preventDefault()

  const textarea = e.target as HTMLTextAreaElement
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // 2. 判断是缩进还是取消缩进
  if (e.shiftKey) {
    // Shift + Tab: 取消缩进
    // 找到选区所在行的起始位置
    let lineStart = start
    while (lineStart > 0 && textarea.value[lineStart - 1] !== '\n') {
      lineStart--
    }

    // 如果行的开头是缩进，则移除它
    if (
      textarea.value.substring(lineStart, lineStart + indentation.length) ===
      indentation
    ) {
      const newText =
        textarea.value.substring(0, lineStart) +
        textarea.value.substring(lineStart + indentation.length)

      noteContent.value = newText

      // 更新光标位置
      // nextTick 确保在 DOM 更新后再设置光标
      nextTick(() => {
        textarea.selectionStart = start - indentation.length
        textarea.selectionEnd = end - indentation.length
      })
    }
  } else {
    // Tab: 增加缩进
    const selectedText = textarea.value.substring(start, end)

    // 如果有选中文本 (多行处理)
    if (selectedText.includes('\n')) {
      // 找到选区开始行的行首
      let lineStart = start
      while (lineStart > 0 && textarea.value[lineStart - 1] !== '\n') {
        lineStart--
      }

      const beforeSelection = textarea.value.substring(0, lineStart)
      let selectedLines = textarea.value.substring(lineStart, end)
      const afterSelection = textarea.value.substring(end)

      let linesChanged = 0
      selectedLines = selectedLines
        .split('\n')
        .map((line) => {
          // 只为非空行添加缩进
          if (line.length > 0) {
            linesChanged++
            return indentation + line
          }
          return line
        })
        .join('\n')

      noteContent.value = beforeSelection + selectedLines + afterSelection

      // 恢复选区
      nextTick(() => {
        textarea.selectionStart = start + indentation.length
        textarea.selectionEnd = end + linesChanged * indentation.length
      })
    } else {
      // 单行或无选中文本，直接插入缩进
      const newText =
        textarea.value.substring(0, start) +
        indentation +
        textarea.value.substring(end)

      noteContent.value = newText

      // 更新光标位置
      nextTick(() => {
        const newCursorPos = start + indentation.length
        textarea.selectionStart = newCursorPos
        textarea.selectionEnd = newCursorPos
      })
    }
  }
}
</script>

<template>
  <div v-if="currentNote" class="editor-pane">
    <textarea
      ref="textareaRef"
      v-model="noteContent"
      class="editor-textarea"
      placeholder="请输入内容..."
      @keydown.tab="handleTab"
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
    font-size: 16px;
    line-height: 1.5;
  }
}
.placeholder {
  padding: 20px;
  color: #909399;
}
</style>
