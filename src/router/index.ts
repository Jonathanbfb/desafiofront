import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login.vue'
import Dashboard from '@/views/Dashboard.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: () => {
      const auth = useAuthStore()
      if (!auth.token) return '/'
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
