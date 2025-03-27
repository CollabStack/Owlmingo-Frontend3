<template>
  <v-container class="mb-16">
    <!-- Header Section with Animation -->
    <v-row align="center" justify="space-between" class="my-6" v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold outfit mb-2">Quiz Results</h1>
        <p class="text-body-1 text-grey-darken-2">Review your answers and see how you performed</p>
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-sm-end">
        <v-btn 
          variant="outlined" 
          color="grey-darken-1" 
          prepend-icon="mdi-arrow-left" 
          class="rounded-xl px-6" 
          @click="backQuiz"
        >
          Back to History
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- States Management -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" class="mb-6"></v-progress-circular>
      <h2 class="text-h6 outfit">Loading quiz results...</h2>
    </div>
    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h5 outfit mb-2">{{ error }}</h2>
      <v-btn color="primary" class="mt-6 rounded-xl" @click="fetchQuizData">Try Again</v-btn>
    </div>
    
    <!-- Quiz Results Content -->
    <template v-else>
      <!-- Score Summary Card with Animation -->
      <v-card 
        class="mb-8 rounded-lg score-card" 
        elevation="3" 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
        <v-card-item>
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between">
            <div class="text-center text-sm-start">
              <h2 class="text-h5 outfit mb-2">Your Performance</h2>
              <p class="text-subtitle-1 text-medium-emphasis">
                {{ quizData?.title || 'Quiz Results' }}
              </p>
            </div>
            <div class="score-circle mt-4 mt-sm-0">
              <div class="inner">{{ calculateScorePercentage }}%</div>
            </div>
          </div>
        </v-card-item>
        <v-card-text>
          <v-divider class="my-4"></v-divider>
          <div class="d-flex flex-wrap justify-space-around">
            <div class="stat-item">
              <v-icon color="primary" class="mb-2">mdi-check-circle</v-icon>
              <div class="stat-value">{{ correctAnswers }}</div>
              <div class="stat-label">Correct</div>
            </div>
            <div class="stat-item">
              <v-icon color="error" class="mb-2">mdi-close-circle</v-icon>
              <div class="stat-value">{{ totalQuestions - correctAnswers }}</div>
              <div class="stat-label">Incorrect</div>
            </div>
            <div class="stat-item">
              <v-icon color="info" class="mb-2">mdi-help-circle</v-icon>
              <div class="stat-value">{{ totalQuestions }}</div>
              <div class="stat-label">Total</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Questions List with Animation -->
      <div class="questions-list">
        <v-card 
          v-for="(question, qIndex) in questions" 
          :key="qIndex" 
          class="mb-6 rounded-lg question-card"
          :class="{ 'question-correct': isQuestionCorrect(question), 'question-incorrect': !isQuestionCorrect(question) }" 
          elevation="2"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 * qIndex } }">
          <v-card-title class="question-title pa-4 d-flex align-center">
            <v-avatar
              :color="isQuestionCorrect(question) ? 'success' : 'error'"
              size="36"
              class="mr-3"
            >
              <v-icon color="white">
                {{ isQuestionCorrect(question) ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
            </v-avatar>
            <div>
              <span class="text-subtitle-2 text-grey-darken-1">Question {{ qIndex + 1 }}</span>
              <h3 class="text-h6 outfit mt-1">{{ question.question }}</h3>
            </div>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <div class="options-grid">
              <div
                v-for="(option, index) in question.options"
                :key="index"
                class="option-item pa-3 d-flex align-center"
                :class="getOptionClass(question, option)"
              >
                <div class="option-indicator mr-3">
                  <span>{{ String.fromCharCode(65 + index) }}</span>
                </div>
                <div class="option-text">{{ option.text }}</div>
                <v-spacer></v-spacer>
                <div class="option-status">
                  <v-icon v-if="isSelectedOption(question, option) && option.isCorrect" 
                    color="success" size="small">mdi-check-circle</v-icon>
                  <v-icon v-else-if="isSelectedOption(question, option) && !option.isCorrect" 
                    color="error" size="small">mdi-close-circle</v-icon>
                  <v-icon v-else-if="!isSelectedOption(question, option) && option.isCorrect" 
                    color="success" size="small">mdi-check</v-icon>
                </div>
              </div>
            </div>
            
            <div v-if="question.explanation" class="explanation-container mt-4">
              <v-alert
                color="info"
                variant="tonal"
                border="start"
                density="comfortable"
                class="explanation-text"
              >
                <template v-slot:prepend>
                  <v-avatar color="info" class="explanation-avatar">
                    <v-icon color="white">mdi-information</v-icon>
                  </v-avatar>
                </template>
                <strong class="explanation-title">Explanation</strong>
                <div class="mt-1">{{ question.explanation }}</div>
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </div>
      
      <!-- Action Buttons -->
      <div class="d-flex flex-column flex-sm-row justify-center gap-3 mt-10 action-buttons" v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: questions.length * 100 } }">
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          class="action-btn"
          rounded="xl"
          prepend-icon="mdi-refresh"
          @click="tryAgain"
        >
          Try Again
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="action-btn"
          rounded="xl"
          prepend-icon="mdi-lightning-bolt"
          @click="backToHome"
        >
          New Quiz
        </v-btn>
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

const loading = ref(true);
const error = ref(null);
const quizData = ref(null);
const questions = ref([]);

const getQuizId = () => route.query.id || localStorage.getItem('lastQuizId');

// Enhanced isSelectedOption function with better debugging
const isSelectedOption = (question, option) => {
  // Check if the question already has the selected option information directly attached
  if (question.selectedOptionId) {
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
  
  // Get the selected option ID from store answers
  const selectedOptionId = quizStore.answers[questionIndex];
  
  // Check if this is the selected option
  return selectedOptionId === option.id;
};

// Debug function to help trace answers
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
  if (isSelectedOption(question, option)) return option.isCorrect ? 'correct-answer' : 'wrong-answer';
  if (!isQuestionCorrect(question) && option.isCorrect) return 'correct-answer';
  return 'neutral-answer';
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
</style>
