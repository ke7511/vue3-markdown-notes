// useNoteLoader.ts
import { nextTick, ref } from 'vue'
import type { NoteType } from '@/stores/note'
import type { InputInstance } from 'element-plus'
import { useNoteStore } from '@/stores/note'

export function useNoteLoader() {
  const noteStore = useNoteStore()
  const currentNote = ref<NoteType | null>(null)
  const noteContent = ref('')
  const textareaRef = ref<InputInstance | null>(null)

  // 封装一个可复用的函数来加载笔记和调整高度
  const loadNoteAndResize = async (noteId: string) => {
    const note = noteStore.getNoteById(noteId)
    if (note) {
      currentNote.value = note
      noteContent.value = note.content
      await nextTick()
      if (textareaRef.value) {
        textareaRef.value.focus()
        // 【关键】使用 setTimeout 将高度调整推迟到下一个事件循环
        // setTimeout(() => {
        //   textareaRef.value?.resizeTextarea()
        // }, 0)
      }
    } else {
      currentNote.value = null
      noteContent.value = ''
    }
  }

  return { currentNote, noteContent, textareaRef, loadNoteAndResize }
}
