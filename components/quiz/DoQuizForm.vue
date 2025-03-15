<template>
  <v-row class="mx-12 mt-10 d-flex justify-center align-center">
    <v-col cols="12" class="mx-auto mb-12">
      <v-card class="pa-4 rounded-lg elevation-3 mt-12 mx-auto" max-width="1000">
        <v-row align="center">
          <v-col cols="10" class="mt-1 ml-4 mb-4">
            <p class="text-h6 mt-2">Question {{ currentIndex + 1 }} / {{ totalQuestions }}</p>
            <p class="text-h7 mt-4">{{ currentQuestion.text }}</p>
          </v-col>
        </v-row>

        <p class="ml-4 mt-4 text-h7 mb-9">Choose Answer</p>

        <!-- Single Choice (Radio) -->
        <v-radio-group v-if="!currentQuestion.type" v-model="selectedAnswer">
          <v-row dense class="mx-2">
            <v-col v-for="(option, index) in currentQuestion.options" :key="index" cols="12" sm="6">
              <v-card
                :class="getCardClass(option.value)"
                class="mb-1 rounded-lg"
                variant="outlined"
                @click="selectAnswer(option.value)"
              >
                <v-card-text>
                  <p class="text-h6">{{ index + 1 }}. {{ option.text }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-radio-group>

        <!-- Multiple Choice (Checkbox) -->
        <v-row v-else dense class="mx-2">
          <v-col v-for="(option, index) in currentQuestion.options" :key="index" cols="12" sm="6">
            <v-card
              :class="getCardClass(option.value)"
              class="mb-1 rounded-lg"
              variant="outlined"
              @click="toggleMultipleAnswer(option.value)"
            >
              <v-card-text>
                <p class="text-h6">{{ index + 1 }}. {{ option.text }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Show result message after checking the answer -->
        <v-row class="mx-4" v-if="answerChecked">
          <v-col class="mt-4">
            <p class="text-h6 font-weight-medium" :class="showCorrect ? 'text-green' : 'text-red'">
              {{ feedbackMessage }}
            </p>
          </v-col>
          <v-col class="mt-4 text-right mb-4">
            <v-btn color="blue" variant="outlined" @click="nextQuestion">Continue</v-btn>
          </v-col>
        </v-row>

        <!-- "Check Answer" Button -->
        <v-row class="mx-4" v-if="!answerChecked">
          <v-col class="mt-4 text-center mb-4">
            <v-btn color="blue" variant="solo" @click="checkAnswers">Check</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Reactive States
const questions = ref([]);
const currentIndex = ref(0);
const selectedAnswer = ref(null);
const selectedAnswers = ref([]);
const answerChecked = ref(false);
const showCorrect = ref(false);
const feedbackMessage = ref('');
const correctAnswersCount = ref(0); // Track correct answers

// Load quiz questions from route query
onMounted(() => {
  if (route.query.questions) {
    try {
      questions.value = JSON.parse(decodeURIComponent(route.query.questions));
    } catch (error) {
      console.error('Invalid quiz data:', error);
    }
  }
});

// Get the current question
const currentQuestion = computed(() => questions.value[currentIndex.value] || {});
const totalQuestions = computed(() => questions.value.length);

// Select an answer (Single Choice)
const selectAnswer = (value) => {
  if (answerChecked.value) return;
  selectedAnswer.value = value;
};

// Toggle answers (Multiple Choice)
const toggleMultipleAnswer = (value) => {
  if (answerChecked.value) return;
  if (selectedAnswers.value.includes(value)) {
    selectedAnswers.value = selectedAnswers.value.filter((v) => v !== value);
  } else {
    selectedAnswers.value.push(value);
  }
};

// Validate answer when "Check" is clicked
const checkAnswers = () => {
  if (!currentQuestion.value.type) {
    // Single choice
    showCorrect.value = selectedAnswer.value === currentQuestion.value.selectedOption;
    feedbackMessage.value = showCorrect.value
      ? "Correct! 🎉"
      : `Incorrect! The correct answer is: ${findCorrectAnswer()}`;
  } else {
    // Multiple choice logic
    const correctAnswers = currentQuestion.value.selectedAnswers || [];
    const isCorrect =
      selectedAnswers.value.length === correctAnswers.length &&
      selectedAnswers.value.every((ans) => correctAnswers.includes(ans));

    showCorrect.value = isCorrect;
    feedbackMessage.value = isCorrect
      ? "Correct! 🎉"
      : `Incorrect! The correct answers are: ${findCorrectAnswer()}`;
  }
  answerChecked.value = true;
};

// Move to the next question
const nextQuestion = () => {
  if (answerChecked.value && showCorrect.value) {
    correctAnswersCount.value++; // Increment correct answer count if the user answered correctly
  }

  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++;
    selectedAnswer.value = null;
    selectedAnswers.value = [];
    answerChecked.value = false;
    showCorrect.value = false;
    feedbackMessage.value = '';
  } else {
    // Passing the selected answers and correct answers to the results page
    router.push({
      path: "/quiz/results-quiz",
      query: {
        questions: JSON.stringify(questions.value), // Pass the entire question data
        selectedAnswers: JSON.stringify(questions.value.map(q => ({
          selectedAnswer: q.type ? selectedAnswers.value : selectedAnswer.value, // For multi-choice, send selectedAnswers, else selectedAnswer
          correctAnswer: q.type ? q.selectedAnswers : q.selectedOption // Correct answers for both single and multi-choice
        }))),
        answerTrue: correctAnswersCount.value, 
        totalQuestion: totalQuestions.value
      }
    });
  }
};

// Assign correct colors to answer cards
const getCardClass = (value) => {
  if (!answerChecked.value) {
    return selectedAnswer.value === value || selectedAnswers.value.includes(value) ? 'blue lighten-4' : '';
  }

  if (!currentQuestion.value.type) {
    if (selectedAnswer.value === value) {
      return value === currentQuestion.value.selectedOption ? 'green lighten-2' : 'red lighten-2';
    }
    return showCorrect.value && value === currentQuestion.value.selectedOption ? 'green lighten-2' : '';
  } else {
    const correctAnswers = currentQuestion.value.selectedAnswers || [];
    const isCorrect = correctAnswers.includes(value);
    const isSelected = selectedAnswers.value.includes(value);

    if (isSelected) {
      return isCorrect ? 'green lighten-2' : 'red lighten-2';
    }
    return showCorrect.value && isCorrect ? 'green lighten-2' : '';
  }
};

// Find the correct answer text
const findCorrectAnswer = () => {
  if (!currentQuestion.value.type) {
    const correctOption = currentQuestion.value.options.find(opt => opt.value === currentQuestion.value.selectedOption);
    return correctOption ? correctOption.text : '';
  } else {
    return currentQuestion.value.options
      .filter(opt => currentQuestion.value.selectedAnswers.includes(opt.value))
      .map(opt => opt.text)
      .join(', ');
  }
};
</script>

<style scoped>
.green {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.red {
  background-color: #e8f5e9;
  color: #FF5252;
}

.blue {
  background-color: white;
  color: #2196F3;  
}
</style>
