import { useRuntimeConfig } from 'nuxt/app';
import { userAuth } from '~/store/userAuth';

export async function processFile(file: File | Blob) {
  const authStore = userAuth();
  const config = useRuntimeConfig();
  const url = `${config.public.USER_PRIVATE_API}process-file`;
  
  // Initialize auth if needed
  if (!authStore.isLoggedIn) {
    authStore.init();
  }

  let token = authStore.getToken();
  
  // Verify and refresh token if needed
  const isValid = await authStore.checkTokenExpired();
  if (!isValid) {
    throw new Error('Authentication required');
  }

  // Get fresh token after potential refresh
  token = authStore.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Authentication expired');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to process file');
    }

    return await response.json();

  } catch (error) {
    console.error('OCR processing error:', error);
    throw error;
  }
}
