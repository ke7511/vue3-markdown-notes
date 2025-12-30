import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 主题模式: 'light' | 'dark' | 'system'
    const themeMode = ref<'light' | 'dark' | 'system'>('system')

    // 系统是否偏好暗色
    const systemPrefersDark = ref(
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    // 实际应用的主题
    const currentTheme = computed(() => {
      if (themeMode.value === 'system') {
        return systemPrefersDark.value ? 'dark' : 'light'
      }
      return themeMode.value
    })

    // 应用主题到 DOM
    function applyTheme() {
      const html = document.documentElement
      html.setAttribute('data-theme', currentTheme.value)
      // Element Plus 暗色主题需要 dark 类名
      if (currentTheme.value === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }

      // 动态切换 highlight.js 主题
      const hljsLinkId = 'hljs-theme'
      let link = document.getElementById(hljsLinkId) as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.id = hljsLinkId
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      // 根据主题切换不同的 CSS 文件
      const themeName = currentTheme.value === 'dark' ? 'github-dark' : 'github'
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeName}.min.css`
    }

    // 切换主题
    function toggleTheme() {
      themeMode.value = currentTheme.value === 'light' ? 'dark' : 'light'
    }

    // 监听主题模式变化
    watch(themeMode, applyTheme, { immediate: true })

    // 监听系统主题变化
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        systemPrefersDark.value = e.matches
      })

    return { themeMode, currentTheme, toggleTheme }
  },
  {
    persist: {
      pick: ['themeMode']
    }
  }
)
