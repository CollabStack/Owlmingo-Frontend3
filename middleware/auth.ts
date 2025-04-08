import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { userAuth } from '~/store/userAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = userAuth();
  const token = authStore.getToken();
  console.log("======================= User Auth Middleware ========================");
  const isValidToken = token && await authStore.checkTokenExpired();

  // Redirect authenticated users away from /auth
  if (isValidToken && to.path === '/auth') {
    console.log('Redirecting authenticated user away from /auth');
    return navigateTo('/');
  }
  const user = await authStore.getUser() as { role?: string } | null;

  if (!user || user?.role !== 'user') {
    console.log('User role is user, redirecting to /auth');
    authStore.logout();
    window.location.href = "/auth";
    return;
    // return navigateTo('/auth');
  }

  // Redirect unauthenticated users to /auth
  if (!token || !isValidToken) {
    console.log('No valid token found, redirecting to /auth');
    return navigateTo('/auth');
  }
});