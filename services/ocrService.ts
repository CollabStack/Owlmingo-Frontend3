import { useRuntimeConfig } from 'nuxt/app';
import { userAuth } from '~/store/userAuth';

export async function processFile(file: File | Blob) {
  const authStore = userAuth();
  const config = useRuntimeConfig();
  const url = `${config.public.USER_PRIVATE_API}process-file`;
  
  console.log('OCR Service - Starting file processing');
  
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

    console.log('OCR Service - Sending request to:', url);
    console.log('OCR Service - File type:', file.type);
    console.log('OCR Service - File size:', file.size);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      credentials: 'include'
    });

    console.log('OCR Service - Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Authentication expired');
      }
      const errorData = await response.json();
      console.error('OCR Service - Error response:', errorData);
      throw new Error(errorData.message || 'Failed to process file');
    }

    const responseData = await response.json();
    console.log('OCR Service - Response data:', JSON.stringify(responseData, null, 2));
    return responseData;

  } catch (error) {
    console.error('OCR processing error:', error);
    throw error;
  }
}

export async function generateSummaryFromFile(fileId: string) {
  const authStore = userAuth();
  const config = useRuntimeConfig();
  const url = `${config.public.USER_PRIVATE_API}summaries`;
  
  console.log('Summary Service - Starting summary generation for file:', fileId);
  
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
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId }),
      credentials: 'include'
    });

    console.log('Summary Service - Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Authentication expired');
      }
      const errorData = await response.json();
      console.error('Summary Service - Error response:', errorData);
      throw new Error(errorData.message || 'Failed to generate summary');
    }

    const responseData = await response.json();
    console.log('Summary Service - Response data:', JSON.stringify(responseData, null, 2));
    return responseData;

  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
}
