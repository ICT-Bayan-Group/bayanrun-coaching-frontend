import { createRouter, createWebHistory } from 'vue-router'
import ScanPage from '@/views/ScanPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import SuccessPage from '@/views/SuccessPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'scan',
    component: ScanPage,
    meta: { title: 'Scan QR - Bayan Run 2026' }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { title: 'Registrasi - Bayan Run 2026' }
  },
  {
    path: '/success',
    name: 'success',
    component: SuccessPage,
    meta: { title: 'Berhasil! - Bayan Run 2026' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta.title || 'Bayan Run 2026'
})

export default router
