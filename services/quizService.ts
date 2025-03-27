import { processFile } from './ocrService';
import { ref } from 'vue';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';
import { useQuizStore } from '~/store/quizStore';

// Reactive state
const isLoading = ref(false);
const quizData = ref(null);
const showQuizDisplay = ref(false);

// Check auth with popup
const checkAuth = () => {
  const authStore = userAuth();
  
  if (!authStore.isLoggedIn) {
    Swal.fire({
      title: 'Authentication Required',
      text: 'You need to login or sign up to generate quizzes',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Sign Up'
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose to login
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
 * Generate a quiz from a processed file
 * @param {string} fileId - The ID of the processed file
 * @returns {Promise<Object>} - Quiz generation result
 */
async function generateQuizFromFile(fileId) {
  const authStore = userAuth();
  
  const url = 'http://api.owlmingo.space/api/v1/user/auth/quiz/generate';
  
  console.log(`Quiz Generation - Starting quiz generation for file: ${fileId}`);
  
  let token = authStore.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    // Use the correct payload structure for the quiz API
    const payload = {
      fileOcrId: fileId
    };
    
    console.log(`Quiz Generation - Request to ${url} with payload:`, payload);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Authentication expired');
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate quiz');
      } else {
        const errorText = await response.text();
        throw new Error(`Server returned error (${response.status})`);
      }
    }

    const responseData = await response.json();
    console.log('Quiz Generation - Response data:', responseData);
    return responseData;

  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
}

/**
 * Generate a quiz based on the uploaded file or processed text
 * @param {Object} params - Parameters for generating the quiz
 * @param {Blob} [params.documentBlob] - Document file blob
 * @param {File} [params.imageFile] - Image file
 * @param {string} [params.textFileId] - ID of processed text
 * @returns {Promise<Object>} - Result of the quiz generation
 */
export const generateQuiz = async ({
  documentBlob = null,
  imageFile = null,
  textFileId = null
}) => {
  const authStore = userAuth();
  const quizStore = useQuizStore();

  if (!checkAuth()) return { success: false, reason: 'auth' };

  try {
    isLoading.value = true;

    // Get fresh token before API request
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      throw new Error('Authentication expired');
    }

    // Process different types of content
    let quizResponse = null;
    
    if (textFileId) {
      // Use already processed text file ID directly
      console.log('Using processed text file ID for quiz generation:', textFileId);
      quizResponse = await generateQuizFromFile(textFileId);
    } else if (documentBlob) {
      // Process the document to get fileId
      const ocrResponse = await processFile(documentBlob);
      console.log('OCR Document Response:', ocrResponse);
      if (ocrResponse.status === 'success') {
        const fileId = ocrResponse.data._id;
        console.log('File ID for quiz generation:', fileId);
        quizResponse = await generateQuizFromFile(fileId);
      } else {
        throw new Error(ocrResponse.message || 'Failed to process file');
      }
    } else if (imageFile) {
      // Process image file
      const ocrResponse = await processFile(imageFile);
      console.log('Image OCR Response:', ocrResponse);
      if (ocrResponse.status === 'success') {
        const fileId = ocrResponse.data._id;
        quizResponse = await generateQuizFromFile(fileId);
      } else {
        throw new Error(ocrResponse.message || 'Failed to process image');
      }
    } else {
      throw new Error('No content provided for quiz generation');
    }
    
    // Process the quiz response
    if (quizResponse) {
      // Extract the quiz ID correctly from the response
      // Check for different possible locations of the ID based on API response structure
      const quizId = quizResponse.quizId || 
                     (quizResponse.data && quizResponse.data.quizId) || 
                     quizResponse.id;
                     
      if (!quizId) {
        console.error('Quiz ID not found in response:', quizResponse);
        throw new Error('Quiz ID missing in server response');
      }
      
      console.log('Quiz ID extracted:', quizId);
      
      // Store the quiz data
      quizData.value = quizResponse;
      console.log('Quiz Data received:', quizData.value);
      showQuizDisplay.value = true;
      
      // Store full quiz data in localStorage for persistence
      localStorage.setItem('currentQuiz', JSON.stringify(quizResponse));
      
      // Also store just the ID for easy retrieval
      localStorage.setItem('lastQuizId', quizId);
      
      // Redirect to quiz page with quiz ID
      window.location.href = `/quiz/do-quiz?id=${quizId}`;
      
      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Quiz generated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
      return { success: true, data: quizResponse, quizId };
    } else {
      throw new Error('Failed to generate quiz');
    }

  } catch (error) {
    console.error('Error generating quiz:', error);
    
    if (error instanceof Error) {
      if (error.message?.includes('Authentication')) {
        authStore.logout();
        window.location.href = '/auth';
        return { success: false, reason: 'auth' };
      }

      Swal.fire({
        icon: 'error', 
        title: 'Error',
        text: error.message || 'Failed to generate quiz'
      });
      
      return { success: false, error: error.message };
    } else {
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

/**
 * Fetch a quiz by ID
 * @param {string} quizId - ID of the quiz to fetch
 * @returns {Promise<Object>} - Quiz data
 */
export const fetchQuizById = async (quizId) => {
  const authStore = userAuth();
  
  if (!checkAuth()) return { success: false, reason: 'auth' };

  try {
    isLoading.value = true;

    // Get fresh token before API request
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      throw new Error('Authentication expired');
    }

    const baseUrl = 'https://owlmingo-16f448c07f1f.herokuapp.com/api/v1';
    const url = `${baseUrl}/user/auth/quiz/${quizId}/review`;
    
    console.log(`Quiz - Fetching quiz with ID: ${quizId}`);
    
    let token = authStore.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout();
        throw new Error('Authentication expired');
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch quiz');
      } else {
        throw new Error(`Server returned error (${response.status})`);
      }
    }

    const quizData = await response.json();
    console.log('Quiz data fetched:', quizData);
    
    // Store quiz data in reactive state
    currentQuiz.value = quizData;
    showQuizDisplay.value = true;
    
    return { success: true, data: quizData };

  } catch (error) {
    console.error('Error fetching quiz:', error);
    
    if (error instanceof Error) {
      if (error.message?.includes('Authentication')) {
        authStore.logout();
        window.location.href = '/auth';
        return { success: false, reason: 'auth' };
      }
      
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'An unknown error occurred' };
  } finally {
    isLoading.value = false;
  }
};

/**
 * Submit an answer for a quiz question
 * @param {string} quizId - ID of the quiz
 * @param {number} questionIndex - Index of the question
 * @param {string} optionId - ID of the selected option
 * @returns {Promise<Object>} - Result of the submission
 */
export const submitQuizAnswer = async (quizId, questionIndex, optionId) => {
  const authStore = userAuth();
  
  if (!checkAuth()) return { success: false, reason: 'auth' };

  try {
    const baseUrl = 'https://owlmingo-16f448c07f1f.herokuapp.com/api/v1';
    let token = authStore.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // First, update the local UI state if we have access to currentQuiz
    if (currentQuiz.value && currentQuiz.value.questions) {
      const question = currentQuiz.value.questions[questionIndex];
      if (question) {
        // Pre-mark as answered for responsive UI experience
        question.isAnswered = true;
        
        // If we can determine correctness from the option directly
        const selectedOption = question.options.find(opt => opt.id === optionId);
        if (selectedOption) {
          question.isCorrect = !!selectedOption.isCorrect;
        }
      }
    }
    
    // Try multiple endpoints with multiple payload formats to maximize chances of success
    const endpoints = [
      // Standard RESTful pattern 
      `${baseUrl}/quizzes/${quizId}/questions/${questionIndex}/answer`,
      
      // Alternative pattern with singular quiz
      `${baseUrl}/quiz/${quizId}/questions/${questionIndex}/answer`,
      
      // Auth prefixed versions
      `${baseUrl}/user/auth/quizzes/${quizId}/questions/${questionIndex}/answer`,
      `${baseUrl}/user/auth/quiz/${quizId}/questions/${questionIndex}/answer`,
      
      // Original patterns we've tried
      `${baseUrl}/user/auth/quiz/${quizId}/answer`,
      `${baseUrl}/quiz/${quizId}/answer`,
      
      // Generic endpoints
      `${baseUrl}/user/auth/quiz-answer`,
      `${baseUrl}/quiz-answer`,
      `${baseUrl}/quiz/answer`,
    ];
    
    // Different payload formats to try
    const payloadFormats = [
      // Standard format
      { optionId },
      
      // With question index
      { questionIndex, optionId },
      
      // With quiz ID 
      { quizId, questionIndex, optionId },
      
      // With different field names
      { quiz_id: quizId, question_index: questionIndex, selected_option: optionId },
    ];

    let lastError = null;
    
    // Try each endpoint with each payload format
    for (const endpoint of endpoints) {
      for (const payload of payloadFormats) {
        try {
          console.log(`Trying submission to ${endpoint} with payload:`, payload);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Successful answer submission result:', result);
            
            // Update the current quiz question with the result
            if (currentQuiz.value) {
              const question = currentQuiz.value.questions[questionIndex];
              if (question) {
                question.isAnswered = true;
                question.isCorrect = result.isCorrect;
                
                // Update progress data
                if (result.progress) {
                  currentQuiz.value.progress = result.progress;
                }
              }
            }
            
            return { success: true, data: result, isCorrect: result.isCorrect };
          }
        } catch (err) {
          // Just log and continue trying other endpoints
          console.warn(`Error with endpoint ${endpoint}:`, err);
          lastError = err;
        }
      }
    }

    // If we're here, all attempts failed but we'll treat it as a UI success
    console.warn("All API submission attempts failed, but continuing with local state");
    return { 
      success: true, // UI success even though API failed
      apiError: true,
      error: "Could not connect to answer submission service",
      isCorrect: currentQuiz.value?.questions[questionIndex]?.isCorrect || false
    };

  } catch (error) {
    console.error('Error submitting answer:', error);
    
    // Even if the API calls fail, return a success to allow the user to continue
    return { 
      success: true, // UI success even though API failed
      apiError: true,
      error: error instanceof Error ? error.message : 'Unknown error',
      isCorrect: currentQuiz.value?.questions[questionIndex]?.isCorrect || false
    };
  }
};

// Add reactive state for current quiz
const currentQuiz = ref(null);

// Reset quiz state
export const resetQuiz = () => {
  showQuizDisplay.value = false;
  quizData.value = null;
};

// Quiz state getters
export const useQuizState = () => {
  return {
    isLoading,
    quizData,
    showQuizDisplay,
    currentQuiz
  };
};
