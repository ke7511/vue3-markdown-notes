<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import NoteEditor from './modules/NoteEditor.vue'
import NotePreview from './modules/NotePreview.vue'
import { useNoteLoader } from '@/composables/useNoteLoader'
import { useSidebarStore } from '@/stores/sidebar'
import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const sidebarStore = useSidebarStore()
const { isMobile, isMobileOpen } = storeToRefs(sidebarStore)

// 移动端：显示菜单按钮打开抽屉
const showMenuButton = computed(() => isMobile.value && !isMobileOpen.value)

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

// 持久化编辑和预览区大小
const paneSize = ref(Number(localStorage.getItem('paneSize')) || 50)
function storePaneSize({ prevPane }: { prevPane: { size: number } }) {
  paneSize.value = prevPane.size
  localStorage.setItem('paneSize', String(prevPane.size))
}

// 导出为markdown
const downloadMarkdown = () => {
  const blob = new Blob([noteContent.value], { type: 'text/markdown' })
  saveAs(blob, `${currentNote.value?.title}.md`)
  ElMessage.success('导出成功')
}
</script>

<template>
  <Splitpanes @resized="storePaneSize">
    <pane min-size="30" :size="paneSize">
      <!-- 移动端菜单按钮 -->
      <div v-show="showMenuButton" class="toggle-button-wrapper">
        <el-icon
          style="cursor: pointer"
          title="打开笔记列表"
          @click="sidebarStore.openSidebar()"
        >
          <Menu />
        </el-icon>
      </div>
      <div class="panel-content">
        <div class="panel-title" :class="{ 'title-active': showMenuButton }">
          <h3>编辑区</h3>
        </div>
        <NoteEditor
          ref="noteEditorRef"
          v-model="noteContent"
          :current-note="currentNote"
        />
      </div>
    </pane>

    <pane min-size="30" :size="100 - paneSize">
      <div class="panel-content">
        <div class="panel-title">
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
  background-color: #dddfe4;
  width: 1px;
  position: relative;

  // 扩大触发区域的透明伪元素
  &::before {
    z-index: 11;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -8px; // 向右扩展8px
    cursor: col-resize;
  }
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

  .title-active {
    padding-left: 20px;
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
  // 淡入动画
  animation: fadeIn 0.3s ease;
  :deep(.el-icon):hover {
    background-color: #fafafa;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
