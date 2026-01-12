import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/note-welcome',
      children: [
        {
          path: '/:noteId',
          component: () => import('@/views/NoteView/index.vue')
        }
      ]
    }
  ]
})

// 每次路由变化时记录
router.afterEach((to) => {
  localStorage.setItem('last-route', to.fullPath)
})

// 应用初始化时检查并跳转
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/note-welcome' && from === START_LOCATION) {
    const lastRoute = localStorage.getItem('last-route')
    if (lastRoute && lastRoute !== to.fullPath) {
      return next(lastRoute) // 跳转到上次记录的路由
    }
  }
  next()
})

export default router
