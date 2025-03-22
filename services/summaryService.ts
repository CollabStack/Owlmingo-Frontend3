import { processFile, generateSummaryFromFile } from './ocrService';
import { ref } from 'vue';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

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
 * Generate a summary based on the uploaded file
 * @param {Object} params - Parameters for generating the summary
 * @param {Blob} [params.documentBlob] - Document file blob
 * @param {File} [params.imageFile] - Image file
 * @param {File} [params.videoFile] - Video file
 * @param {String} [params.textContent] - Text content
 * @returns {Promise<Object>} - Result of the summary generation
 */
export const generateSummary = async ({
  documentBlob = null,
  imageFile = null,
  videoFile = null,
  textContent = null
}) => {
  const authStore = userAuth();

  if (!checkAuth()) return { success: false, reason: 'auth' };

  try {
    isLoading.value = true;

    // Get fresh token before API request
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      throw new Error('Authentication expired');
    }

    // Process different types of content
    let fileId = null;
    
    if (documentBlob) {
      // Process the document to get fileId
      const ocrResponse = await processFile(documentBlob);
      console.log('OCR Document Response:', ocrResponse);
      if (ocrResponse.status === 'success') {
        fileId = ocrResponse.data._id;
        console.log('File ID for summary generation:', fileId);
      } else {
        throw new Error(ocrResponse.message || 'Failed to process file');
      }
    } else if (imageFile) {
      // Process image file
      const ocrResponse = await processFile(imageFile);
      console.log('Image OCR Response:', ocrResponse);
      if (ocrResponse.status === 'success') {
        fileId = ocrResponse.data._id;
      } else {
        throw new Error(ocrResponse.message || 'Failed to process image');
      }
    } else if (videoFile) {
      // Process video file
      const ocrResponse = await processFile(videoFile);
      if (ocrResponse.status === 'success') {
        fileId = ocrResponse.data._id;
      } else {
        throw new Error(ocrResponse.message || 'Failed to process video');
      }
    } else if (textContent) {
      // Handle text content
      // TODO: Implement text processing API call
      // For now, we'll just throw an error
      throw new Error('Text summarization not yet implemented');
    } else {
      throw new Error('No content provided for summary generation');
    }
    
    // If we have a fileId, generate the summary
    if (fileId) {
      const summaryResponse = await generateSummaryFromFile(fileId);
      
      console.log('Raw Summary Response:', summaryResponse);
      
      if (summaryResponse.status === 'success') {
        // Store the summary data and show the summary display
        summaryData.value = summaryResponse.data;
        console.log('Summary Data to display:', JSON.stringify(summaryData.value, null, 2));
        showSummaryDisplay.value = true;
        
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
        throw new Error(summaryResponse.message || 'Failed to generate summary');
      }
    } else {
      throw new Error('Failed to obtain file ID for summary generation');
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
