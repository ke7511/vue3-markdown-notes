import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 响应式断点：当窗口宽度小于此值时切换为抽屉模式
const MOBILE_BREAKPOINT = 768

export const useSidebarStore = defineStore(
  'sidebar',
  () => {
    // 是否为移动设备（抽屉模式）
    const isMobile = ref(false)

    // 桌面端：侧边栏是否收起（迷你模式，只显示图标）
    const isCollapsed = ref(false)

    // 移动端：抽屉是否打开
    const isMobileOpen = ref(false)

    // 判断侧边栏是否可见
    const isSidebarVisible = computed(() => {
      if (isMobile.value) {
        return isMobileOpen.value
      }
      return !isCollapsed.value
    })

    // 切换侧边栏状态
    function toggleSidebar() {
      if (isMobile.value) {
        isMobileOpen.value = !isMobileOpen.value
      } else {
        isCollapsed.value = !isCollapsed.value
      }
    }

    // 打开侧边栏
    function openSidebar() {
      if (isMobile.value) {
        isMobileOpen.value = true
      } else {
        isCollapsed.value = false
      }
    }

    // 关闭侧边栏
    function closeSidebar() {
      if (isMobile.value) {
        isMobileOpen.value = false
      } else {
        isCollapsed.value = true
      }
    }

    // 根据窗口宽度自动调整模式
    function handleResize() {
      const wasMobile = isMobile.value
      isMobile.value = window.innerWidth < MOBILE_BREAKPOINT

      // 从桌面切换到移动端时，关闭抽屉
      if (!wasMobile && isMobile.value) {
        isMobileOpen.value = false
      }
    }

    // 初始化监听器
    function initResizeListener() {
      handleResize()
      window.addEventListener('resize', handleResize)
    }

    // 清理监听器
    function destroyResizeListener() {
      window.removeEventListener('resize', handleResize)
    }

    return {
      isMobile,
      isCollapsed,
      isMobileOpen,
      isSidebarVisible,
      toggleSidebar,
      openSidebar,
      closeSidebar,
      initResizeListener,
      destroyResizeListener
    }
  },
  {
    persist: {
      // 只持久化桌面端的收起状态
      pick: ['isCollapsed']
    }
  }
)
