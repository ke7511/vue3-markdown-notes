<script setup lang="ts">
import { useNoteStore, type NoteType } from '@/stores/note'
import { useRoute } from 'vue-router'
import { computed, ref, watch, onMounted, nextTick } from 'vue'
// import { ElMessage } from 'element-plus'
import DOMPurify from 'dompurify'
import markdownit from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
import { useDebounceFn } from '@vueuse/core'
import { Expand } from '@element-plus/icons-vue'

// 接收传来的sidebarSize
defineProps({
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
const editorRef = ref<HTMLTextAreaElement | null>(null)

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
        // 聚焦
        editorRef.value.focus()
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
const md = new markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      // 如果用户指定了语言，并且 highlight.js 支持，就用指定语言
      return (
        '<pre class="hljs"><code>' +
        hljs.highlight(str, { language: lang }).value +
        '</code></pre>'
      )
    }

    // 否则走自动检测
    const autoHighlight = hljs.highlightAuto(str)
    return '<pre class="hljs"><code>' + autoHighlight.value + '</code></pre>'
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
// onMounted(() => {
//   if (editorRef.value) {
//     // editorRef.value.focus()
//     editorRef.value.innerText = noteContent.value
//   }
// })

// const onInput = (e: Event) => {
//   const target = e.target as HTMLDivElement | null
//   console.log(e.target)
//   if (target) {
//     noteContent.value = target.innerText || ''
//   }
// }
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
        <textarea
          ref="editorRef"
          v-model="noteContent"
          class="editor-textarea"
          placeholder="请输入内容..."
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
      box-sizing: border-box;
      padding: 10px 10px;
      background-color: #f5f7f6;
    }
    .placeholder {
      padding: 20px;
      color: #909399;
    }

    .editor-pane {
      box-sizing: border-box;
      flex: 1;
      .editor-textarea {
        resize: none;
        display: block;
        // margin: 0;
        box-sizing: border-box;
        // background-color: orange;
        width: 100% !important;
        height: 100% !important;
        padding: 10px;
        overflow-y: auto; /* 开启滚动 */
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1.5;
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
      :deep(pre) {
        white-space: pre-wrap; /* 保留换行，同时允许长行换行 */
        word-wrap: break-word; /* 长单词换行 */
        overflow-x: auto; /* 超出时依然可横向滚动 */
      }
      :deep(h1) {
        border-bottom: 1px solid #eee;
        padding-bottom: 0.3em;
      }
      :deep(code) {
        font-family: 'Consolas';
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
