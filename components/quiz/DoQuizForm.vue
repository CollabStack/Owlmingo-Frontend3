<template>
  <!-- ============= During Quiz ============= -->
  <v-row v-if="!isQuizComplete" class="d-flex justify-center align-center flex-column outfit mx-16 mt-4">
    <v-row class="d-flex justify-between align-center" style="width: 100%;">
      <!-- Progress Bar -->
      <v-progress-linear
        :model-value="progressPercentage"
        color="green"
        height="18"
        class="mb-10 progress-linear"
      ></v-progress-linear>

      <!-- Display Current Question Number / Total Questions -->
      <p class="text-h6 mt-8 mx-4">{{ currentIndex + 1 }}/{{ totalQuestions }}</p>
    </v-row>

    <!-- Question and Options -->
    <v-row class="mt-6 mb-2 answer-option" dense>
      <p class="text-h5 text-center mb-6 outfit">{{ currentQuestion.text }}</p>
      <v-col v-for="(option, index) in currentQuestion.options" :key="index" cols="12">
        <v-card
          class="card-answer mt-2"
          :class="getOptionClass(option)"
          @click="selectAnswer(index)"
        >
          <v-card-text class="d-flex align-center">
            <p class="text-h6">
              {{ index + 1 }}. {{ option.text }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
  
  <!-- ============= During Quiz ============= -->
  <v-row v-if="isQuizComplete" class="d-flex justify-center align-center flex-column outfit mx-16 mt-4">
    <v-row class="d-flex justify-between align-center" style="width: 100%;">
      <!-- Progress Bar -->
      <v-progress-linear
        :model-value="progressPercentage"
        color="green"
        height="18"
        class="mb-10 progress-linear"
      ></v-progress-linear>

      <!-- Display Current Question Number / Total Questions -->
      <p class="text-h6 mt-8 mx-4">{{ currentIndex + 1 }}/{{ totalQuestions }}</p>
    </v-row>

    <img src="public/images/image-done.png" alt="Completed" class="mt-3" style="height: 240px; width: 240px;">

      <!-- Quiz Complete Title -->
      <p class="text-h4 font-weight-bold mt-4 text-blue-grey-darken-4 outfit">Quiz Complete</p>

      <!-- Score Display -->
      <p class="text-h5 text-blue-grey-darken-3 mt-2 outfit">
        Your final score is {{ correctAnswerCount }}/{{ totalQuestions }} ({{ scorePercentage }}%)
      </p>

      <!-- Buttons -->
    <div class="mt-6 d-flex justify-center">
          <v-btn class="mx-3 rounded-xl px-6" color="#0D47A1" variant="outlined" @click="resultsQuiz">Results</v-btn>
          <v-btn class="mx-3 rounded-xl px-6" color="#0D47A1" variant="outlined" @click="resetQuiz">Restart</v-btn>
    </div>
  </v-row>

  <!-- ============= During Quiz ============= -->
  <!-- Before Check Answer  -->
  <v-card v-if="!answerChecked" class="mt-16 card-check bg-blue-grey-lighten-5">
    <v-row class="mx-16 mt-16" justify="center">
      <v-col cols="5">
        <v-btn class="ml-16 rounded-xl" variant="outlined">Option</v-btn>
      </v-col>
      <v-col cols="5" class="d-flex justify-end">
        <v-btn class="rounded-xl mr-16" variant="outlined" @click="checkAnswer">Check</v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- After Check Answer -->
  <v-card v-else v-if="!isQuizComplete" class="mt-16 card-check" :class="isCorrect ? 'bg-green-lighten-4' : 'bg-red-lighten-4'">
    <v-row class="mx-16 mt-16" justify="center">
      <v-col cols="5" class="d-flex align-center">
        <v-icon v-if="isCorrect" color="green" class="mr-2">mdi-check-circle</v-icon>
        <v-icon v-else color="red" class="mr-2">mdi-close-circle</v-icon>
        <p class="text-h6">{{ feedbackMessage }}</p>
      </v-col>
      <v-col cols="5" class="d-flex justify-end">
        <!-- Display 'Next Question' or 'Finish' button -->
        <v-btn class="rounded-xl mr-16" variant="outlined" @click="nextQuestion">
          {{ isLastQuestion ? 'Finish' : 'Next Question' }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- ============= After Quiz ============= -->
  <v-card v-if="isQuizComplete" class="mt-16 card-check bg-blue-grey-lighten-5">
    <v-row class="mx-16 mt-16" justify="center">
      <v-col cols="5">
        <v-btn class="ml-16 rounded-xl" variant="outlined">Option</v-btn>
      </v-col>
      <v-col cols="5" class="d-flex justify-end">
        <v-btn class="rounded-xl mr-16" variant="outlined" @click="quizPage">Quiz</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isQuizComplete = ref(false);
const currentIndex = ref(0);
const answerChecked = ref(false);
const feedbackMessage = ref('');
const isCorrect = ref(false);
const correctAnswerCount = ref('1');

const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentIndex.value]);
const progressPercentage = computed(() => (currentIndex.value / (questions.value.length - 1)) * 100);
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);

const questions = ref([
  {
    id: 1742428461348,
    text: "Which programming language is primarily used for web development?",
    type: false,
    options: [
      { value: "opt1", text: "Python", correct: false },
      { value: "opt2", text: "Java", correct: false },
      { value: "opt3", text: "JavaScript", correct: true },
      { value: "opt4", text: "C++", correct: false }
    ],
    selectedOption: null,
    selectedAnswers: [],
    correctAnswer: "JavaScript",
  },
  {
    id: 1742428461349,
    text: "Which of the following are front-end frameworks/libraries?",
    type: true,
    options: [
      { value: "opt1", text: "Vue.js", correct: true },
      { value: "opt2", text: "React", correct: true },
      { value: "opt3", text: "Laravel", correct: false },
      { value: "opt4", text: "Angular", correct: true }
    ],
    selectedOption: null,
    selectedAnswers: [],
    correctAnswer: ["Vue.js", "React", "Angular"],
  }
]);

// Handle option selection
const selectAnswer = (index) => {
  if (answerChecked.value) return;

  const optionValue = currentQuestion.value.options[index].text;

  if (currentQuestion.value.type) {
    // For multiple-choice, toggle the selected answer
    if (currentQuestion.value.selectedAnswers.includes(optionValue)) {
      currentQuestion.value.selectedAnswers = currentQuestion.value.selectedAnswers.filter(answer => answer !== optionValue);
    } else {
      currentQuestion.value.selectedAnswers.push(optionValue);
    }
  } else {
    // For single-choice, set the selected option
    currentQuestion.value.selectedOption = optionValue;
  }
};

// Check if the answer is correct
const checkAnswer = () => {
  if (currentQuestion.value.type) {
    const selectedAnswers = currentQuestion.value.selectedAnswers;
    const correctAnswers = currentQuestion.value.correctAnswer;

    const isAllCorrect = correctAnswers.every(answer => selectedAnswers.includes(answer)) &&
                         selectedAnswers.every(answer => correctAnswers.includes(answer));

    isCorrect.value = isAllCorrect;
    feedbackMessage.value = isAllCorrect
      ? 'Correct!'
      : 'Incorrect. The correct answers are highlighted.';
  } else {
    isCorrect.value = currentQuestion.value.selectedOption === currentQuestion.value.correctAnswer;
    feedbackMessage.value = isCorrect.value
      ? 'Correct!'
      : 'Incorrect. The correct answer is highlighted.';
  }

  answerChecked.value = true;
};

// Go to the next question or finish quiz
const nextQuestion = () => {
  if (isLastQuestion.value) {
    isQuizComplete.value = true; // Mark quiz as complete when the last question is reached
  } else {
    currentIndex.value++;
    resetState();
  }
};

// Reset state for the next question
const resetState = () => {
  answerChecked.value = false;
  feedbackMessage.value = '';
  isCorrect.value = false;
  currentQuestion.value.selectedOption = null;
  currentQuestion.value.selectedAnswers = [];
};

// Ensure options reset when switching questions
watch(currentIndex, resetState);

// Get the correct class for answer options
const getOptionClass = (option) => {
  // For single-choice questions
  if (!currentQuestion.value.type) {
    if (!answerChecked.value) {
      // Highlight the selected option for single-choice question
      return currentQuestion.value.selectedOption === option.text ? 'bg-blue-lighten-4' : 'bg-blue-lighten-5';
    }
    
    // After checking the answer, highlight correct/incorrect answer
    if (option.text === currentQuestion.value.correctAnswer) {
      return 'bg-green-lighten-4'; // Correct answer
    } else if (currentQuestion.value.selectedOption === option.text) {
      return 'bg-red-lighten-4'; // Selected but incorrect answer
    }

    return 'bg-blue-lighten-5'; // Default color for unselected options
  }

  // For multiple-choice questions
  if (currentQuestion.value.type) {
    if (!answerChecked.value) {
      // Highlight the selected options for multiple-choice question
      return currentQuestion.value.selectedAnswers.includes(option.text) ? 'bg-blue-lighten-4' : 'bg-blue-lighten-5';
    }

    // After checking the answer, highlight correct/incorrect answer
    if (currentQuestion.value.selectedAnswers.includes(option.text)) {
      if (option.correct) {
        return 'bg-green-lighten-4'; // Correctly selected option
      } else {
        return 'bg-red-lighten-4'; // Incorrectly selected option
      }
    } else if (option.correct) {
      return 'bg-green-lighten-4'; // Correct answer not selected
    }

    return 'bg-blue-lighten-5'; // Default color for unselected options
  }
};

// Navigate to quiz page
const quizPage = () => {
  router.push('/quiz'); 
};

// Navigate to results page
const resultsQuiz = () => {
  router.push('/quiz/results-quiz'); 
};

// Method Restart quiz 
const resetQuiz = () => {
  router.push('/quiz/do-quiz');
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
}

.progress-linear {
  width: 80%;
  margin-top: 70px;
  border-radius: 10px;
  margin-left: 120px;
}

.card-answer {
  border-radius: 15px;
}

.answer-option {
  margin-left: 160px;
  margin-right: 160px;
}

.card-check {
  height: 195px;
}

.card-answer.bg-blue-lighten-4 {
  background-color: #90caf9;
}

.card-answer.bg-green-lighten-4 {
  background-color: #81c784; /* Correct answer color */
}

.card-answer.bg-red-lighten-4 {
  background-color: #e57373; /* Incorrect answer color */
}
</style>
