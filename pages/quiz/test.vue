<template>
    <v-container class="d-flex justify-center">
      <v-card class="pa-5 rounded-xl" max-width="800">
        <v-card-title class="text-h5 d-flex justify-space-between align-center w-100">
          Answers
          <!-- Close button placed to the right -->
          <v-btn @click="response" class="ml-auto text-blue" variant="flat">
            Close
          </v-btn>
        </v-card-title>
        <v-card-subtitle class="text-body-1">Score: 1/5</v-card-subtitle>
      
        <v-divider class=""></v-divider>
        <ResultsForm />
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'; // Import useRouter
  import ResultsForm from '~/components/quiz/ResultsForm.vue';
  
  const router = useRouter(); // Initialize router
  
  const response = () => {
    router.push('/quiz/complete-quiz'); // Navigate to the desired route
  };
  </script>
  
  <style scoped>
  </style>
  