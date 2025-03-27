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

        <h2 v-if="questions.length !== 0" class="text-h5 mt-2 text-left ml-12 outfit">{{ quizTitle }}</h2>

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
          <v-btn 
            variant="outlined" 
            class="rounded-xl" 
            color="blue" 
            @click="addQuestion"
            :loading="isAddingQuestion">
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
    
    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      :timeout="3000"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { userAuth } from '~/store/userAuth';
  import { useQuizStore } from '~/store/quizStore';
  import EditQuiz from '~/components/quiz/EditQuiz.vue';
  import SideBarQuiz from '~/components/quiz/SideBarQuiz.vue';
  import Swal from 'sweetalert2';

  interface Question {
      id: number;
      text: string;
      type: boolean;
      options: { value: string; text: string }[];
      selectedOption?: string | null;
      selectedAnswers?: string[];
  }

  const questions = ref<Question[]>([]);
  const quizTitle = ref('Edit Quiz');
  const router = useRouter();
  const route = useRoute();
  const authStore = userAuth();
  const quizStore = useQuizStore();
  const isAddingQuestion = ref(false);
  const showError = ref(false);
  const errorMessage = ref('');
  const isLoading = ref(false);

  const quizId = computed(() => {
    return route.query.id as string || localStorage.getItem('lastQuizId') || 'a891c0e1-2875-4ce0-9111-e981dfa82c90';
  });

  const startQuiz = () => {
      const allValid = questions.value.every(q => q.text.trim() !== '' && q.options.every(opt => opt.text.trim() !== ''));
      if (!allValid) {
          alert('Please fill in all questions and options before starting.');
          return;
      }
      router.push({
          path: '/quiz/do-quiz',
          query: { id: quizId.value }
      });
  };

  const addQuestion = async () => {
    if (!quizId.value) {
      showErrorMessage('Quiz ID not found. Please create or select a quiz first.');
      return;
    }

    try {
      isAddingQuestion.value = true;
      const token = authStore.getToken();
      if (!token) {
        router.push('/auth');
        return;
      }

      const newQuestion = {
        question: "New Question",
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
          { text: "Option 3", isCorrect: false },
          { text: "Option 4", isCorrect: false }
        ]
      };

      const payload = {
        quiz_id: quizId.value,
        questions: [newQuestion]
      };

      const response = await fetch('https://owlmingo-16f448c07f1f.herokuapp.com/api/v1/user/auth/quiz/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Question added successfully:', responseData);

      // Reload the quiz to get the updated questions from the API
      loadQuizData();

      Swal.fire({
        icon: 'success',
        title: 'Question added successfully',
        showConfirmButton: false,
        timer: 1500
      });
      
    } catch (error) {
      console.error('Error adding question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to add question');
    } finally {
      isAddingQuestion.value = false;
    }
  };

  const removeQuestion = async (index: number) => {
    try {
      if (!quizId.value) {
        showErrorMessage('Quiz ID not found. Please create or select a quiz first.');
        return;
      }
      
      const token = authStore.getToken();
      if (!token) {
        router.push('/auth');
        return;
      }
      
      const questionIndex = index;
      
      const response = await fetch(
        `https://owlmingo-16f448c07f1f.herokuapp.com/api/v1/user/auth/quiz/${quizId.value}/questions/${questionIndex}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      // Remove question from local state
      questions.value.splice(index, 1);
      
      Swal.fire({
        icon: 'success',
        title: 'Question deleted successfully',
        showConfirmButton: false,
        timer: 1500
      });
      
    } catch (error) {
      console.error('Error removing question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to remove question');
    }
  };

  const updateQuestion = async (index: number, updatedQuestion: Question) => {
    try {
      if (!quizId.value) {
        showErrorMessage('Quiz ID not found. Please create or select a quiz first.');
        return;
      }
      
      const token = authStore.getToken();
      if (!token) {
        router.push('/auth');
        return;
      }
      
      // Update the local state first for immediate UI feedback
      questions.value[index] = updatedQuestion;
      
      // Format the question data for the API
      const questionData = {
        question: updatedQuestion.text,
        options: updatedQuestion.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.value === 'opt1' // Assuming first option is correct
        }))
      };
      
      // Call the API to update the question
      await quizStore.updateQuestion(quizId.value, index, questionData);
      
    } catch (error) {
      console.error('Error updating question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to update question');
    }
  };

  const showErrorMessage = (message: string) => {
    errorMessage.value = message;
    showError.value = true;
  };
  
  const loadQuizData = async () => {
    try {
      isLoading.value = true;
      
      // Use the quizStore to fetch the quiz data
      const result = await quizStore.fetchQuiz(quizId.value);
      
      if (result.success) {
        const quizData = result.data;
        
        // Update the quiz title
        quizTitle.value = quizData.title || 'Edit Quiz';
        
        // Map API questions to component format
        if (quizData.questions && Array.isArray(quizData.questions)) {
          questions.value = quizData.questions.map(q => ({
            id: q.questionIndex || Date.now(),
            text: q.question || '',
            type: false,
            options: q.options.map((opt, idx) => ({
              value: opt.id || `opt${idx + 1}`,
              text: opt.text || ''
            })),
            selectedOption: null,
            selectedAnswers: []
          }));
        }
      } else {
        showErrorMessage(result.error || 'Failed to load quiz data');
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to load quiz data');
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    await loadQuizData();
  });
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