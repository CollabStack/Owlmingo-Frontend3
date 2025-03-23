import { processFile, generateSummaryFromFile } from './ocrService';
import { ref } from 'vue';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';
import { useRuntimeConfig } from 'nuxt/app';
import { useSummaryStore } from '~/store/summaryStore';

// Reactive state
const isLoading = ref(false);
const summaryData = ref(null);
const showSummaryDisplay = ref(false);

// Check auth with popup - updated to not use router directly
const checkAuth = () => {
  const authStore = userAuth();
  
  if (!authStore.isLoggedIn) {
    Swal.fire({
      title: 'Authentication Required',
      text: 'You need to login or sign up to generate summaries',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Sign Up'
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose to login - use window.location instead of router
        window.location.href = '/auth';
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to sign up
        window.location.href = '/auth/sign-up';
      }
    });
    return false;
  }
  return true;
};

/**
 * Process text content directly via API
 * @param {string} content - The text content to process
 * @param {boolean} isLink - Whether the content is a URL/link
 * @returns {Promise<Object>} - Result of text processing
 */
async function processTextContent(content: string, isLink = false): Promise<any> {
  const authStore = userAuth();
  const config = useRuntimeConfig();
  
  // The USER_PRIVATE_API already ends with "auth/", so no need to add it again
  const endpoint = isLink 
    ? `process-url` 
    : `process-text`;
  
  const url = `${config.public.USER_PRIVATE_API}${endpoint}`;
  
  console.log(`Text Processing - Starting ${isLink ? 'URL' : 'text'} processing with URL: ${url}`);
  
  let token = authStore.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    // Use the correct parameter name according to API documentation ('text' instead of 'content')
    const payload = isLink ? { url: content } : { text: content };
    
    console.log(`Text Processing - Request to ${url} with payload:`, payload);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    console.log('Text Processing - Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Authentication expired');
      }
      
      // Better error handling for non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Text Processing - Error response:', errorData);
        throw new Error(errorData.message || `Failed to process ${isLink ? 'URL' : 'text'}`);
      } else {
        // For non-JSON responses (like HTML error pages)
        const errorText = await response.text();
        console.error('Text Processing - Non-JSON error response:', errorText.substring(0, 200) + '...');
        throw new Error(`Server returned non-JSON response (${response.status})`);
      }
    }

    // Handle potential HTML responses instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Text Processing - Received non-JSON response:', textResponse.substring(0, 200) + '...');
      throw new Error('Server returned invalid content type. Expected JSON.');
    }

    const responseData = await response.json();
    console.log('Text Processing - Response data:', JSON.stringify(responseData, null, 2));

    // After processing text, we need to use the ID to create a summary
    if (responseData.status === 'success') {
      // The API returns _id in the data object according to the documentation
      const fileId = responseData.data?.id || responseData.data?._id;
      
      if (!fileId) {
        console.error('Text Processing - No file ID found in response:', responseData);
        throw new Error('Missing file ID in server response');
      }
      
      console.log(`Text Processing - Got file ID: ${fileId}, generating summary...`);
      return await generateSummaryFromFile(fileId);
    }
    
    return responseData;

  } catch (error) {
    console.error('Text processing error:', error);
    throw error;
  }
}

/**
 * Generate a summary based on the uploaded file
 * @param {Object} params - Parameters for generating the summary
 * @param {Blob} [params.documentBlob] - Document file blob
 * @param {File} [params.imageFile] - Image file
 * @param {File} [params.videoFile] - Video file
 * @param {String} [params.textContent] - Text content or URL
 * @param {Boolean} [params.isLink] - Whether the text content is a URL
 * @returns {Promise<Object>} - Result of the summary generation
 */
export const generateSummary = async ({
  documentBlob = null,
  imageFile = null,
  videoFile = null,
  textContent = null,
  isLink = false
}) => {
  const authStore = userAuth();
  const summaryStore = useSummaryStore();

  if (!checkAuth()) return { success: false, reason: 'auth' };

  try {
    isLoading.value = true;

    // Get fresh token before API request
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      throw new Error('Authentication expired');
    }

    // Process different types of content
    let summaryResponse = null;
    
    if (documentBlob) {
      // Process the document to get fileId
      const ocrResponse = await processFile(documentBlob);
      console.log('OCR Document Response:', ocrResponse);
      if (ocrResponse.status === 'success') {
        const fileId = ocrResponse.data._id;
        console.log('File ID for summary generation:', fileId);
        summaryResponse = await generateSummaryFromFile(fileId);
      } else {
        throw new Error(ocrResponse.message || 'Failed to process file');
      }
    } else if (imageFile) {
      // Process image file
      const ocrResponse = await processFile(imageFile);
      console.log('Image OCR Response:', ocrResponse);
      if (ocrResponse.status === 'success') {
        const fileId = ocrResponse.data._id;
        summaryResponse = await generateSummaryFromFile(fileId);
      } else {
        throw new Error(ocrResponse.message || 'Failed to process image');
      }
    } else if (videoFile) {
      // Process video file
      const ocrResponse = await processFile(videoFile);
      if (ocrResponse.status === 'success') {
        const fileId = ocrResponse.data._id;
        summaryResponse = await generateSummaryFromFile(fileId);
      } else {
        throw new Error(ocrResponse.message || 'Failed to process video');
      }
    } else if (textContent) {
      // Handle text content or URL directly through separate API endpoint
      summaryResponse = await processTextContent(textContent, isLink);
    } else {
      throw new Error('No content provided for summary generation');
    }
    
    // Process the summary response
    if (summaryResponse && summaryResponse.status === 'success') {
      // Store the summary data and show the summary display
      summaryData.value = summaryResponse.data;
      console.log('Summary Data to display:', JSON.stringify(summaryData.value, null, 2));
      showSummaryDisplay.value = true;
      
      // Mark the store for refresh to ensure the library shows the new summary
      summaryStore.markForRefresh();
      
      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Summary generated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
      return { success: true, data: summaryData.value };
    } else {
      throw new Error(summaryResponse?.message || 'Failed to generate summary');
    }

  } catch (error: unknown) {
    console.error('Error generating summary:', error);
    
    // Type guard to check if error is an Error object with message property
    if (error instanceof Error) {
      if (error.message?.includes('Authentication')) {
        authStore.logout();
        // Use window.location instead of router
        window.location.href = '/auth';
        return { success: false, reason: 'auth' };
      }

      Swal.fire({
        icon: 'error', 
        title: 'Error',
        text: error.message || 'Failed to generate summary'
      });
      
      return { success: false, error: error.message };
    } else {
      // Handle non-Error objects
      Swal.fire({
        icon: 'error', 
        title: 'Error',
        text: 'An unknown error occurred'
      });
      
      return { success: false, error: 'Unknown error' };
    }
  } finally {
    isLoading.value = false;
  }
};

// Reset summary state
export const resetSummary = () => {
  showSummaryDisplay.value = false;
  summaryData.value = null;
};

// Summary state getters
export const useSummaryState = () => {
  return {
    isLoading,
    summaryData,
    showSummaryDisplay
  };
};
