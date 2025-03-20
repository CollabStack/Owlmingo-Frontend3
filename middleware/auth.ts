import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { userAuth } from '~/store/userAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = userAuth();
  
  // Skip middleware completely for auth-related pages
  if (to.path.startsWith('/auth')) {
    const token = authStore.getToken();
    // Only redirect if we're definitely logged in
    if (token && authStore.isLoggedIn) {
      try {
        const isValid = await authStore.checkTokenExpired();
        if (isValid) {
          return navigateTo('/');
        }
      } catch (error) {
        // If check fails, continue to auth page
        console.error('Auth check error:', error);
      }
    }
    return; // Allow access to auth pages without further checks
  }

  // For protected routes, initialize auth first
  authStore.init();
  
  // Try to get token, check if we're logged in
  const token = authStore.getToken();
  if (!token) {
    console.log('No token found, redirecting to /auth');
    return navigateTo('/auth');
  }
  
  try {
    // Verify token validity
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      console.log('Invalid or expired token, redirecting to /auth');
      authStore.logout();
      return navigateTo('/auth');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return navigateTo('/auth');
  }
  
});