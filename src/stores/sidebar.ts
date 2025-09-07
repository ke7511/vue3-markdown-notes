import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore(
  'sidebar',
  () => {
    // 笔记列表宽度
    const sidebarSize = ref(180)

    // 关闭笔记列表前的宽度，使笔记列表在打开时保持上次关闭时的宽度
    const lastSidebarSize = ref(180)

    // 点击开启笔记列表
    const openSidebar = () => {
      sidebarSize.value = lastSidebarSize.value
    }
    // 点击关闭笔记列表
    const closeSidebar = () => {
      lastSidebarSize.value = sidebarSize.value
      sidebarSize.value = 0
    }

    return {
      sidebarSize,
      lastSidebarSize,
      openSidebar,
      closeSidebar
    }
  },
  {
    persist: true
  }
)
