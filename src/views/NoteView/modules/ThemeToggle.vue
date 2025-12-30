<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import { Sunny, Moon } from '@element-plus/icons-vue'

const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)
</script>

<template>
  <el-button
    text
    circle
    :title="currentTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    @click="themeStore.toggleTheme()"
  >
    <el-icon>
      <Sunny v-if="currentTheme === 'dark'" />
      <Moon v-else />
    </el-icon>
  </el-button>
</template>

<style scoped lang="scss"></style>
