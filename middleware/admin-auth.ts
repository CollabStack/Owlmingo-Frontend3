import { defineNuxtRouteMiddleware, navigateTo } from '#app';
// import { userAuth } from '~/store/userAuth';
import { adminAuth } from '~/store/adminAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  const adminStore = adminAuth();
  const token = adminStore.getToken();
  const isValidToken = token && await adminStore.checkTokenExpired();

  // Not logged in? Redirect to auth
  if (!token || !isValidToken) {
    return navigateTo('/admin/auth');
  }
  const admin = await adminStore.getAdmin() as { role?: string } | null;
  // Check if user is admin
  if (!admin || admin.role !== 'admin') {
    console.log('User role is user, redirecting to /admin/auth');
    adminStore.logout();
    window.location.href = "/admin/auth";
    return;
  }

    // Redirect unauthenticated users to /auth
    if (!token || !isValidToken) {
        console.log('No valid token found, redirecting to /admin/auth');
        return navigateTo('/admin/auth');
    }
  // ✅ Authorized admin, allow access
});
