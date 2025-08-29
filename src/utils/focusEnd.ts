export const focusEnd = (editorRef: HTMLDivElement) => {
  editorRef.focus()
  const range = document.createRange()
  range.selectNodeContents(editorRef)
  range.collapse(false)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
