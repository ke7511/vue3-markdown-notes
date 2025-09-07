import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@/utils/db'
import { getUniqueTitle } from '@/utils/uniqueTitle'

// 定义 Note 接口，明确一篇笔记包含哪些数据
export interface NoteType {
  id: string
  title: string
  content: string
  createdTime: number
}

export const useNoteStore = defineStore('note', () => {
  const noteList = ref<NoteType[]>([])

  // 4. 新增一个 action，用于从数据库加载所有笔记
  const loadFromDB = async () => {
    // toArray() 是 Dexie 的方法，用于获取表中的所有记录
    const notesFromDB = await db.notes.toArray()
    // 按创建时间降序排序，最新的在最前面
    noteList.value = notesFromDB.sort((a, b) => b.createdTime - a.createdTime)
  }

  // 根据id来获取笔记
  const getNoteById = computed(() => {
    return (noteId: string): NoteType | undefined => {
      return noteList.value.find((note) => note.id === noteId)
    }
  })

  // 删除笔记
  const deleteNote = async (id: string) => {
    await db.notes.delete(id)
    noteList.value = noteList.value.filter((note) => note.id !== id)
  }

  /**
   * 更新指定 ID 笔记的标题
   * @param id 要更新的笔记 ID
   * @param newTitle 新的标题
   */
  const updateNoteTitle = async (id: string, newTitle: string) => {
    await db.notes.update(id, { title: newTitle })
    const note = noteList.value.find((note) => note.id === id)
    if (note) {
      note.title = getUniqueTitle(newTitle, noteList.value, id)
    }
  }

  // 新增笔记
  const createNote = async (): Promise<string> => {
    const newNote: NoteType = {
      id: `note-${Date.now()}`,
      title: getUniqueTitle('未命名笔记', noteList.value),
      content: '',
      createdTime: Date.now()
    }
    await db.notes.add(newNote)
    noteList.value.unshift(newNote)
    return newNote.id
  }

  // 更新笔记内容
  const updateNoteContent = async (noteId: string, newContent: string) => {
    await db.notes.update(noteId, { content: newContent })
    const note = noteList.value.find((note) => note.id === noteId)
    if (note) {
      note.content = newContent
    }
  }
  return {
    noteList,
    getNoteById,
    updateNoteTitle,
    deleteNote,
    createNote,
    updateNoteContent,
    loadFromDB
  }
})
