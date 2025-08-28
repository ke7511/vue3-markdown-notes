import Dexie, { type Table } from 'dexie'
import type { NoteType } from '@/stores/note' // 1. 复用我们在 Pinia store 中定义的 Note 接口

// 2. 创建一个类来继承 Dexie，这是 Dexie 的标准实践，能提供完整的 TypeScript 支持
export class MySubClassedDexie extends Dexie {
  // 3. 'notes' 是我们数据库中“表”的名字。
  //    Table<Note, string> 定义了这张表的结构：
  //    - 存储的对象类型是 Note
  //    - 主键（Primary Key）的类型是 string (也就是 note.id)
  notes!: Table<NoteType, string>

  constructor() {
    // 4. 'InkFlowDB' 是数据库的名字，它会显示在浏览器的开发者工具里
    super('InkFlowDB')
    this.version(1).stores({
      // 5. 定义数据库的“模式”（Schema）
      //    'id' 是主键。我们不需要像 SQL 那样列出所有字段，
      //    只需要定义主键和需要被索引（用于快速查询）的字段。
      notes: 'id'
    })
    this.on('populate', () => {
      // 数据库第一次创建时，自动写入一篇笔记
      this.notes.add({
        id: `note-welcome`,
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
  }
}

// 6. 创建并导出一个单例（Singleton）数据库实例，供整个应用使用
export const db = new MySubClassedDexie()
