<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()

onMounted(() => {
  // 初始化窗口宽度监听
  sidebarStore.initResizeListener()
})

onUnmounted(() => {
  sidebarStore.destroyResizeListener()
})
</script>

<template>
  <div>
    <!-- 一级路由出口 -->
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
