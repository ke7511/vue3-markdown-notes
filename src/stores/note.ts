import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { db } from '@/utils/db'
import { getUniqueTitle } from '@/utils/uniqueTitle'
import { useSidebarStore } from './sidebar'
import { ElMessageBox } from 'element-plus'

// 定义 Note 接口，明确一篇笔记包含哪些数据
export interface NoteType {
  id: string
  title: string
  content: string
  createdTime: number
}

export const useNoteStore = defineStore('note', () => {
  const noteList = ref<NoteType[]>([])
  const isUnsaved = ref(false)

  // 通用数据库读写与错误处理封装
  async function withDBErrorHandler<T>(
    operation: () => Promise<T>,
    actionName: string
  ): Promise<T | void> {
    try {
      const result = await operation()
      isUnsaved.value = false
      return result
    } catch (e: unknown) {
      console.error(`Failed to ${actionName}:`, e)
      isUnsaved.value = true
      return new Promise<T | void>((resolve) => {
        ElMessageBox.confirm(
          `本地存储空间不足或出现异常，${actionName}操作失败，是否重试？`,
          '提示',
          {
            confirmButtonText: '重试',
            cancelButtonText: '取消',
            type: 'error'
          }
        )
          .then(async () => {
            const retryResult = await withDBErrorHandler(operation, actionName)
            resolve(retryResult)
          })
          .catch(() => {
            resolve()
          })
      })
    }
  }

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
    await withDBErrorHandler(() => db.notes.delete(id), '删除笔记')
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
        await withDBErrorHandler(
          () => db.notes.update(id, { title: note.title }),
          '修改标题'
        )
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
    await withDBErrorHandler(() => db.notes.add(newNote), '创建笔记')
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
      await withDBErrorHandler(
        () => db.notes.update(noteId, { content: newContent }),
        '保存内容'
      )
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
