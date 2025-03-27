<template>
  <v-container>
    <v-btn
      color="grey-darken-1"
      variant="outlined"
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      @click="router.back()"
    >
      Back
    </v-btn>
    
    <div v-if="loading" class="d-flex justify-center align-center flex-column my-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <span class="mt-4">Loading question data...</span>
    </div>
    
    <div v-else-if="error" class="text-center my-8">
      <v-alert type="error">{{ error }}</v-alert>
      <v-btn color="primary" class="mt-4" @click="router.push('/library')">
        Return to Library
      </v-btn>
    </div>
    
    <EditQuiz 
      v-else
      :quiz-id="quizId"
      :question-index="questionIndex"
      :initial-question="questionData"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuizStore } from '~/store/quizStore';
import EditQuiz from '~/components/quiz/EditQuiz.vue';
import { userAuth } from '~/store/userAuth';

const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();
const authStore = userAuth();

const loading = ref(true);
const error = ref(null);
const questionData = ref(null);

const quizId = route.params.id;
const questionIndex = parseInt(route.params.questionIndex);

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/auth');
    return;
  }

  try {
    // Fetch the quiz data first
    const result = await quizStore.fetchQuiz(quizId);
    
    if (!result.success) {
      error.value = result.error || 'Failed to fetch quiz data';
      return;
    }
    
    // Check if the question index is valid
    if (!quizStore.currentQuiz?.questions || 
        questionIndex < 0 || 
        questionIndex >= quizStore.currentQuiz.questions.length) {
      error.value = 'Invalid question index';
      return;
    }
    
    // Get the question data
    questionData.value = quizStore.currentQuiz.questions[questionIndex];
    
  } catch (err) {
    console.error('Error loading question data:', err);
    error.value = err.message || 'An error occurred while loading question data';
  } finally {
    loading.value = false;
  }
});
</script>
