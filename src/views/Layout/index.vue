<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Sidebar from '@/views/Sidebar/index.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()
const { isMobile, isMobileOpen } = storeToRefs(sidebarStore)

// 初始化响应式监听
onMounted(() => {
  sidebarStore.initResizeListener()
})

onUnmounted(() => {
  sidebarStore.destroyResizeListener()
})
</script>

<template>
  <div class="app-container">
    <Sidebar></Sidebar>

    <!-- 移动端遮罩层 -->
    <Transition name="fade">
      <div
        v-if="isMobile && isMobileOpen"
        class="overlay"
        @click="sidebarStore.closeSidebar()"
      ></div>
    </Transition>

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
}

// 遮罩层
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

// 遮罩层淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
