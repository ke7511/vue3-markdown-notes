<script setup lang="ts">
import { ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Close, Expand } from '@element-plus/icons-vue'

// 笔记列表宽度
const sidebarSize = ref(18)
/* 判断动画是否应该开启
点击关闭/打开笔记列表时关闭动画，等待关闭/打开完成后再打开，
避免关闭/打开时触发Splitpanes自带动画影响观感*/
const isClosing = ref(false)
// 关闭笔记列表前的宽度，使笔记列表在打开时保持上次关闭时的宽度
let lastSidebarSize = 25

// 获取size
const onResize = ({ panes }: { panes: { size: number }[] }) => {
  sidebarSize.value = panes[0].size
}

// 点击关闭笔记列表
const closeSidebar = () => {
  isClosing.value = true
  lastSidebarSize = sidebarSize.value
  sidebarSize.value = 0
  requestAnimationFrame(() => {
    isClosing.value = false
  })
}

// 点击开启笔记列表
const openSidebar = () => {
  isClosing.value = true
  sidebarSize.value = lastSidebarSize

  requestAnimationFrame(() => {
    isClosing.value = false
  })
}
</script>

<template>
  <div class="app-container">
    <splitpanes
      class="default-theme"
      :class="{ 'no-transition': isClosing }"
      @resize="onResize"
    >
      <pane
        v-show="sidebarSize > 0"
        :size="sidebarSize"
        class="sidebar-pane"
        min-size="12"
        max-size="25"
      >
        <div class="panel-content sidebar-area">
          <div class="sidebar-header">
            <h3>笔记列表</h3>
            <el-icon
              style="font-size: 20px; cursor: pointer"
              @click="closeSidebar"
            >
              <Close />
            </el-icon>
          </div>
          <div class="note-list-container">
            <!-- NoteList -->
          </div>
        </div>
      </pane>

      <pane :size="100 - sidebarSize" class="main-pane" min-size="70">
        <div class="main-content-wrapper">
          <div v-if="sidebarSize < 1" class="toggle-button-wrapper">
            <el-icon style="cursor: pointer" @click="openSidebar">
              <Expand />
            </el-icon>
          </div>
          <splitpanes class="inner-splitter">
            <pane size="50" min-size="20">
              <div class="panel-content editor-area">
                <div :class="{ iconShow: sidebarSize < 1 }">
                  <h3>编辑器</h3>
                </div>
                <RouterView />
              </div>
            </pane>
            <pane size="50" min-size="20">
              <div class="panel-content preview-area">
                <h3>预览区</h3>
              </div>
            </pane>
          </splitpanes>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<style scoped>
.el-icon {
  cursor: pointer;
}

.app-container {
  height: 100vh;
  width: 100vw;
}

.splitpanes.default-theme .splitpanes__splitter {
  background-color: #f0f0f0;
  border-left: 1px solid #e8e8e8;
  position: relative;
}

.splitpanes.default-theme .splitpanes__splitter:hover {
  border-color: var(--el-color-primary);
}

.panel-content {
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
}
.panel-content h3 {
  margin: 0;
}
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  flex-shrink: 0;
}
.sidebar-header h3 {
  margin: 0;
}
.note-list-container {
  padding: 0 1rem 1rem 1rem;
  flex-grow: 1;
  overflow-y: auto;
}

.main-pane {
  position: relative;
}
.main-content-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.toggle-button-wrapper {
  position: absolute;
  left: 10px;
  top: 27px;
  transform: translateY(-50%);
  z-index: 10;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-splitter {
  height: 100%;
}
.editor-area,
.preview-area {
  padding: 1rem;
}
.iconShow {
  margin-left: 26px;
  transition: all 0.5s;
}

/* 禁用关闭/展开时的动画 */
.no-transition .splitpanes__pane {
  transition: none !important;
}
</style>
