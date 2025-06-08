import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from '~pages'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach((to, from, next) => {
  // Handle admin paths
  if (to.path.includes('admin')) {
    const adminToken = localStorage.getItem('adminToken')
    console.log(`Navigating to admin path: ${to.fullPath}`)
    console.log(`Admin token found: ${!!adminToken}`)

    if (to.meta.requiresAuth && !adminToken) {
      console.log('Admin token missing, redirecting to admin login.')
      return next('/auth/admin-login')
    }
    return next()
  }
  // Handle user paths
  else if (to.path.includes('user')) {
    const userToken = localStorage.getItem('userToken')
    console.log(`Navigating to user path: ${to.fullPath}`)
    console.log(`User token found: ${!!userToken}`)

    if (to.meta.requiresAuth && !userToken) {
      console.log('User token missing, redirecting to user login.')
      return next('/auth/user-login')
    }
    return next()
  }

  // If neither admin nor user path logic applies, proceed as normal
  return next()
})

export default router
