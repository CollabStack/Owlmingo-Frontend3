<template>
  <div>
    <QuizzesSection 
      :quizzes="mappedQuizzes" 
      :loading="isLoading"
      @edit-quiz="editQuiz"
      @start-quiz="startQuiz"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import QuizzesSection from '~/components/Library/QuizzesSection.vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '~/store/quizStore';

const router = useRouter();
const quizStore = useQuizStore();
const isLoading = ref(true);

const mappedQuizzes = computed(() => {
  return quizStore.quizzes.map(quiz => ({
    id: quiz.quizId || quiz._id,
    quizId: quiz.quizId || quiz._id,
    title: quiz.title || quiz.source?.fileName || 'Untitled Quiz',
    subtitle: quiz.status === 'completed' ? 'Completed' : 
              quiz.status === 'in_progress' ? 'In Progress' : 'Not Started',
    description: `Quiz with ${quiz.totalQuestions || quiz.quiz?.totalQuestions || 0} questions`,
    totalQuestions: quiz.totalQuestions || quiz.quiz?.totalQuestions || 0,
    correctAnswers: quiz.correctAnswers || quiz.quiz?.correctCount || 0,
    score: quiz.score || quiz.quiz?.score || 0,
    status: quiz.status,
    createdAt: quiz.createdAt || quiz.startedAt,
    tags: quiz.tags || []
  }));
});

const editQuiz = (id) => {
  router.push(`/quiz/review-quiz?id=${id}`);
};

const startQuiz = (id) => {
  router.push(`/quiz/do-quiz?id=${id}`);
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await quizStore.loadHistory();
  } catch (error) {
    console.error('Error loading quiz sessions:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
