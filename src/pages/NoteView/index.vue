<script setup lang="ts">
import { onMounted, watch, ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import { Expand } from '@element-plus/icons-vue'
import NoteEditor from './components/NoteEditor.vue'
import NotePreview from './components/NotePreview.vue'
import { useNoteLoader } from '@/composables/useNoteLoader'
import { useSidebarStore } from '@/stores/sidebar'

const useSidebar = useSidebarStore()
const emits = defineEmits(['editor-size'])

const route = useRoute()
const { currentNote, noteContent, loadNote } = useNoteLoader()

// ✨ 新增：为 NoteEditor 组件创建一个 ref
const noteEditorRef = ref<InstanceType<typeof NoteEditor> | null>(null)

// ✨ 新增：创建一个新的函数来组合数据加载和 DOM 操作
const loadNoteAndFocus = async (noteId: string) => {
  loadNote(noteId) // 1. 调用 composable 加载数据
  // 2. 调用子组件暴露的方法来聚焦
  // noteEditorRef.value 可能会是 null，所以用可选链 ?.
  noteEditorRef.value?.focusTextarea()
}
// 打开笔记列表
const openSidebarFn = inject<() => void>('open-sidebar')
const openSidebar = () => {
  if (openSidebarFn) {
    openSidebarFn()
  }
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
</script>

<template>
  <el-splitter-panel v-model:size="editorSize" min="30%">
    <div v-if="useSidebar.sidebarSize < 1" class="toggle-button-wrapper">
      <el-icon style="cursor: pointer" @click="openSidebar">
        <Expand />
      </el-icon>
    </div>
    <div class="panel-content">
      <div
        class="panel-title"
        :class="{ 'title-active': useSidebar.sidebarSize < 1 }"
      >
        <h3>编辑区</h3>
      </div>
      <NoteEditor
        ref="noteEditorRef"
        v-model="noteContent"
        :current-note="currentNote"
      />
    </div>
  </el-splitter-panel>

  <el-splitter-panel min="30%">
    <div class="panel-content">
      <div class="panel-title">
        <h3>预览区</h3>
      </div>
      <NotePreview :content="noteContent" />
    </div>
  </el-splitter-panel>
</template>

<style scoped lang="scss">
.panel-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .panel-title {
    padding: 10px;
    background-color: #f5f7f6;
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
  position: absolute;
  left: 0;
  top: 18px;
}
</style>
