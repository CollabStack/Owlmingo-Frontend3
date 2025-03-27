<template>
  <v-container class="py-8">
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-h6 mt-6 outfit outfit-medium">Loading your results...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mt-4 outfit outfit-medium">{{ error }}</h2>
      <v-btn color="primary" class="mt-6 rounded-xl" @click="fetchQuizData">Try Again</v-btn>
    </div>

    <template v-else>
      <v-card class="mb-6 rounded-xl pa-6" elevation="1">
        <div class="d-flex flex-column flex-md-row align-md-center justify-space-between">
          <div>
            <h1 class="text-h4 outfit outfit-bold text-primary mb-2">Quiz Results</h1>
            <p class="text-subtitle-1 outfit outfit-regular text-grey-darken-1 mb-2">
              You've completed the quiz. Here's how you did:
            </p>
          </div>
          <div class="score-summary text-center mt-4 mt-md-0 rounded-xl pa-4">
            <span class="text-h6 outfit outfit-medium">Your Score</span>
            <div class="text-h3 outfit outfit-bold" 
                :class="calculateScorePercentage >= 70 ? 'text-success' : calculateScorePercentage >= 40 ? 'text-warning' : 'text-error'">
              {{ calculateScorePercentage }}%
            </div>
            <p class="text-body-1 outfit outfit-regular">
              {{ correctAnswers }} correct out of {{ totalQuestions }} questions
            </p>
          </div>
        </div>
        <div class="d-flex flex-wrap justify-end mt-4">
          <v-btn class="mx-2 mb-2 rounded-xl outfit outfit-medium animated-btn" variant="outlined" color="grey-darken-1" prepend-icon="mdi-arrow-left" @click="backQuiz">
            Back to History
          </v-btn>
          <v-btn class="mx-2 mb-2 rounded-xl outfit outfit-medium animated-btn" variant="outlined" color="primary" prepend-icon="mdi-refresh" @click="tryAgain">
            Try Again
          </v-btn>
          <v-btn class="mx-2 mb-2 rounded-xl outfit outfit-medium animated-btn" variant="flat" color="primary" prepend-icon="mdi-plus" @click="backToHome">
            New Quiz
          </v-btn>
        </div>
      </v-card>

      <h2 class="text-h5 outfit outfit-semibold mb-4 ml-2">Question Review</h2>
      <div>
        <v-card v-for="(question, qIndex) in questions" :key="qIndex" class="mb-6 rounded-xl question-card" :class="isQuestionCorrect(question) ? 'question-correct' : 'question-incorrect'" elevation="1">
          <v-card-item class="question-header pa-4">
            <div class="d-flex align-center">
              <div class="question-indicator mr-4" :class="isQuestionCorrect(question) ? 'bg-success' : 'bg-error'">
                <v-icon color="white" size="24">
                  {{ isQuestionCorrect(question) ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </div>
              <div>
                <div class="text-overline text-grey-darken-1">Question {{ qIndex + 1 }} of {{ totalQuestions }}</div>
                <div class="text-h6 outfit outfit-medium">{{ question.question }}</div>
              </div>
            </div>
          </v-card-item>
          <v-divider></v-divider>
          
          <!-- Add user selection summary -->
          <div class="px-4 pt-3 pb-1 selection-summary" :class="isQuestionCorrect(question) ? 'bg-success-light' : 'bg-error-light'">
            <div class="d-flex align-center">
              <v-icon :color="isQuestionCorrect(question) ? 'success' : 'error'" class="mr-2">
                {{ isQuestionCorrect(question) ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
              <span class="text-subtitle-2 outfit outfit-medium">
                {{ isQuestionCorrect(question) ? 'You answered correctly!' : 'Your answer was incorrect.' }}
              </span>
            </div>
          </div>
          
          <v-card-text class="pa-4">
            <div v-for="(option, index) in question.options" :key="index" class="option-item mb-3 pa-3 rounded-lg d-flex align-center" :class="getOptionClass(question, option)">
              <div class="option-letter mr-3" :class="{'selected-letter': isSelectedOption(question, option)}">
                {{ String.fromCharCode(65 + index) }}
              </div>
              <div class="flex-grow-1">{{ option.text }}</div>
              <div class="ml-2 d-flex align-center">
                <v-icon v-if="isSelectedOption(question, option) && option.isCorrect" color="success" class="mr-2">mdi-check-circle</v-icon>
                <v-icon v-else-if="isSelectedOption(question, option) && !option.isCorrect" color="error" class="mr-2">mdi-close-circle</v-icon>
                <v-icon v-else-if="!isSelectedOption(question, option) && option.isCorrect" color="success" class="mr-2">mdi-check</v-icon>
                
                <div v-if="isSelectedOption(question, option)" class="selected-badge">
                  Your answer
                </div>
                <div v-else-if="option.isCorrect" class="correct-badge">
                  Correct answer
                </div>
              </div>
            </div>
            
            <div v-if="question.explanation" class="explanation-text mt-4 pa-4 rounded-lg">
              <div class="text-subtitle-2 outfit outfit-semibold mb-1">Explanation:</div>
              <div class="text-body-2">{{ question.explanation }}</div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchQuizById } from '~/services/quizService';
import { useQuizStore } from '~/store/quizStore';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();

const isHovered = ref(false);
const loading = ref(true);
const error = ref(null);
const quizData = ref(null);
const questions = ref([]);

const getQuizId = () => route.query.id || localStorage.getItem('lastQuizId');

// Enhanced isSelectedOption function with better debugging
const isSelectedOption = (question, option) => {
  // Check if the question already has the selected option information directly attached
  if (question.selectedOptionId) {
    console.log(`Question ${question.question} has stored selectedOptionId: ${question.selectedOptionId}`);
    return question.selectedOptionId === option.id;
  }

  // Try to find the question index in different ways
  let questionIndex = -1;
  
  // First try by id
  if (question.id) {
    questionIndex = questions.value.findIndex(q => q.id === question.id);
  }
  
  // If not found by id, try by question text
  if (questionIndex === -1) {
    questionIndex = questions.value.findIndex(q => q.question === question.question);
  }
  
  // Last resort - direct array position
  if (questionIndex === -1) {
    questionIndex = questions.value.indexOf(question);
  }
  
  console.log(`Question index for "${question.question.substring(0, 20)}...": ${questionIndex}`);
  
  // Get the selected option ID from store answers
  const selectedOptionId = quizStore.answers[questionIndex];
  console.log(`Selected option ID for question index ${questionIndex}: ${selectedOptionId}`);
  
  // Check if this is the selected option
  return selectedOptionId === option.id;
};

// Add this function to help debug
const logAnswers = () => {
  console.log('Quiz store answers:', quizStore.answers);
  console.log('Questions with answers:', questions.value.map((q, i) => ({
    question: q.question.substring(0, 30),
    selectedAnswer: quizStore.answers[i],
    hasSelectedOptionId: !!q.selectedOptionId
  })));
};

// Update fetchQuizData to properly restore quiz answers
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
    // First try to get quiz from current quiz store state
    if (quizStore.currentQuiz?.quizId === quizId) {
      quizData.value = quizStore.currentQuiz;
    } else {
      // Check if this quiz exists in history
      const historyQuiz = quizStore.quizzes.find(q => q.quizId === quizId);
      
      if (historyQuiz && historyQuiz.questions) {
        console.log('Found quiz in history with questions:', historyQuiz.questions.length);
        
        // Deeply clone the quiz to avoid reference issues
        quizData.value = JSON.parse(JSON.stringify(historyQuiz));
        
        // Important: Reset answers in store before restoring them
        quizStore.answers = {};
        
        // Restore answers from history, if available
        if (historyQuiz.answers) {
          console.log('Restoring answers from history:', historyQuiz.answers);
          quizStore.answers = JSON.parse(JSON.stringify(historyQuiz.answers));
        } else {
          console.log('No answers found in history, trying to extract from questions');
          // Try to extract answers from questions with selectedOptionId
          historyQuiz.questions.forEach((question, index) => {
            if (question.selectedOptionId) {
              quizStore.answers[index] = question.selectedOptionId;
            }
          });
        }
        
        console.log('Restored answers:', quizStore.answers);
      } else {
        // Try local storage cache
        const cachedQuiz = JSON.parse(localStorage.getItem('currentQuiz') || '{}');
        if (cachedQuiz.quizId === quizId) quizData.value = cachedQuiz;

        // If still no data, fetch from API
        if (!quizData.value) {
          const result = await fetchQuizById(quizId);
          if (result.success) quizData.value = result.data;
          else throw new Error(result.error || 'Failed to fetch quiz');
        }
      }
    }

    // Update store with current quiz data if needed
    if (quizData.value && (!quizStore.currentQuiz || quizStore.currentQuiz.quizId !== quizId)) {
      quizStore.currentQuiz = quizData.value;
    }
    
    questions.value = quizData.value?.questions || [];
    
    // Calculate score for the quiz if not already present
    if (quizData.value && (!quizData.value.progress || !quizData.value.progress.correctAnswers)) {
      const correctCount = questions.value.filter(q => q.isCorrect).length;
      if (!quizData.value.progress) {
        quizData.value.progress = {};
      }
      quizData.value.progress.correctAnswers = correctCount;
      quizData.value.progress.totalQuestions = questions.value.length;
      quizData.value.progress.score = questions.value.length > 0 
        ? Math.round((correctCount / questions.value.length) * 100)
        : 0;
    }
    
    // Save to history since we're on the results page
    quizStore.saveToHistory();
    
    // Call debug function after data is loaded
    setTimeout(logAnswers, 500);
    
  } catch (err) {
    error.value = err.message || 'Failed to load quiz data';
    console.error('Error fetching quiz data:', err);
  } finally {
    loading.value = false;
  }
};

const totalQuestions = computed(() => questions.value.length);
const correctAnswers = computed(() => questions.value.filter(q => q.isCorrect).length);
const calculateScorePercentage = computed(() => totalQuestions.value ? Math.round((correctAnswers.value / totalQuestions.value) * 100) : 0);

const isQuestionCorrect = (question) => question.isCorrect;

const getOptionClass = (question, option) => {
  // User selected this option
  if (isSelectedOption(question, option)) {
    return option.isCorrect ? 'option-correct' : 'option-incorrect';
  }
  
  // User didn't select this option, but it's the correct answer
  if (option.isCorrect) {
    return 'option-correct-unselected';
  }
  
  // This is just a wrong option, not selected by user
  return 'option-neutral';
};

const backQuiz = () => router.push('/quiz/history-quiz');
const tryAgain = () => router.push(`/quiz/do-quiz?id=${getQuizId()}`);
const backToHome = () => router.push('/quiz');

onMounted(() => {
  quizStore.loadHistory();
  fetchQuizData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
}

.hovered-btn {
  background-color: #1976d2 !important;
  color: white !important;
}

.v-btn {
  transition: background-color 0.3s ease;
}

.v-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.v-card-title {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.incorrect-title {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
}

.correct-title {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
}

.answer-option {
  border: 2px solid transparent;
  margin: 4px 0;
  border-radius: 5px !important;
  padding: 8px;
}

.wrong-answer {
  border: 2px solid red;
  background-color: #ffebee;
  border-radius: 5px !important;
}

.correct-answer {
  border: 2px solid green;
  background-color: #e8f5e9;
  border-radius: 5px !important;
}

.neutral-answer {
  border: 2px solid #e0e0e0;
  background-color: #f5f5f5;
  border-radius: 5px !important;
}

.option-letter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.explanation-text {
  background-color: #f8f9fa;
  border-left: 4px solid #9D7BFC;
  padding: 12px;
  margin: 8px 16px;
  border-radius: 0 4px 4px 0;
}

.score-summary {
  background-color: #F3F4FF;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-card {
  overflow: hidden;
  transition: all 0.3s ease;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.question-header {
  background-color: rgba(0, 0, 0, 0.02);
}

.question-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-success {
  background-color: #4CAF50;
}

.bg-error {
  background-color: #F44336;
}

.option-item {
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.option-letter {
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.option-correct {
  border: 2px solid #4CAF50;
  background-color: rgba(76, 175, 80, 0.15);
  position: relative;
}

.option-incorrect {
  border: 2px solid #F44336;
  background-color: rgba(244, 67, 54, 0.15);
  position: relative;
}

.option-correct-unselected {
  border: 2px solid #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.option-neutral {
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
}

/* Styling for selected answer indicators */
.selected-letter {
  background-color: #9D7BFC;
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.selected-badge {
  background-color: #9D7BFC;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Make sure all answer options have hover effect */
.option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.explanation-text {
  background-color: #f8f9fa;
  border-left: 4px solid #9D7BFC;
}

.animated-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Selection summary styling */
.selection-summary {
  border-radius: 0;
}

.bg-success-light {
  background-color: rgba(76, 175, 80, 0.08);
}

.bg-error-light {
  background-color: rgba(244, 67, 54, 0.08);
}

/* Enhanced badges for selected and correct answers */
.selected-badge {
  background-color: #9D7BFC;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.correct-badge {
  background-color: #4CAF50;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  opacity: 0.7;
}

/* Even stronger highlighting for selected options */
.option-correct::before,
.option-incorrect::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #9D7BFC;
  border-radius: 4px;
}
</style>
