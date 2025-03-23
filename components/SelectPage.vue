<template>
    <div class="select-page-container">
      <p class="title">AI Quiz Generator</p>
      <p class="description">Upload a document, paste your notes, or select a video to automatically generate a quiz with AI.</p>
      <div class="button-container">
        <v-btn color="primary" @click="goBack" class="back-btn">Back to Upload</v-btn>
        <v-btn color="secondary" @click="sheet = true" class="option-btn">Options</v-btn>
      </div>
      <!-- Bottom Sheet -->
      <v-bottom-sheet v-model="sheet" inset>
        <v-card class="text-center py-5 px-5" rounded="lg">
          <v-card-text class="d-flex justify-space-between align-center">
            <p class="text-h5 text-primary">Option</p>
            <v-icon color="primary" @click="sheet = false" class="clickable-icon">mdi-close</v-icon>
          </v-card-text>
          <v-divider></v-divider>
          <!-- Select Option -->
          <v-container>
            <p class="text-primary text-h6 text-left">Question Type</p>
            <v-select clearable chips label="Multiple Choice"
              :items="['Multiple Choice', 'True/False', 'Open Ended']"
              class="my-3 animated-input"></v-select>
  
            <p class="text-primary text-h6 text-left">Max Questions</p>
            <v-select clearable chips label="Auto" :items="['Auto', '5', '10']"
              class="my-3 animated-input"></v-select>
          </v-container>
        </v-card>
      </v-bottom-sheet>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const sheet = ref(false);
  
  const goBack = () => {
    // Add your navigation logic here
    console.log('Navigate back to upload');
  };
  </script>
  
  <style scoped>
  .select-page-container {
    padding: 20px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .description {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .button-container {
    margin-bottom: 20px;
  }
  
  .back-btn {
    min-width: 150px;
  }
  
  .option-btn {
    min-width: 150px;
    margin-left: 10px;
  }
  
  .clickable-icon {
    cursor: pointer;
  }
  </style>