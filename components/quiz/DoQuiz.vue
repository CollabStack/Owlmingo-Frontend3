<template>
    <v-row class="mx-12 mt-10 d-flex justify-center align-center">
      <v-col cols="12" class="mx-auto mb-12">
  
        <v-row class="ml-12 align-center">
          <!-- Button Column -->
          <v-col cols="auto" class="d-flex justify-center ml-12">
            <v-btn class="rounded-xl" color="blue" variant="outlined" @click="proceed">
              Option
            </v-btn>
          </v-col>
  
          <!-- Progress Bar Column -->
          <v-col class="d-flex align-center" style="max-width: 72%;">
            <v-progress-linear
              :value="progress"
              height="25"
              :color="progressColor"
              rounded
              class="custom-progress"
            ></v-progress-linear>
          </v-col>
  
          <!-- Current/Total Text Column -->
          <v-col cols="auto" class="text-grey-darken-1 text-h6 font-weight-medium">
            {{ current }} / {{ total }}
          </v-col>
        </v-row>
  
        <!-- Question Card -->
        <v-card class="pa-4 rounded-lg elevation-3 mt-12 mx-auto" max-width="900">
          <v-row align="center">
            <v-col cols="10" class="mt-1 ml-4 mb-4">
              <p class="text-h6 mt-2">Question {{ current }}</p>
              <p class="text-h7 mt-4">What is the dog?</p>
            </v-col>
          </v-row>
  
          <p class="ml-4 mt-4 text-h7 mb-9">Choose Answer</p>
  
          <v-radio-group v-model="selectedAnswer">
            <v-row dense class="mx-2">
              <v-col cols="12" sm="6">
                <v-card class="mb-1 rounded-lg" variant="outlined">
                  <v-card-text>
                    <p class="text-h6">Answer A</p>
                  </v-card-text>
                </v-card>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-card class="mb-1 rounded-lg" variant="outlined">
                  <v-card-text>
                    <p class="text-h6">Answer B</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
  
            <v-row dense class="mx-2">
              <v-col cols="12" sm="6">
                <v-card class="mb-1 rounded-lg" variant="outlined">
                  <v-card-text>
                    <p class="text-h6">Answer C</p>
                  </v-card-text>
                </v-card>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-card class="mb-1 rounded-lg" variant="outlined">
                  <v-card-text>
                    <p class="text-h6">Answer D</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-radio-group>
  
          <v-row class="mx-4">
            <v-col class="mt-4">
              <p class="text-h6 font-weight-medium">Press any key to continue</p>
            </v-col>
            <v-col class="mt-4 text-right mb-4">
              <v-btn color="blue" variant="outlined" @click="proceed">Continue</v-btn>
            </v-col>
          </v-row>
  
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const current = ref(1); // Current question index
  const total = ref(12);   // Total number of questions
  const selectedAnswer = ref(null); // Placeholder for selected answer
  
  // Compute progress percentage (current / total * 100)
  const progress = computed(() => (current.value / total.value) * 100);
  
  // Define progress color based on progress percentage
  const progressColor = computed(() => {
      if (progress.value < 50) return 'red';   // Less than 50%
      if (progress.value < 80) return 'yellow'; // Between 50% and 80%
      return 'green'; // Above 80%
  });
  
  // Proceed to the next question
  function proceed() {
      console.log("Current:", current.value);
      console.log("Total:", total.value);
      console.log("Progress:", progress.value);
      console.log("Progress Color:", progressColor.value);
  
      current.value++; // Increment the current question count
  
      // Ensure `current` doesn't exceed `total`
      if (current.value > total.value) {
          current.value = total.value; 
          // Optionally handle quiz completion here
      }
  }
  </script>
  
  <style scoped>
  .custom-progress {
    border-radius: 15px; /* Rounded corners */
  }
  </style>