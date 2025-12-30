<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'
import { Sunny, Moon } from '@element-plus/icons-vue'

const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)
</script>

<template>
  <el-switch
    :model-value="currentTheme"
    :active-action-icon="Sunny"
    :inactive-action-icon="Moon"
    active-value="light"
    inactive-value="dark"
    @change="themeStore.toggleTheme"
  />
</template>

<style scoped lang="scss"></style>
