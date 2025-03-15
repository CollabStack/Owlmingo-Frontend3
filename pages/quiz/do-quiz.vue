<template>
  <div v-if="questions.length">
    <DoQuizForm :questions="questions" />
  </div>
  <p v-else class="text-center mt-6">No quiz data available.</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DoQuizForm from '@/components/quiz/DoQuizForm.vue';

// Fetch questions dynamically
const route = useRoute();
const questions = ref([]);

// Load quiz questions when mounted
onMounted(() => {
  if (route.query.questions) {
    try {
      questions.value = JSON.parse(route.query.questions);
    } catch (e) {
      console.error('Invalid quiz data', e);
    }
  }
});
</script>
