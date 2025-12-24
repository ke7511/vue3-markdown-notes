<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useNoteStore } from '@/stores/note'
import { useSidebarStore } from '@/stores/sidebar'

const notesStore = useNoteStore()
const sidebarStore = useSidebarStore()

onMounted(() => {
  // 调用 action 从数据库加载数据
  notesStore.loadFromDB()
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
