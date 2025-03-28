<template>
  <v-container>
    <!-- Quiz Completed View -->
    <div v-if="isQuizComplete" class="text-center py-8">
      <v-img src="/images/quiz-complete.png" alt="Quiz Complete" max-height="240" class="mb-6" contain></v-img>
      <h2 class="text-h4 font-weight-bold text-primary mb-4">Quiz Complete</h2>
      
      <!-- Score Display -->
      <div class="score-display py-4 px-6 rounded-lg mb-6">
        <h3 class="text-h5 mb-2">Your Score</h3>
        <div class="text-h3 font-weight-bold">
          {{ quiz.progress?.score || calculateScorePercentage }}%
        </div>
        <p class="mt-2">
          You got {{ quiz.progress?.correctAnswers || correctAnswersCount }} out of {{ quiz.progress?.totalQuestions || quiz.questions.length }} questions correct
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="d-flex justify-center mt-6">
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          rounded="xl"
          class="mx-2"
          @click="$emit('restart')"
        >
          Try Again
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          class="mx-2"
          @click="$emit('view-results')"
        >
          View Results
        </v-btn>
      </div>
    </div>

    <!-- Active Quiz View -->
    <div v-else class="quiz-container">
      <!-- Quiz Title -->
      <h1 class="text-h5 font-weight-bold text-center mb-6">{{ quiz.title }}</h1>

      <!-- Progress Bar -->
      <div class="progress-container mb-8">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-body-2">Question {{ activeQuestionIndex + 1 }} of {{ quiz.questions.length }}</span>
          <span class="text-body-2">{{ calculateProgress }}% Complete</span>
        </div>
        <v-progress-linear
          :model-value="(activeQuestionIndex / quiz.questions.length) * 100"
          height="8"
          rounded
          color="primary"
        ></v-progress-linear>
      </div>
      
      <!-- Current Question -->
      <div class="question-container" v-if="currentQuestion">
        <h2 class="text-h5 mb-6 text-center">{{ currentQuestion.question }}</h2>
        
        <!-- Answer Options -->
        <div class="options-container">
          <v-card
            v-for="option in currentQuestion.options" 
            :key="option.id"
            :class="getOptionClass(option)"
            class="option-card mb-4 pa-4"
            :disabled="currentQuestion.isAnswered"
            @click="!currentQuestion.isAnswered && selectOption(option)"
            elevation="2"
            rounded="lg"
          >
            <div class="d-flex align-center">
              <div class="option-indicator me-3">
                <v-icon v-if="currentQuestion.isAnswered && selectedOptionId === option.id && option.isCorrect" 
                       color="success">mdi-check-circle</v-icon>
                <v-icon v-else-if="currentQuestion.isAnswered && selectedOptionId === option.id && !option.isCorrect" 
                       color="error">mdi-close-circle</v-icon>
                <v-icon v-else-if="currentQuestion.isAnswered && option.isCorrect" 
                       color="success">mdi-check</v-icon>
                <span v-else class="option-letter">{{ getOptionLetter(option, currentQuestion.options) }}</span>
              </div>
              <div>{{ option.text }}</div>
            </div>
          </v-card>
        </div>
        
        <!-- Feedback Message -->
        <div v-if="currentQuestion.isAnswered" 
            :class="['feedback-message mt-4 pa-4 rounded-lg', 
                   currentQuestion.isCorrect ? 'feedback-correct' : 'feedback-incorrect']">
          <v-icon :color="currentQuestion.isCorrect ? 'success' : 'error'" class="me-2">
            {{ currentQuestion.isCorrect ? 'mdi-check-circle' : 'mdi-alert-circle' }}
          </v-icon>
          <span>{{ currentQuestion.isCorrect ? 'Correct!' : 'Incorrect' }}</span>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="d-flex justify-space-between mt-8">
          <v-btn
            v-if="activeQuestionIndex > 0"
            variant="outlined"
            rounded="xl"
            @click="previousQuestion"
            prepend-icon="mdi-chevron-left"
          >
            Previous
          </v-btn>
          <div v-else></div>
          
          <v-btn
            v-if="activeQuestionIndex < quiz.questions.length - 1"
            color="primary"
            variant="flat"
            rounded="xl"
            :disabled="!currentQuestion.isAnswered"
            @click="nextQuestion"
            append-icon="mdi-chevron-right"
          >
            Next Question
          </v-btn>
          <v-btn
            v-else-if="currentQuestion.isAnswered"
            color="success"
            variant="flat"
            rounded="xl"
            @click="finishQuiz"
            append-icon="mdi-flag-checkered"
          >
            Finish Quiz
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['restart', 'view-results', 'submit-answer']);

// State
const activeQuestionIndex = ref(0);
const selectedOptionId = ref(null);
const isQuizComplete = ref(false);

// Reset selected option when moving to a different question
watch(activeQuestionIndex, () => {
  const question = props.quiz.questions[activeQuestionIndex.value];
  // If this question has been answered already, restore the selected option
  if (question && question.isAnswered) {
    // Look for the selected option (in a real app, you might store this separately)
    const selectedOption = question.options.find(o => 
      (question.isCorrect && o.isCorrect) || 
      (selectedOptionHistory.value[activeQuestionIndex.value] === o.id)
    );
    selectedOptionId.value = selectedOption?.id || null;
  } else {
    selectedOptionId.value = null;
  }
});

// Track selected options history across questions
const selectedOptionHistory = ref({});

// Current question
const currentQuestion = computed(() => {
  return props.quiz.questions[activeQuestionIndex.value];
});

// Calculate progress percentage
const calculateProgress = computed(() => {
  const total = props.quiz.questions.length;
  // Show percentage of questions answered
  const answeredCount = props.quiz.questions.filter(q => q.isAnswered).length;
  return Math.round((answeredCount / total) * 100);
});

// Count correct answers (fallback if not provided in progress)
const correctAnswersCount = computed(() => {
  if (!props.quiz || !props.quiz.questions) return 0;
  return props.quiz.questions.filter(q => q.isAnswered && q.isCorrect).length;
});

// Calculate score percentage (fallback if not provided in progress)
const calculateScorePercentage = computed(() => {
  if (!props.quiz || !props.quiz.questions || props.quiz.questions.length === 0) return 0;
  
  const answeredCount = props.quiz.questions.filter(q => q.isAnswered).length;
  if (answeredCount === 0) return 0;
  
  return Math.round((correctAnswersCount.value / props.quiz.questions.length) * 100);
});

// Check if quiz is complete
const isAllQuestionsAnswered = computed(() => {
  return props.quiz.questions.every(q => q.isAnswered);
});

// Select an option and submit answer
const selectOption = async (option) => {
  if (currentQuestion.value.isAnswered) return;
  
  selectedOptionId.value = option.id;
  selectedOptionHistory.value[activeQuestionIndex.value] = option.id;
  
  try {
    // console.log(`Submitting answer: question ${activeQuestionIndex.value}, option ${option.id}`);
    
    // Submit the answer through the parent component
    const result = await emit('submit-answer', activeQuestionIndex.value, option.id);
    
    // Log the result for debugging
    // console.log('Answer submission result from parent:', result);
    
    // If no explicit result is returned (emit doesn't return the handler result),
    // we'll rely on the parent to update the quiz data prop
    
  } catch (error) {
    // console.error('Error during answer submission:', error);
  }
};

// Navigation
const nextQuestion = () => {
  if (activeQuestionIndex.value < props.quiz.questions.length - 1) {
    activeQuestionIndex.value++;
  }
};

const previousQuestion = () => {
  if (activeQuestionIndex.value > 0) {
    activeQuestionIndex.value--;
  }
};

const finishQuiz = () => {
  isQuizComplete.value = true;
};

// Helper to get option letter (A, B, C, etc.)
const getOptionLetter = (option, options) => {
  const index = options.findIndex(o => o.id === option.id);
  return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
};

// Get option styling class based on selection and correctness
const getOptionClass = (option) => {
  if (!currentQuestion.value.isAnswered) {
    return selectedOptionId.value === option.id ? 'option-selected' : '';
  }
  
  if (option.isCorrect) {
    return 'option-correct';
  }
  
  if (selectedOptionId.value === option.id && !option.isCorrect) {
    return 'option-incorrect';
  }
  
  return '';
};
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.progress-container {
  margin-bottom: 2rem;
}

.question-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.option-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.option-card:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: #9D7BFC40;
}

.option-selected {
  border-color: #9D7BFC;
  background-color: #9D7BFC10;
}

.option-correct {
  border-color: #4CAF50;
  background-color: #E8F5E9;
}

.option-incorrect {
  border-color: #F44336;
  background-color: #FFEBEE;
}

.option-indicator {
  min-width: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-letter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.feedback-message {
  background-color: #F5F5F5;
}

.feedback-correct {
  background-color: #E8F5E9;
  border-left: 4px solid #4CAF50;
}

.feedback-incorrect {
  background-color: #FFEBEE;
  border-left: 4px solid #F44336;
}

.score-display {
  background-color: #F3F4FF;
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
