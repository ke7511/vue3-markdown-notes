<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import markdownit from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{ content: string }>()

// 初始化 markdown-it
const md = new markdownit({
  highlight: function (str, lang) {
    let codeHtml = ''
    if (lang && hljs.getLanguage(lang)) {
      codeHtml = hljs.highlight(str, { language: lang }).value
    } else {
      codeHtml = hljs.highlightAuto(str).value
    }
    return `<pre class="hljs"><code>${codeHtml}</code></pre>`
  }
})

// 创建一个计算属性，用于实时渲染预览区的 HTML
const renderedMarkdown = computed(() =>
  DOMPurify.sanitize(md.render(props.content))
)

// 增加复制按钮
// 获取代码块引用
const markdownRef = ref<HTMLDivElement | null>(null)
// 将 SVG 图标定义为一个常量，方便管理
const copyIconSVG =
  '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64z"></path><path fill="currentColor" d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64"></path></svg>'
const addCopyButton = () => {
  if (!markdownRef.value) return
  const codeBlocks = markdownRef.value.querySelectorAll('pre.hljs')
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
      }
      if (!copyButton.classList.contains('copied')) {
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
      }, 2000)
    })
  })
}

// 侦听 props.content 的变化, 并在 DOM 更新后执行添加按钮的函数
watch(
  () => props.content,
  () => {
    nextTick(() => {
      addCopyButton()
    })
  },
  { immediate: true }
)
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div ref="markdownRef" class="markdown-body" v-html="renderedMarkdown"></div>
</template>

<style scoped lang="scss">
.markdown-body {
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #a8a8a8 #fff;
  line-height: 1.5;

  :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
  }
  :deep(pre) {
    background-color: #f5f7f6;
    border-radius: 5px;
    padding: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
  }
  :deep(h1) {
    border-bottom: 1px solid #eee;
    padding-bottom: 0.3em;
  }
  :deep(code) {
    font-family: 'Consolas', monospace;
  }

  // 复制按钮样式
  :deep(.code-wrapper) {
    position: relative;
  }
  :deep(.copy-button) {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: auto;
    min-width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    font-size: 12px;
    transition:
      opacity 0.2s ease-in-out,
      background-color 0.2s ease;
    // gap 会自动在 ::before 伪元素和 SVG 之间应用间距
    gap: 6px;
  }
  :deep(.copy-button svg) {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    // 保留原来的颜色控制
    stroke: currentColor;
  }

  // 当鼠标悬停在代码块容器上时，显示按钮
  :deep(.code-wrapper:hover .copy-button) {
    opacity: 1;
  }
  /* 当 .copy-button 拥有 .copied 类时，为其 ::before 伪元素设置内容和样式 */
  :deep(.copy-button.copied::before) {
    content: '已复制';
    flex-shrink: 0;
  }

  :deep(.copy-button:not(.copied):hover) {
    background-color: #fefafa;
  }
  /* 复制成功后的状态，现在只改变背景色 */
  :deep(.copy-button.copied) {
    background-color: #fefafa;
  }
}
</style>
