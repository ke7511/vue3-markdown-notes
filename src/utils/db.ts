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
      // 🚀 数据库第一次创建时，自动写入一篇笔记
      this.notes.add({
        id: `note-${Date.now()}`,
        title: '默认笔记',
        content: '这是初始化时自动准备好的笔记',
        createdTime: Date.now()
      })
    })
  }
}

// 6. 创建并导出一个单例（Singleton）数据库实例，供整个应用使用
export const db = new MySubClassedDexie()
