<template>
    <v-container class="mb-16">
        <v-row align="center" justify="space-between" class="mt-4">
            <!-- Title and Subtitle -->
            <v-col cols="3">
                <p class="text-h5 font-weight-bold outfit">Completed</p>
                <p class="text-body-2 text-grey-darken-2">The quizzes completed by you</p>
            </v-col>

            <!-- Buttons -->
            <v-col cols="auto">
                <v-btn variant="outlined" color="blue" class="rounded-xl" @click="quizPage">Generate Quiz</v-btn>
            </v-col>
        </v-row>

        <!-- Table Header -->
        <v-card class="mt-4 rounded-lg pa-4" elevation="0" color="grey-lighten-4">
            <v-row no-gutters class="px-4">
                <v-col cols="3">
                    <h2 class="text-body-1 font-weight-medium text-grey-darken-2">Lessons</h2>
                </v-col>
                <v-col cols="3">
                    <h2 class="text-body-1 font-weight-medium text-grey-darken-2 ml-14">Date</h2>
                </v-col>
                <v-col cols="3">
                    <h2 class="text-body-1 font-weight-medium text-grey-darken-2 text-right mr-2">Score</h2>
                </v-col>
                <v-col cols="3" class="text-right">
                    <h2 class="text-body-1 font-weight-medium text-grey-darken-2 mr-3">Actions</h2>
                </v-col>
            </v-row>
        </v-card>

        <!-- Table Content -->
        <v-card 
            v-for="(quiz, index) in quizzes" 
            :key="index" 
            class="mt-2 rounded-lg pa-4" 
            elevation="0" 
            color="grey-lighten-4"
        >
            <v-row no-gutters class="px-4 align-center">
                <v-col cols="3">
                    <p class="text-body-2 font-weight-medium">{{ quiz.lesson }}</p>
                </v-col>
                <v-col cols="3">
                    <p class="text-body-2 text-grey-darken-2">{{ quiz.date }}</p>
                </v-col>
                <v-col cols="3">
                    <p class="text-body-2 font-weight-medium text-right">{{ quiz.score }}</p>
                </v-col>
                <v-col cols="3" class="text-right">
                    <v-btn variant="outlined" color="blue" class="rounded-lg" @click ="resultsQuiz">View</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Quiz {
  lesson: string;
  date: string;
  score: string;
}

const quizzes = ref<Quiz[]>([
  { lesson: "Math Quiz 1", date: "March 15, 2025 03:48 AM", score: "0/5 (0%)" },
  { lesson: "Science Quiz 2", date: "March 13, 2025 09:36 PM", score: "1/5 (20%)" }
]);

const router = useRouter();

// Navigate to quiz page
const quizPage = () => {
  router.push('/quiz'); 
};

// Navigate to results quiz page 
const resultsQuiz = () => {
  router.push('/quiz/results-quiz'); 
};

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

  .outfit {
    font-family: "Outfit", sans-serif;
  }
</style>
