import { defineNuxtPlugin } from '#app';
import { useQuizStore } from '~/store/quizStore';

export default defineNuxtPlugin(() => {
  const quizStore = useQuizStore();
  quizStore.loadHistory();
});
