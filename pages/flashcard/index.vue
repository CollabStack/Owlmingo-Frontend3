<template>

    <v-app>
      <v-container class="d-flex flex-column align-center py-6">
        <h1 class="text-h4 font-weight-bold mb-2">AI Flashcard Generator</h1>
        <p class="text-subtitle-1 text-center mb-4">
          Upload a document, paste your notes, or select a video to automatically generate flashcards with AI.
        </p>
        
        <v-tabs v-model="selectedTab" class="mb-4">
          <v-tab value="document">Document</v-tab>
          <v-tab value="text">Text</v-tab>
          <v-tab value="image">Image</v-tab>
          <v-tab value="video">Video</v-tab>
        </v-tabs>
        
        <v-card class="w-100 max-w-md pa-6 text-center d-flex flex-column align-center justify-center" outlined>
          <v-icon size="48" class="mb-2">mdi-cloud-upload</v-icon>
          <p class="text-body-2">Drag a {{ selectedTab }} here or click to browse</p>
          <v-file-input class="mt-2" label="Choose a file" outlined></v-file-input>
        </v-card>
        
        <nuxt-link to="/flashcard/library"><v-btn class="mt-4" variant="outlined">Options</v-btn></nuxt-link>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const selectedTab = ref('document');
  </script>
  
  <style scoped>
    
  </style>
