<template>
    <v-navigation-drawer permanent width="300" class="pa-4">
        <h3 class="text-h6 ">Options</h3>
    
        <!-- Name Input -->
        <v-label class="mt-5">Name</v-label>
        <v-text-field 
            v-model="name" 
            variant="flat" 
            density="compact" 
            hide-details 
            class="mt-2 rounded-lg bg-blue-lighten-5"
        />
        
        <!-- Visibility Select -->
        <v-label class="mt-5">Visibility</v-label>
        <v-select 
            v-model="visibility" 
            :items="['Public', 'Private']" 
            variant="flat" 
            density="compact" 
            hide-details 
            class="mt-2 rounded-lg bg-blue-lighten-5"
        />
    
        <!-- Checkbox Options -->
        <v-row class="mt-2">
            <v-col>
            <v-checkbox
                v-for="(option, index) in options"
                :key="index"
                v-model="option.model"
                hide-details
                density="compact"
            >
                <template v-slot:label>
                {{ option.label }}
                <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" size="small" class="ml-1">mdi-information-outline</v-icon>
                    </template>
                    {{ option.tooltip }}
                </v-tooltip>
                </template>
            </v-checkbox>
            </v-col>
        </v-row>
    
        <v-spacer></v-spacer>
    
        <div class="container">
        <v-spacer></v-spacer>
            <v-btn variant="outlined" color="blue" class="w-100 mb-3 bottom-button">
            Completions & Responses
            </v-btn>
        </div>
    </v-navigation-drawer> 
</template>
  
  <script setup>
  import { ref } from 'vue';
  import StartQuiz from '~/components/quiz/StartQuizCard.vue';
  
  // Reactive State
  const name = ref('Lesson Name');
  const visibility = ref('Public');
  
  // Checkboxes reactive
  const options = ref([
    { model: ref(true), label: "Show Answers", tooltip: "Toggle to show correct answers after submission." },
    { model: ref(false), label: "Shuffle Questions", tooltip: "Randomizes the order of questions in the quiz." },
    { model: ref(false), label: "Time Limit", tooltip: "Set a time limit for the quiz." }
  ]);
  </script>
  
  <style>
    .container {
    display: flex;
    flex-direction: column;
    height: 40vh; /* Set the height as needed */
    }
  </style>
  
  
  