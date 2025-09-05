<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import markdownit from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'

const props = defineProps<{ content: string }>()

// 初始化 markdown-it
const md = new markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return (
        '<pre class="hljs"><code>' +
        hljs.highlight(str, { language: lang }).value +
        '</code></pre>'
      )
    }
    const autoHighlight = hljs.highlightAuto(str)
    return '<pre class="hljs"><code>' + autoHighlight.value + '</code></pre>'
  }
})

// 创建一个计算属性，用于实时渲染预览区的 HTML
const renderedMarkdown = computed(() =>
  DOMPurify.sanitize(md.render(props.content))
)
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="markdown-body" v-html="renderedMarkdown"></div>
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
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
  }
  :deep(h1) {
    border-bottom: 1px solid #eee;
    padding-bottom: 0.3em;
  }
  :deep(code) {
    font-family: 'Consolas';
  }
}
</style>
