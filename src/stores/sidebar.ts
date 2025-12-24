import { defineStore } from 'pinia'
import { ref } from 'vue'

// 响应式断点：当窗口宽度小于此值时自动隐藏侧边栏
const MOBILE_BREAKPOINT = 768

export const useSidebarStore = defineStore(
  'sidebar',
  () => {
    // 笔记列表宽度
    const isSidebarVisible = ref(true)

    // 点击开启笔记列表
    function openSidebar() {
      isSidebarVisible.value = true
    }

    // 点击关闭笔记列表
    function closeSidebar() {
      isSidebarVisible.value = false
    }

    // 根据窗口宽度自动调整侧边栏显示状态
    function handleResize() {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        isSidebarVisible.value = false
      }
    }

    // 初始化监听器
    function initResizeListener() {
      // 初始检查一次
      handleResize()
      window.addEventListener('resize', handleResize)
    }

    // 清理监听器
    function destroyResizeListener() {
      window.removeEventListener('resize', handleResize)
    }

    return {
      isSidebarVisible,
      openSidebar,
      closeSidebar,
      initResizeListener,
      destroyResizeListener
    }
  },
  {
    persist: true
  }
)
