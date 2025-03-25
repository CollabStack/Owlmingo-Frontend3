<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-5 rounded-lg" style="max-width: 900px; width: 100%;">
      <v-card-title class="text-h6 d-flex justify-space-between align-center w-100 outfit">
        Quiz Results
        <v-btn class="ml-auto text-blue rounded-xl" @click="backQuiz" variant="outlined"
          :class="{'hovered-btn': isHovered}" 
          @mouseenter="isHovered = true" 
          @mouseleave="isHovered = false"
        >
          Close
        </v-btn>
      </v-card-title>

      <div v-if="loading" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="text-h6 mt-6">Loading results...</p>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <v-icon color="error" size="64">mdi-alert-circle</v-icon>
        <h2 class="text-h5 mt-4">{{ error }}</h2>
        <v-btn color="primary" class="mt-6" @click="fetchQuizData">Try Again</v-btn>
      </div>

      <template v-else>
        <v-card-subtitle class="text-body-1">
          Score: {{ correctAnswers }} / {{ totalQuestions }} ({{ calculateScorePercentage }}%)
        </v-card-subtitle>

        <v-divider class="mb-4 mt-4"></v-divider>

        <v-row>
          <v-col cols="12">
            <v-card outlined v-for="(question, qIndex) in questions" :key="qIndex" class="mb-4">
              <v-card-title
                :class="{ 'incorrect-title': !isQuestionCorrect(question), 'correct-title': isQuestionCorrect(question) }"
              >
                <v-icon v-if="!isQuestionCorrect(question)" color="red" class="mr-2">
                  mdi-alert-circle
                </v-icon>
                <v-icon v-else color="green">mdi-check-circle</v-icon>
                <span class="ml-2">Question {{ qIndex + 1 }}: {{ question.question }} ({{ isQuestionCorrect(question) ? 'Correct' : 'Incorrect' }})</span>
              </v-card-title>
              <v-divider></v-divider>

              <v-list>
                <v-list-item
                  v-for="(option, index) in question.options" 
                  :key="index"
                  class="answer-option"
                  :class="getOptionClass(question, option)"
                >
                  <v-list-item-content>
                    <v-list-item-title class="d-flex align-center">
                      <span class="option-letter mr-2">{{ String.fromCharCode(65 + index) }}</span>
                      {{ option.text }}
                      <v-icon v-if="isSelectedOption(question, option) && option.isCorrect" 
                        color="success" class="ml-2">mdi-check-circle</v-icon>
                      <v-icon v-else-if="isSelectedOption(question, option) && !option.isCorrect" 
                        color="error" class="ml-2">mdi-close-circle</v-icon>
                      <v-icon v-else-if="!isSelectedOption(question, option) && option.isCorrect" 
                        color="success" class="ml-2">mdi-check</v-icon>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-card-text v-if="question.explanation" class="pt-2 pb-4 explanation-text">
                <strong>Explanation:</strong> {{ question.explanation }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-center mt-6">
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            rounded="xl"
            class="mx-2"
            @click="tryAgain"
          >
            Try Again
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="xl"
            class="mx-2"
            @click="backToHome"
          >
            New Quiz
          </v-btn>
        </div>
      </template>
    </v-card>
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
