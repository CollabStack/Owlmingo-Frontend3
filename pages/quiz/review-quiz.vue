<template>
  <v-container class="mb-16">
    <!-- Header Section with Animation -->
    <v-row align="center" justify="space-between" class="mt-4 mb-6" v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold outfit mb-2">{{ quizTitle }}</h1>
        <p class="text-body-1 text-grey-darken-2">Create or edit quiz questions and manage your quiz content</p>
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-sm-end">
        <v-btn 
          v-if="questions.length > 0"
          variant="flat" 
          color="primary" 
          prepend-icon="mdi-play" 
          class="rounded-xl px-6 pulse-animation" 
          @click="startQuiz"
        >
          Start Quiz
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mx-0">
      <!-- SideBar Quiz -->
      <SideBarQuiz />
      
      <!--  Quiz Content -->
      <v-col cols="12" md="9" class="quiz-content">
        <!-- States Management -->
        <div v-if="isLoading" class="text-center py-16" v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { duration: 400 } }">
          <v-progress-circular indeterminate color="primary" size="64" class="mb-6"></v-progress-circular>
          <h2 class="text-h6 outfit">Loading quiz content...</h2>
        </div>

        <div v-else-if="questions.length === 0" class="text-center py-16" v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }">
          <v-img 
            src="/images/empty-quiz.png" 
            alt="No questions" 
            width="200" 
            class="mx-auto mb-6"
            contain
          ></v-img>
          <h2 class="text-h5 outfit mb-2">No Quiz Questions</h2>
          <p class="text-body-1 text-grey-darken-1 mb-6">Start by adding your first question below</p>
          <v-btn 
            color="primary" 
            class="rounded-xl px-6" 
            prepend-icon="mdi-plus" 
            @click="addQuestion"
            :loading="isAddingQuestion"
          >
            Add First Question
          </v-btn>
        </div>

        <!-- Questions List -->
        <div v-else class="questions-list" v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
          
          <v-card 
            v-for="(question, index) in questions" 
            :key="question.id" 
            class="mb-6 rounded-lg question-card" 
            elevation="2"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 * index } }"
          >
            <v-card-title class="d-flex align-center pa-4">
              <v-avatar color="primary" class="mr-3" size="36">
                <span class="white--text">{{ index + 1 }}</span>
              </v-avatar>
              <h3 class="text-h6 outfit">Question {{ index + 1 }}</h3>
              <v-spacer></v-spacer>
              <v-btn
                icon
                variant="text"
                color="error"
                @click="confirmDelete(index)"
                class="delete-btn"
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Delete Question</v-tooltip>
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text class="pa-4">
              <EditQuiz
                :question="question"
                @delete="removeQuestion(index)"
                @update-question="updateQuestion(index, $event)"
              />
            </v-card-text>
          </v-card>
          
          <!-- Add Question Button --> 
          <div class="d-flex justify-center mt-8">
            <v-btn 
              variant="outlined" 
              class="rounded-xl add-question-btn" 
              color="primary" 
              prepend-icon="mdi-plus"
              @click="addQuestion"
              :loading="isAddingQuestion">
                Add New Question
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    
    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      :timeout="3000"
      location="top"
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
    
    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="bg-error text-white pa-4">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          Delete Question
        </v-card-title>
        <v-card-text class="pa-4 pt-5">
          Are you sure you want to delete this question? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete(true)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  const confirmDialog = ref(false);
  const questionToDelete = ref<number | null>(null);

  const quizId = computed(() => {
    return route.query.id as string || localStorage.getItem('lastQuizId') || 'a891c0e1-2875-4ce0-9111-e981dfa82c90';
  });

  // Validate all questions before starting
  const startQuiz = () => {
    const allValid = questions.value.every(q => 
      q.text.trim() !== '' && 
      q.options.every(opt => opt.text.trim() !== '')
    );
    
    if (!allValid) {
      showErrorMessage('Please fill in all questions and answer options before starting the quiz.');
      return;
    }
    
    router.push({
      path: '/quiz/do-quiz',
      query: { id: quizId.value }
    });
  };

  // Add a new question to the quiz
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
      await loadQuizData();

      Swal.fire({
        icon: 'success',
        title: 'Question added successfully',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: 'bottom-end'
      });
      
    } catch (error) {
      console.error('Error adding question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to add question');
    } finally {
      isAddingQuestion.value = false;
    }
  };

  // Confirm delete question
  const confirmDelete = (index: number | true) => {
    if (index === true && questionToDelete.value !== null) {
      // Confirm was clicked in dialog, proceed with deletion
      removeQuestion(questionToDelete.value);
      confirmDialog.value = false;
      questionToDelete.value = null;
    } else if (typeof index === 'number') {
      // Show confirmation dialog
      questionToDelete.value = index;
      confirmDialog.value = true;
    }
  };

  // Remove a question from the quiz
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
        timer: 1500,
        toast: true,
        position: 'bottom-end'
      });
      
    } catch (error) {
      console.error('Error removing question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to remove question');
    }
  };

  // Update an existing question
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

  // Display error message
  const showErrorMessage = (message: string) => {
    errorMessage.value = message;
    showError.value = true;
  };
  
  // Load quiz data from API
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
        } else {
          questions.value = [];
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
  max-width: 900px;
  margin: 0 auto;
}

.question-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  overflow: hidden;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
  border-left-color: var(--v-primary-base, #1976d2);
}

.delete-btn {
  transition: all 0.3s ease;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.add-question-btn {
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.add-question-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .quiz-content {
    margin-right: 0;
    padding: 0 16px;
  }
}
</style>