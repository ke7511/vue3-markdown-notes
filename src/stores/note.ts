import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { db } from '@/utils/db'
import { getUniqueTitle } from '@/utils/uniqueTitle'
import { useSidebarStore } from './sidebar'

// 定义 Note 接口，明确一篇笔记包含哪些数据
export interface NoteType {
  id: string
  title: string
  content: string
  createdTime: number
}

export const useNoteStore = defineStore('note', () => {
  const noteList = ref<NoteType[]>([])

  // 新增一个 action，用于从数据库加载所有笔记
  async function loadFromDB() {
    // toArray() 是 Dexie 的方法，用于获取表中的所有记录
    const notesFromDB = await db.notes.toArray()
    // 按创建时间降序排序，最新的在最前面
    noteList.value = notesFromDB.sort((a, b) => b.createdTime - a.createdTime)
  }

  // 根据id来获取笔记
  function getNoteById(noteId: string): NoteType | undefined {
    return noteList.value.find((note) => note.id === noteId)
  }

  // 删除笔记
  async function deleteNote(id: string) {
    noteList.value = noteList.value.filter((note) => note.id !== id)
    await db.notes.delete(id)
  }

  /**
   * 更新指定 ID 笔记的标题
   * @param id 要更新的笔记 ID
   * @param newTitle 新的标题
   */
  async function updateNoteTitle(id: string, newTitle: string) {
    const note = noteList.value.find((note) => note.id === id)
    if (note) {
      note.title = getUniqueTitle(newTitle, noteList.value, id)
      if (note.title !== newTitle) {
        await db.notes.update(id, { title: note.title })
      }
    }
  }

  // 新增笔记
  const router = useRouter()
  const sidebarStore = useSidebarStore()
  async function createNote() {
    const newNote: NoteType = {
      id: `note-${Date.now()}`,
      title: getUniqueTitle('未命名笔记', noteList.value),
      content: '',
      createdTime: Date.now()
    }
    noteList.value.unshift(newNote)
    await db.notes.add(newNote)
    router.push(`/${newNote.id}`)
    // 移动模式新建笔记后关闭抽屉
    if (sidebarStore.isMobile) {
      sidebarStore.closeSidebar()
    }
  }

  // 更新笔记内容
  async function updateNoteContent(noteId: string, newContent: string) {
    const note = noteList.value.find((note) => note.id === noteId)
    if (note) {
      note.content = newContent
      await db.notes.update(noteId, { content: newContent })
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
