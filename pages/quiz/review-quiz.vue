<template>
    <SideBarQuiz />
    <v-row class="mx-12 mt-4">
      <v-col cols="12" class="mx-auto">
        <!-- Start Quiz Button -->
        <v-btn
          v-if="questions.length !== 0"
          variant="outlined"
          class="float-end mt-2 rounded-lg"
          color="blue"
          :disabled="questions.length === 0"
          @click="startQuiz"
        >
          Start Quiz
        </v-btn>
  
        <!-- Quiz Title -->
        <h2 class="text-h5 mt-2">Edit Quiz</h2>
  
        <!-- If no questions, display a message -->
        <div v-if="questions.length === 0" class="text-center mt-6 mb-6">
          <h4>You have no quiz!</h4>
        </div>
  
        <!-- Render Multiple Questions -->
        <div v-for="(question, index) in questions" :key="question.id">
          <EditQuiz
            :question="question"
            @delete="removeQuestion(index)"
          />
        </div>
  
        <!-- Add Question Button -->
        <v-row justify="center" class="mt-12 mb-12">
            <v-btn variant="outlined" class="rounded-lg" color="blue" @click="addQuestion">
                Add Question
            </v-btn>

            <!-- Start Quiz Button (aligned to the right) -->
            <v-btn
                v-if="questions.length !== 0"
                variant="outlined"
                class="ml-auto mt-2 rounded-lg"
                color="blue"
                @click="startQuiz"
            >
                Start Quiz
            </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import EditQuiz from '~/components/quiz/EditQuiz.vue';
  import SideBarQuiz from '~/components/quiz/SideBarQuiz.vue';

  
  // Define question structure
  interface Question {
    id: number;
    text: string;
    type: boolean; // false for single-choice, true for multiple-choice
    options: { value: string; text: string }[];
    selectedOption?: string | null; // single-choice answer
    selectedAnswers?: string[]; // multiple-choice answers
  }
  
  // Define questions array
  const questions = ref<Question[]>([
    {
      id: 1,
      text: 'What is the capital of France?',
      type: false,
      options: [
        { value: '1', text: 'Berlin' },
        { value: '2', text: 'Madrid' },
        { value: '3', text: 'Paris' },
        { value: '4', text: 'Rome' }
      ],
      selectedOption: null
    },
    {
      id: 2,
      text: 'Which of the following are programming languages?',
      type: true,
      options: [
        { value: '1', text: 'Python' },
        { value: '2', text: 'HTML' },
        { value: '3', text: 'JavaScript' },
        { value: '4', text: 'CSS' }
      ],
      selectedAnswers: ['1', '3']
    }
  ]);
  
  // Define router
  const router = useRouter();
  
  // Start Quiz Function - navigate to DoQuiz.vue
//   const startQuiz = () => {
//     router.push('/quiz/do-quiz');
//   };

  const startQuiz = () => {
    const quizData = encodeURIComponent(JSON.stringify(questions.value));
    router.push(`/quiz/do-quiz?questions=${quizData}`);
  };
  
  // Add a new question
  const addQuestion = () => {
    questions.value.push({
      id: Date.now(),
      text: '',
      type: false,
      options: [
        { value: '1', text: '' },
        { value: '2', text: '' },
        { value: '3', text: '' },
        { value: '4', text: '' }
      ],
      selectedOption: null, // For single-choice questions
      selectedAnswers: [] // For multiple-choice questions
    });
  };
  
  // Remove a question
  const removeQuestion = (index: number) => {
    questions.value.splice(index, 1);
  };
  </script>
  
  <style scoped>
  
  </style>