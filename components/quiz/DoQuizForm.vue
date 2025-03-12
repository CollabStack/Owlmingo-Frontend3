<template>
    <v-row class="mx-12 mt-10 d-flex justify-center align-center">
      <v-col cols="12" class="mx-auto mb-12">
        <v-card class="pa-4 rounded-lg elevation-3 mt-12 mx-auto" max-width="900">
          <v-row align="center">
            <v-col cols="10" class="mt-1 ml-4 mb-4">
              <p class="text-h6 mt-2">Question {{ currentIndex + 1 }} / {{ totalQuestions }}</p>
              <p class="text-h7 mt-4">{{ currentQuestion.text }}</p>
            </v-col>
          </v-row>
  
          <p class="ml-4 mt-4 text-h7 mb-9">Choose Answer</p>
  
          <v-radio-group v-model="selectedAnswer">
            <v-row dense class="mx-2">
              <v-col v-for="(option, index) in currentQuestion.options" :key="index" cols="12" sm="6">
                <v-card
                  :class="getCardClass(option)"
                  class="mb-1 rounded-lg"
                  variant="outlined"
                  @click="selectAnswer(option)"
                >
                  <v-card-text>
                    <p class="text-h6">{{ option.text }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-radio-group>
  
          <!-- Show after selecting an answer -->
          <v-row class="mx-4" v-if="answerSelected">
            <v-col class="mt-4">
              <p class="text-h6 font-weight-medium">Press any key to continue</p>
            </v-col>
            <v-col class="mt-4 text-right mb-4">
              <v-btn color="blue" variant="outlined" @click="nextQuestion">Continue</v-btn>
            </v-col>
          </v-row>
  
          <!-- "Don't Know" Button (Hidden after selection) -->
          <v-row class="mx-4" v-if="!answerSelected">
            <v-col class="mt-4 text-center mb-4">
              <v-btn color="blue" variant="solo" @click="showCorrectAnswer">Don't Know</v-btn>
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
  
  const questions = ref([]); 
  const currentIndex = ref(0); 
  const selectedAnswer = ref(null); 
  const answerSelected = ref(false); 
  
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
  
  // Total number of questions
  const totalQuestions = computed(() => questions.value.length);
  
  // Select an answer
  const selectAnswer = (option) => {
    if (answerSelected.value) return; // Prevent changing answer
    selectedAnswer.value = option.text;
    answerSelected.value = true;
  };
  
  // Show the correct answer if the user clicks "Don't Know"
  const showCorrectAnswer = () => {
    answerSelected.value = true; 
    selectedAnswer.value = null; 
  };
  
  // Move to the next question
  const nextQuestion = () => {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
      selectedAnswer.value = null;
      answerSelected.value = false;
    } else {
      router.push('/quiz/review-results'); // Navigate to completion page
    }
  };
  
  // Get the CSS class for styling selected and correct answers
  const getCardClass = (option) => {
    if (answerSelected.value) {
      // Show correct feedback based on the selected answer
      if (selectedAnswer.value === option.text) {
        return option.correct ? 'green lighten-2' : 'red lighten-2'; 
      }
      if (option.correct) {
        return 'green lighten-2';
      }
    }
    return ''; 
  };
  </script>
  
  <style scoped>
  .green {
    background-color: #4CAF50; 
  }
  .red {
    background-color: #FF5252;
  }
  </style>