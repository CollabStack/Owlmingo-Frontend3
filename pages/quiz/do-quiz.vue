<template>
  <v-container>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-h6 mt-6">Loading your quiz...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mt-4">{{ error }}</h2>
      <v-btn color="primary" class="mt-6" @click="fetchQuizData">Try Again</v-btn>
    </div>
    
    <!-- Quiz Display -->
    <div v-else-if="quizData && quizData.questions">
      <DoQuizForm 
        :quiz="quizData" 
        @restart="restartQuiz"
        @view-results="viewResults"
        @submit-answer="handleAnswerSubmission"
      />
    </div>
    
    <!-- No Quiz Data Available -->
    <div v-else class="text-center py-16">
      <v-icon color="info" size="64">mdi-help-circle</v-icon>
      <h2 class="text-h5 mt-4">No Quiz Found</h2>
      <p class="text-body-1 mt-2">Return to the quiz generator to create a new quiz</p>
      <v-btn color="primary" class="mt-6" to="/quiz">Go to Quiz Generator</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchQuizById, submitQuizAnswer } from '~/services/quizService';
import { useQuizStore } from '~/store/quizStore';
import DoQuizForm from '@/components/quiz/DoQuizForm.vue';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const quizData = ref(null);
const loading = ref(true);
const error = ref(null);

// Get quiz ID from URL or localStorage
const getQuizId = () => {
  // Try to get ID from URL query parameter first
  const idFromUrl = route.query.id;
  if (idFromUrl) {
    return idFromUrl;
  }
  
  // Fall back to localStorage if no ID in URL
  return localStorage.getItem('lastQuizId');
};

// Fetch quiz data using the ID
const fetchQuizData = async () => {
  loading.value = true;
  error.value = null;
  
  const quizId = getQuizId();
  
  if (!quizId) {
    error.value = "No quiz ID provided";
    loading.value = false;
    return;
  }
  
  try {
    // Try using the store first
    const result = await quizStore.fetchQuiz(quizId);
    
    if (result.success) {
      quizData.value = result.data;
    } else if (result.authenticated === false) {
      // Redirect to login if not authenticated
      router.push('/auth');
    } else {
      // If store fetch fails, try the service directly
      const serviceResult = await fetchQuizById(quizId);
      
      if (serviceResult.success) {
        quizData.value = serviceResult.data;
      } else {
        throw new Error(serviceResult.error || 'Failed to fetch quiz');
      }
    }
  } catch (err) {
    console.error('Failed to fetch quiz:', err);
    error.value = err.message || 'Failed to load quiz data';
  } finally {
    loading.value = false;
  }
};

// Handle submitting an answer to a question
const handleAnswerSubmission = async (questionIndex, optionId) => {
  const quizId = getQuizId();
  
  if (!quizId) {
    console.error('No quiz ID available for answer submission');
    showError('Quiz ID not found. Please try reloading the page.');
    return { success: false, error: 'Quiz ID not found' };
  }
  
  try {
    console.log(`Submitting answer for quiz ${quizId}, question ${questionIndex}, option ${optionId}`);
    
    // Update the UI immediately to show user selection
    updateQuestionLocally(questionIndex, optionId);
    
    // First try using the store method
    try {
      const storeResult = await quizStore.submitAnswer(optionId);
      
      if (storeResult.success) {
        console.log('Store submission result:', storeResult);
        
        // Only show error if there was an API error but the UI succeeded
        if (storeResult.apiError) {
          console.warn('API call failed but UI updated successfully');
          // Optional: show a non-blocking warning
          showWarning('Your answer was recorded locally. Syncing with server failed.');
        }
        
        return storeResult;
      }
    } catch (storeError) {
      console.warn('Store method failed, will try service method', storeError);
    }
    
    // If store fails, try the service method
    try {
      const serviceResult = await submitQuizAnswer(quizId, questionIndex, optionId);
      
      if (serviceResult.success) {
        console.log('Service submission result:', serviceResult);
        
        // Only show error if there was an API error but the UI succeeded
        if (serviceResult.apiError) {
          console.warn('API call failed but UI updated successfully');
          // Optional: show a non-blocking warning
          showWarning('Your answer was recorded locally. Syncing with server failed.');
        }
        
        return serviceResult;
      }
    } catch (serviceError) {
      console.warn('Service method failed', serviceError);
    }
    
    // If we reach here, both methods technically failed but UI is updated
    console.warn('All submission methods had API failures, but UI is updated');
    return { 
      success: true, // Let the UI continue
      apiError: true,
      error: 'Could not sync with server but your answer was recorded'
    };
    
  } catch (err) {
    console.error('Error in answer submission:', err);
    
    // Even if everything fails, we've already updated the UI
    return { 
      success: true, // Let the UI continue 
      apiError: true,
      error: err.message || 'Unknown error' 
    };
  }
};

// Update question status locally when needed
const updateQuestionLocally = (questionIndex, optionId) => {
  if (!quizData.value || !quizData.value.questions) return;
  
  const question = quizData.value.questions[questionIndex];
  if (question) {
    question.isAnswered = true;
    
    // Try to determine if answer is correct based on option metadata
    const selectedOption = question.options.find(opt => opt.id === optionId);
    if (selectedOption) {
      question.isCorrect = selectedOption.isCorrect === true;
    }
  }
};

// Improved error display function
const showError = (message) => {
  console.error(message);
  error.value = message;
  
  // Optional: Show a temporary toast notification
  setTimeout(() => {
    error.value = null;
  }, 5000);
};

// Non-blocking warning display
const showWarning = (message) => {
  console.warn(message);
  // Could use a toast notification library here
};

// Restart the current quiz
const restartQuiz = () => {
  quizStore.resetQuiz();
  fetchQuizData();
};

// View quiz results
const viewResults = () => {
  const quizId = getQuizId();
  router.push(`/quiz/results-quiz?id=${quizId}`);
};

// Fetch quiz data on mount
onMounted(() => {
  fetchQuizData();
});
</script>
