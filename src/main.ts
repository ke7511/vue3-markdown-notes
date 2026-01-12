import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/variables.scss'
import { useNoteStore } from '@/stores/note'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

// 在挂载应用前先加载数据库数据
const noteStore = useNoteStore()
noteStore.loadFromDB().then(() => {
  app.mount('#app')
})
