<script setup lang="ts">
import { watch, ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import NoteEditor from './modules/NoteEditor.vue'
import NotePreview from './modules/NotePreview.vue'
import ThemeToggle from './modules/ThemeToggle.vue'
import MarkdownExport from './modules/MarkdownExport.vue'
import { useNoteLoader } from '@/composables/useNoteLoader'
import { useSidebarStore } from '@/stores/sidebar'
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
// 为 NotePreview 组件创建一个 ref
const notePreviewRef = ref<InstanceType<typeof NotePreview> | null>(null)

// 创建一个新的函数来组合数据加载和 DOM 操作
const loadNoteAndFocus = async (noteId: string) => {
  loadNote(noteId)
  await nextTick()
  noteEditorRef.value?.focusTextarea()
}

// 监听路由变化
watch(
  () => route.params.noteId,
  (newId) => {
    if (newId) {
      const id = Array.isArray(newId) ? newId[0] : newId
      loadNoteAndFocus(id)
    }
  },
  { immediate: true }
)

// 持久化编辑和预览区大小
const paneSize = ref(Number(localStorage.getItem('paneSize')) || 50)
function storePaneSize({ prevPane }: { prevPane: { size: number } }) {
  paneSize.value = prevPane.size
  localStorage.setItem('paneSize', String(prevPane.size))
}

// ============ 同步滚动功能 ============

// 编辑区滚动时，同步预览区
const handleEditorScroll = (ratio: number) => {
  const container = notePreviewRef.value?.markdownRef
  if (!container) return

  const scrollHeight = container.scrollHeight - container.clientHeight
  container.scrollTop = ratio * scrollHeight
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
          @editor-scroll="handleEditorScroll"
        />
      </div>
    </pane>

    <pane min-size="30" :size="100 - paneSize">
      <div class="panel-content">
        <div class="panel-title">
          <h3>预览区</h3>
          <div class="panel-modules">
            <ThemeToggle />
            <MarkdownExport
              :note-content="noteContent"
              :current-note="currentNote"
            />
          </div>
        </div>
        <NotePreview ref="notePreviewRef" :content="noteContent" />
      </div>
    </pane>
  </Splitpanes>
</template>

<style scoped lang="scss">
:deep(.splitpanes__splitter) {
  background-color: var(--divider-color);
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
    border-bottom: 1px solid var(--divider-color);
    z-index: 10;

    .panel-modules {
      display: flex;
      align-items: center;
      gap: 20px;
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
