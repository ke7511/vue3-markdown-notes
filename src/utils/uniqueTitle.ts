import type { NoteType } from '@/stores/note'

/**
 * 根据现有笔记列表，为一个给定的标题生成一个唯一的版本。
 * @param title 期望的标题
 * @param notes 现有所有笔记的数组
 * @param excludeId (可选) 在检查重名时，需要排除的笔记ID（用于重命名场景）
 * @returns {string} 一个保证唯一的标题
 */
export const getUniqueTitle = (
  title: string,
  noteList: NoteType[],
  excludeId?: string
): string => {
  const otherNoteList = noteList.filter((note) => note.id !== excludeId)
  let isExist = otherNoteList.some((note) => note.title === title)
  if (!isExist) {
    return title
  }
  let i = 2
  let newTitle = title
  while (isExist) {
    newTitle = `${title}（${i}）`
    isExist = otherNoteList.some((note) => note.title === newTitle)
    i++
  }
  return newTitle
}
