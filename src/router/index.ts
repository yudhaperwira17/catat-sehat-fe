import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from '~pages'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach((to, from, next) => {
  // Define routes that do NOT require authentication
  const publicRoutes = ['/auth/admin-login', '/auth/user-login'];

  // Check if the route being navigated to is a public route
  if (publicRoutes.includes(to.path)) {
    console.log(`Allowing access to public path: ${to.fullPath}`);
    return next(); // Allow immediate access
  }

  // --- Authenticated Routes Logic ---
  // If it's an admin path
  if (to.path.includes('admin')) {
    const adminToken = localStorage.getItem('adminToken');
    console.log(`Navigating to protected admin path: ${to.fullPath}`);
    console.log(`Admin token found for protected path: ${!!adminToken}`);
    console.log(`Full admin token in router guard: ${adminToken}`);

    if (to.meta.requiresAuth && !adminToken) {
      console.log('Protected admin path without token, redirecting to admin login.');
      return next('/auth/admin-login'); // Redirect to admin login
    }
    // If it's an admin path and either doesn't require auth or token is present
    return next(); // Proceed with admin path
  }
  // If it's a user path
  else if (to.path.includes('user')) {
    const userToken = localStorage.getItem('userToken');
    console.log(`Navigating to protected user path: ${to.fullPath}`);
    console.log(`User token found for protected path: ${!!userToken}`);

    if (to.meta.requiresAuth && !userToken) {
      console.log('Protected user path without token, redirecting to user login.');
      return next('/auth/user-login'); // Redirect to user login
    }
    // If it's a user path and either doesn't require auth or token is present
    return next(); // Proceed with user path
  }

  // Fallback for any other routes (e.g., root, or routes not explicitly admin/user)
  console.log(`Processing general route: ${to.fullPath}`);
  return next(); // Proceed with general navigation
})

export default router
