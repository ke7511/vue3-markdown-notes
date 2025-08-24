import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/Layout/index.vue'),
      redirect: '/note/welcome',
      children: [
        {
          path: 'note/:noteId',
          component: () => import('@/pages/Note/index.vue')
        },
        {
          path: 'settings',
          component: () => import('@/pages/Settings/index.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/NotFound/index.vue')
    }
  ]
})

export default router
