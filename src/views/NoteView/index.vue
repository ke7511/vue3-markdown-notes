<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Expand } from '@element-plus/icons-vue'
import NoteEditor from './modules/NoteEditor.vue'
import NotePreview from './modules/NotePreview.vue'
import { useNoteLoader } from '@/composables/useNoteLoader'
import { useSidebarStore } from '@/stores/sidebar'
import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const sidebarStore = useSidebarStore()
const emits = defineEmits(['editor-size'])

const route = useRoute()
const { currentNote, noteContent, loadNote } = useNoteLoader()

// 为 NoteEditor 组件创建一个 ref
const noteEditorRef = ref<InstanceType<typeof NoteEditor> | null>(null)

// 创建一个新的函数来组合数据加载和 DOM 操作
const loadNoteAndFocus = async (noteId: string) => {
  loadNote(noteId)
  noteEditorRef.value?.focusTextarea()
}

// 加载笔记
onMounted(() => {
  const id = Array.isArray(route.params.noteId)
    ? route.params.noteId[0]
    : route.params.noteId
  if (id) {
    loadNoteAndFocus(id)
  }
})

// 监听路由变化
watch(
  () => route.params.noteId,
  (newId) => {
    if (newId) {
      const id = Array.isArray(newId) ? newId[0] : newId
      loadNoteAndFocus(id)
    }
  }
)

// 编辑区大小（持久化到 localStorage）
const editorSize = ref(Number(localStorage.getItem('editor-size')) || 650)
onMounted(() => {
  emits('editor-size', editorSize.value)
})
watch(editorSize, (val) => {
  emits('editor-size', val)
  localStorage.setItem('editor-size', String(val))
})

// 导出为markdown
const downloadMarkdown = () => {
  const blob = new Blob([noteContent.value], { type: 'text/markdown' })
  saveAs(blob, `${currentNote.value?.title}.md`)
  ElMessage.success('导出成功')
}
</script>

<template>
  <Splitpanes>
    <pane min-size="30" size="40">
      <div v-if="sidebarStore.sidebarSize < 1" class="toggle-button-wrapper">
        <el-icon
          style="cursor: pointer"
          title="打开笔记列表"
          @click="sidebarStore.openSidebar()"
        >
          <Expand />
        </el-icon>
      </div>
      <div class="panel-content">
        <div
          class="panel-title panel-title-editor"
          :class="{ 'title-active': sidebarStore.sidebarSize < 1 }"
        >
          <h3>编辑区</h3>
        </div>
        <NoteEditor
          ref="noteEditorRef"
          v-model="noteContent"
          :current-note="currentNote"
        />
      </div>
    </pane>

    <pane min-size="30" size="40">
      <div class="panel-content">
        <div class="panel-title panel-title-preview">
          <h3>预览区</h3>
          <img
            class="md-export-btn"
            src="../../../public/Markdown-mark.svg"
            title="导出为markdown"
            alt="md"
            @click="downloadMarkdown"
          />
        </div>
        <NotePreview :content="noteContent" />
      </div>
    </pane>
  </Splitpanes>
</template>

<style scoped lang="scss">
:deep(.splitpanes__splitter) {
  background-color: #f5f7f6;
  width: 2px;
}
.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .panel-title {
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #dddfe5;
    z-index: 10;
    .md-export-btn {
      height: 20px;
      width: auto;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.2);
        filter: brightness(0.8);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }

  .panel-title-editor::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 1px;
    background-color: #dddfe5;
    transform: scaleX(0.5);
    transform-origin: right;
  }

  .panel-title-preview::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    background-color: #dddfe5;
    transform: scaleX(0.5);
    transform-origin: left;
  }

  .title-active {
    padding-left: 20px;
    transition: all 0.5s;
  }

  h3 {
    margin: 0;
    line-height: 32px;
    flex-shrink: 0;
  }
}
.toggle-button-wrapper {
  z-index: 999;
  position: absolute;
  left: 0;
  top: 18px;
  :deep(.el-icon):hover {
    background-color: #fafafa;
  }
}
</style>
