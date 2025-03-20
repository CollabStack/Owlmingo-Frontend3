import axios from 'axios';
import { defineNuxtPlugin } from '#app';
import Cookies from 'js-cookie';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  // Create axios instances
  const UserPublicAPIAxiosInstance = axios.create({
    baseURL: config.public.USER_PUBLIC_API,
    withCredentials: true
  });
  
  const AdminPublicAPIAxiosInstance = axios.create({
    baseURL: config.public.ADMIN_PUBLIC_API,
    withCredentials: true
  });
  
  const UserPrivateAPIAxiosInstance = axios.create({
    baseURL: config.public.USER_PRIVATE_API,
    withCredentials: true
  });
  
  const AdminPrivateAPIAxiosInstance = axios.create({
    baseURL: config.public.ADMIN_PRIVATE_API,
    withCredentials: true
  });

  // Enhanced token retrieval function
  const getAuthToken = () => {
    // Try cookie first
    let token = Cookies.get('token');
    
    // Fall back to localStorage if cookie not found
    if (!token) {
      token = localStorage.getItem('auth_token_backup');
      // Restore cookie if found in localStorage
      if (token) {
        Cookies.set('token', token, { 
          expires: 7,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax'
        });
      }
    }
    
    return token;
  };

  // Add request interceptors to attach token
  UserPrivateAPIAxiosInstance.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  AdminPrivateAPIAxiosInstance.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptors to handle token expiration
  [UserPublicAPIAxiosInstance, AdminPublicAPIAxiosInstance, 
   UserPrivateAPIAxiosInstance, AdminPrivateAPIAxiosInstance].forEach(instance => {
    instance.interceptors.response.use(
      response => response,
      async error => {
        // Handle 401 errors - token expired or invalid
        if (error.response && error.response.status === 401) {
          console.log('Received 401 in axios, checking auth state');
          const authStore = nuxtApp.$pinia ? userAuth(nuxtApp.$pinia) : null;
          
          if (authStore) {
            // Try to refresh token
            try {
              await authStore.refreshToken();
              // If refreshed successfully, retry original request
              const token = authStore.getToken();
              if (token) {
                error.config.headers.Authorization = `Bearer ${token}`;
                return instance(error.config);
              }
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  });

  // Provide all instances globally
  nuxtApp.provide('UserPublicAxios', UserPublicAPIAxiosInstance);
  nuxtApp.provide('AdminPublicAxios', AdminPublicAPIAxiosInstance);
  nuxtApp.provide('UserPrivateAxios', UserPrivateAPIAxiosInstance);
  nuxtApp.provide('AdminPrivateAxios', AdminPrivateAPIAxiosInstance);
});
