// db.ts
import Dexie, { type EntityTable } from 'dexie'
import type { NoteType } from '@/stores/note'

// 定义数据库实例，并通过交叉类型声明表结构
const db = new Dexie('InkFlowDB') as Dexie & {
  notes: EntityTable<
    NoteType,
    'id' // 主键字段，用于类型提示
  >
}

// 定义数据库版本和 stores
db.version(1).stores({
  notes: 'id' // 主键 id
})

// populate：数据库第一次创建时自动填充数据
db.on('populate', async () => {
  await db.notes.add({
    id: 'note-welcome',
    title: '默认笔记',
    content:
      '# 欢迎使用 Markdown 编辑器 👋\n\n' +
      '这是一篇为您准备的默认笔记，用于帮助您快速熟悉功能：\n\n' +
      '---\n\n' +
      '### 创建新笔记\n' +
      '点击「笔记列表」右侧的加号按钮，即可新建一篇笔记，记录您的想法、待办事项或学习内容。\n\n' +
      '### 修改笔记标题\n' +
      '在笔记列表中，将鼠标移动到某个笔记标题区域，可以点击右侧的编辑按钮，或直接双击标题进行修改。\n\n' +
      '### 删除笔记\n' +
      '如果某篇笔记已不再需要，可以将鼠标移动到对应标题区域，并点击右侧的删除按钮即可移除。\n\n' +
      '### 切换笔记\n' +
      '在左侧的笔记列表中，可以方便地切换至不同的笔记进行查看或编辑。\n\n' +
      '### 自动保存\n' +
      '系统会在您输入时自动保存笔记内容至浏览器本地，无需担心数据丢失。\n\n' +
      '### 折叠笔记列表\n' +
      '若不需要时，可以点击「笔记列表」右上角的关闭按钮，将其折叠以获得更大编辑空间。\n\n' +
      '---\n\n' +
      '小提示：本篇欢迎笔记可以随时修改或删除，完全由您掌控。\n\n' +
      '祝您使用愉快！',

    createdTime: Date.now()
  })
})

export { db }
