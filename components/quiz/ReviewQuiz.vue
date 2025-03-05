<template>
    <v-row class="mx-12 mt-9">
        <v-col cols="12" class="mx-auto">
          <!-- Start Quiz Button -->
          <v-btn variant="outlined" class="float-end mt-2 rounded-lg" color="blue" @click="StartQuiz">
            Start Quiz
          </v-btn>
  
          <!-- Quiz Title -->
          <h2 class="text-h5 mt-2">Edit Quiz</h2>

          <ModifyQuizCard />
        </v-col>
    </v-row> 
</template>
  
<script setup>
import ModifyQuizCard from './ModifyQuizCard.vue';


</script>

<style>
</style>

  
  