import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const sidebarSize = ref(Number(localStorage.getItem('sidebar-size') ?? 180))

  return {
    sidebarSize
  }
})
