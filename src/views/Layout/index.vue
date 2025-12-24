<script setup lang="ts">
import Sidebar from '@/views/Sidebar/index.vue'
</script>

<template>
  <div class="app-container">
    <Sidebar></Sidebar>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}
</style>
