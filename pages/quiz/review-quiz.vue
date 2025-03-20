<template>
  <v-container>
    <v-row class="mx-0">
      <!-- SideBar Quiz -->
      <SideBarQuiz />
      <!--  Edit Quiz -->
      <v-col class="quiz-content">
        <v-btn
          v-if="questions.length !== 0"
          variant="outlined"
          class="float-end mt-4 rounded-xl start-quiz-btn"
          color="blue"
          @click="startQuiz"
          >
          Start Quiz
        </v-btn>

        <h2 v-if="questions.length !== 0" class="text-h5 mt-2 text-left ml-12 outfit">Edit Quiz</h2>

        <div v-if="questions.length === 0" class="text-center mt-6 mb-6 ml-14">
          <p class="text-center mt-12">No quiz data available.</p>
        </div>

        <div v-for="(question, index) in questions" :key="question.id" class="ml-12">
            <EditQuiz
            :question="question"
            @delete="removeQuestion(index)"
            @update-question="updateQuestion(index, $event)"
            />
        </div>

        <!-- Add Question Button --> 
        <v-row justify="center" class="mt-12 mb-12 ml-12">
          <v-btn variant="outlined" class="rounded-xl" color="blue" @click="addQuestion">
              Add Question
          </v-btn>

          <!-- Start Quiz Button (aligned to the right) -->
          <v-btn
            v-if="questions.length !== 0"
            variant="outlined"
            class="ml-auto mt-2 rounded-xl mr-4"
            color="blue"
            @click="startQuiz"
          >
            Start Quiz
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import EditQuiz from '~/components/quiz/EditQuiz.vue';
  import SideBarQuiz from '~/components/quiz/SideBarQuiz.vue';

  interface Question {
      id: number;
      text: string;
      type: boolean;
      options: { value: string; text: string }[];
      selectedOption?: string | null;
      selectedAnswers?: string[];
  }

  const questions = ref<Question[]>([]);

  const router = useRouter();

  const startQuiz = () => {
      const allValid = questions.value.every(q => q.text.trim() !== '' && q.options.every(opt => opt.text.trim() !== ''));
      if (!allValid) {
          alert('Please fill in all questions and options before starting.');
          return;
      }
          router.push({
              path: '/quiz/do-quiz',
              query: { questions: JSON.stringify(questions.value) }
          });
  };

  const addQuestion = () => {
      questions.value.push({
          id: Date.now(),
          text: '',
          type: false,
          options: [
              { value: 'opt1', text: '' },
              { value: 'opt2', text: '' },
              { value: 'opt3', text: '' },
              { value: 'opt4', text: '' }
          ],
          selectedOption: null,
          selectedAnswers: []
      });
  };

  const removeQuestion = (index: number) => {
      questions.value.splice(index, 1);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    questions.value[index] = updatedQuestion;
  };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

  .outfit {
    font-family: "Outfit", sans-serif;
  }
  .quiz-content {
    margin-right: -200px;
  }
</style>