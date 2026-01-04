import { ref } from 'vue'
import type { NoteType } from '@/stores/note'
import { useNoteStore } from '@/stores/note'

export const useNoteLoader = () => {
  const noteStore = useNoteStore()
  const currentNote = ref<NoteType | null>(null)
  const noteContent = ref('')

  // 封装一个可复用的函数来加载笔记
  const loadNote = (noteId: string) => {
    const note = noteStore.getNoteById(noteId)
    if (note) {
      currentNote.value = note
      noteContent.value = note.content
    } else {
      currentNote.value = null
      noteContent.value = ''
    }
  }

  return { currentNote, noteContent, loadNote }
}
