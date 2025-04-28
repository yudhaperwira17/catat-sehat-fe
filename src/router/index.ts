import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from '~pages'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  routes,
  history: createWebHistory()
})

// router.beforeEach((to, from, next) => {
//   if (to.path.includes('admin')) {
//     const token = localStorage.getItem('adminToken')
//     console.log(to)
//     if (to.meta.requiresAuth && !token) {
//       return next('/auth/user-login')
//     }
//     next()
//   }
//   if (to.path.includes('user')) {
//     const token = localStorage.getItem('userToken')
//     console.log(to)
//     if (to.meta.requiresAuth && !token) {
//       return next('/auth/user-login')
//     }
//     next()
//   }
//   next()

// })

export default router
