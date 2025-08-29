<script setup lang="ts">
import { useNoteStore, type NoteType } from '@/stores/note'
import { useRoute } from 'vue-router'
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import DOMPurify from 'dompurify'
import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useDebounceFn } from '@vueuse/core'
import { Expand } from '@element-plus/icons-vue'

// 接收传来的sidebarSize
const props = defineProps({
  sidebarSize: {
    type: Number,
    default: 0
  }
})

// 打开笔记列表
const emits = defineEmits(['open-sidebar'])
const openSidebar = () => {
  emits('open-sidebar')
}

const noteStore = useNoteStore()
const currentNote = ref<NoteType | null>()
const noteContent = ref('')
const editorRef = ref<HTMLDivElement | null>(null)

// 接收路由传来的noteId
// watch会在 noteId 变化时自动重新运行
const route = useRoute()
watch(
  () => route.params.noteId,
  async (newId) => {
    const id = Array.isArray(newId) ? newId[0] : newId
    const note = noteStore.getNoteById(id)
    if (note) {
      currentNote.value = note
      noteContent.value = note.content
      await nextTick()
      if (editorRef.value) {
        editorRef.value.innerText = noteContent.value
        editorRef.value.focus()
        // 将光标移动到最后
        const range = document.createRange()
        range.selectNodeContents(editorRef.value)
        range.collapse(false) // false 表示折叠到末尾
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    } else {
      currentNote.value = null
      noteContent.value = ''
      // ElMessage.error('找不到您的笔记')
    }
  },
  { immediate: true }
)

// 监听currentNote 是否还存在于 noteStore
watch(
  () => noteStore.noteList,
  () => {
    if (currentNote.value && !noteStore.noteList.includes(currentNote.value)) {
      currentNote.value = null
      noteContent.value = ''
    }
  }
)

// 初始化markdown-it
const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 创建一个计算属性，用于实时渲染预览区的 HTML
const renderedMarkdown = computed(() => {
  return DOMPurify.sanitize(md.render(noteContent.value))
})

//监听 noteContent 的变化，并更新笔记内容
const saveNoteContent = useDebounceFn((newContent: string) => {
  if (currentNote.value) {
    noteStore.updateNoteContent(currentNote.value.id, newContent)
  }
}, 500)
watch(noteContent, (newContent) => {
  saveNoteContent(newContent)
})

// 组件加载完毕后，渲染编辑区的内容
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.focus()
    editorRef.value.innerText = noteContent.value
  }
})
const onInput = (e: Event) => {
  const target = e.target as HTMLDivElement | null
  if (target) {
    noteContent.value = target.innerText || ''
  }
}

// 粘贴为纯文本
const onPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain')
  if (text) {
    document.execCommand('insertText', false, text)
  }
}
</script>

<template>
  <el-splitter-panel min="30%">
    <div v-if="sidebarSize < 1" class="toggle-button-wrapper">
      <el-icon style="cursor: pointer" @click="openSidebar">
        <Expand />
      </el-icon>
    </div>
    <div class="panel-content">
      <div :class="{ iconShow: sidebarSize < 1 }" class="panel-title">
        <h3>编辑区</h3>
      </div>
      <div v-if="currentNote" class="editor-pane">
        <div
          ref="editorRef"
          class="editor-textarea"
          contenteditable="true"
          @input="onInput"
          @paste="onPaste"
        />
      </div>
      <div v-else class="placeholder">
        <div>请在左侧选择一篇笔记，或新建一篇笔记。</div>
      </div>
    </div>
  </el-splitter-panel>
  <el-splitter-panel size="40%" min="30%">
    <div class="panel-content">
      <div class="panel-title">
        <h3>预览区</h3>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="markdown-body" v-html="renderedMarkdown"></div>
    </div>
  </el-splitter-panel>
</template>

<style scoped lang="scss">
.el-splitter-panel {
  position: relative;
  // padding: 10px;
  box-sizing: border-box;
  .toggle-button-wrapper {
    position: absolute;
    left: 0;
    top: 18px;
  }

  .panel-content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .panel-title {
      padding: 10px 10px;
      background-color: #f5f7f6;
    }
    .placeholder {
      padding: 20px;
      color: #909399;
    }

    .editor-pane {
      margin-top: 10px;
      padding: 0 10px;
      box-sizing: border-box;
      flex: 1;
      .editor-textarea {
        padding: 10px;
        overflow-y: auto; /* 开启滚动 */
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1.5;
        font-family: 'Helvetica Neue', 'Arial', sans-serif;
        white-space: pre-wrap; /* 保留换行 */
        word-break: break-word;
      }
    }

    .markdown-body {
      line-height: 1.5;
      padding: 0 20px;
      flex: 1;
      :deep(img) {
        max-width: 100%;
        height: auto;
        display: block;
      }
      :deep(h1) {
        border-bottom: 1px solid #eee;
        padding-bottom: 0.3em;
      }
      :deep(code) {
        font-weight: 600;
      }
    }
    .iconShow {
      margin-left: 8px;
      transition: all 0.7s;
    }

    h3 {
      margin: 0;
      flex-shrink: 0; /* 防止标题被压缩 */
      line-height: 32px;
    }
  }
}
</style>
