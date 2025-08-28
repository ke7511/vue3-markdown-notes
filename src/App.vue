<script setup lang="ts">
import { onMounted } from 'vue'
import { useNoteStore } from '@/stores/note'

const notesStore = useNoteStore()

onMounted(() => {
  // 调用 action 从数据库加载数据
  notesStore.loadFromDB()
})
</script>

<template>
  <div>
    <!-- 一级路由出口 -->
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
