import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 定义 Note 接口，明确一篇笔记包含哪些数据
export interface NoteType {
  id: string
  title: string
  content: string
  createdTime: number
}

export const useNoteStore = defineStore('note', () => {
  const noteList = ref<NoteType[]>([
    {
      id: 'welcome-note',
      title: '欢迎使用 InkFlow!',
      content:
        '# 你好，世界！\n\n这是你的第一篇笔记。你可以在这里使用 **Markdown** 语法进行创作。',
      createdTime: Date.now()
    },
    {
      id: 'markdown-cheatsheet',
      title: 'Markdown 语法小抄',
      content: '## 标题\n\n- [ ] 任务列表\n- [x] 已完成任务',
      createdTime: Date.now() - 100000
    }
  ])

  // 根据id来获取笔记
  const getNoteById = computed(() => {
    return (noteId: string): NoteType | undefined => {
      return noteList.value.find((note) => note.id === noteId)
    }
  })

  // 删除笔记
  const deleteNote = (id: string) => {
    noteList.value = noteList.value.filter((note) => note.id !== id)
  }

  /**
   * 更新指定 ID 笔记的标题
   * @param id 要更新的笔记 ID
   * @param newTitle 新的标题
   */
  const updateNote = (id: string, newTitle: string) => {
    const note = noteList.value.find((note) => note.id === id)
    if (note) {
      note.title = newTitle
    }
  }

  // 新增笔记
  const createNote = (): string => {
    const newNote: NoteType = {
      id: `note-${Date.now()}`,
      title: '未命名笔记',
      content: '# 在这里开始书写...',
      createdTime: Date.now()
    }
    noteList.value.unshift(newNote)
    return newNote.id
  }

  return {
    noteList,
    getNoteById,
    updateNote,
    deleteNote,
    createNote
  }
})
