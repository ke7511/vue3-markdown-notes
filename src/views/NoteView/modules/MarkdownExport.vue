<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import type { NoteType } from '@/stores/note'

const props = defineProps<{
  noteContent: string
  currentNote: NoteType | null
}>()
const markdownExport = () => {
  if (!props.currentNote) {
    ElMessage.warning('没有可导出的笔记')
    return
  }
  const blob = new Blob([props.noteContent], { type: 'text/markdown' })
  saveAs(blob, `${props.currentNote.title}.md`)
  ElMessage.success('导出成功')
}
</script>

<template>
  <button
    type="button"
    class="md-export-btn"
    title="导出为markdown"
    @click="markdownExport"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 208 128"
      aria-hidden="true"
    >
      <rect
        width="198"
        height="118"
        x="5"
        y="5"
        ry="10"
        stroke="currentColor"
        stroke-width="10"
        fill="none"
      />
      <path
        fill="currentColor"
        d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"
      />
    </svg>
  </button>
</template>

<style scoped lang="scss">
.md-export-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-color);
  transition: transform 0.3s ease;

  svg {
    height: 20px;
    width: auto;
  }

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
