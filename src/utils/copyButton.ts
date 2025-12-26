export const addCopyButton = (
  copyIconSVG: string,
  markdownRef: HTMLDivElement | null
) => {
  if (!markdownRef) return
  const codeBlocks = markdownRef.querySelectorAll('pre.hljs')
  codeBlocks.forEach((code) => {
    if (code.querySelector('.copy-button')) {
      return
    }
    // 创建一个包裹元素，用于按钮的相对定位
    const wrapper = document.createElement('div')
    wrapper.className = 'code-wrapper'
    // 将包裹元素插入到 <pre> 标签之前，再把 <pre> 标签挪进去
    code.parentNode?.insertBefore(wrapper, code)
    wrapper.appendChild(code)

    // 创建一个标准的 HTML button 元素
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.title = '复制代码'
    copyButton.innerHTML = copyIconSVG
    // 将按钮添加到包裹元素中
    wrapper.appendChild(copyButton)

    // 添加点击事件
    let timerId = <number | null>null
    copyButton.addEventListener('click', () => {
      if (timerId) {
        clearTimeout(timerId)
      } else if (!copyButton.classList.contains('copied')) {
        const codeContent = code.querySelector('code')?.innerText
        if (codeContent) {
          // 使用浏览器的剪贴板 API
          navigator.clipboard.writeText(codeContent).then(() => {
            copyButton.classList.add('copied')
          })
        }
      }
      timerId = setTimeout(() => {
        copyButton.classList.remove('copied')
        timerId = null
      }, 1300)
    })
  })
}
