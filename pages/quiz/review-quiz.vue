<template>
  <v-container class="py-8">
    <!-- Page Header -->
    <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <v-row align="center" justify="space-between" class="mb-6">
        <v-col cols="12" md="7">
          <h1 class="text-h4 outfit outfit-bold text-primary mb-2">{{ quizTitle }}</h1>
          <p class="text-subtitle-1 outfit outfit-regular text-grey-darken-1">
            Create and edit your quiz questions
          </p>
        </v-col>

        <v-col cols="12" md="5" class="d-flex justify-md-end mt-4 mt-md-0">
          <v-btn
            v-if="questions.length > 0"
            color="primary"
            variant="flat"
            class="rounded-xl animated-btn outfit outfit-medium"
            prepend-icon="mdi-play"
            @click="startQuiz"
          >
            Start Quiz
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-h6 mt-6 outfit outfit-medium">Loading your quiz...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="showError" class="text-center py-16" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }">
      <v-icon color="error" size="64">mdi-alert-circle</v-icon>
      <h2 class="text-h5 mt-4 outfit outfit-medium">{{ errorMessage }}</h2>
      <v-btn color="primary" class="mt-6 rounded-xl animated-btn" @click="loadQuizData">Try Again</v-btn>
    </div>

    <!-- Empty State -->
    <div v-else-if="questions.length === 0" class="text-center py-16" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <v-img src="/images/empty-quiz.png" alt="No Questions" max-height="200" class="mb-6 mx-auto" contain></v-img>
      <h2 class="text-h5 outfit outfit-semibold mb-3">No Questions Yet</h2>
      <p class="text-body-1 text-grey-darken-1 mb-6 max-w-md mx-auto">
        Get started by adding your first question to this quiz.
      </p>
      <v-btn
        color="primary"
        variant="flat"
        class="rounded-xl animated-btn outfit outfit-medium"
        prepend-icon="mdi-plus"
        @click="addQuestion"
        :loading="isAddingQuestion"
      >
        Add Your First Question
      </v-btn>
    </div>

    <!-- Quiz Content -->
    <div v-else class="quiz-editor" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }">
      <!-- Questions Section -->
      <div class="mb-8">
        <v-row>
          <!-- Sidebar -->
          <v-col cols="12" md="3" class="d-none d-md-block">
            <SideBarQuiz />
          </v-col>
          
          <!-- Questions List -->
          <v-col cols="12" md="9">
            <!-- Question Items -->
            <v-card
              v-for="(question, index) in questions"
              :key="question.id"
              class="question-card mb-4 rounded-xl"
              elevation="1"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 100 * index, duration: 500 } }"
            >
              <v-card-item class="question-header pa-4">
                <div class="d-flex align-center">
                  <div class="question-number mr-4">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-grow-1">
                    <h3 class="text-h6 outfit outfit-medium">Question {{ index + 1 }}</h3>
                  </div>
                </div>
              </v-card-item>

              <v-divider></v-divider>
              
              <v-card-text>
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
                color="primary"
                class="rounded-xl animated-btn outfit outfit-medium"
                prepend-icon="mdi-plus"
                @click="addQuestion"
                :loading="isAddingQuestion"
              >
                Add Question
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Footer Actions -->
    <div v-if="questions.length > 0" class="d-flex justify-end mt-8">
      <v-btn
        color="primary"
        variant="flat"
        class="rounded-xl animated-btn outfit outfit-medium"
        prepend-icon="mdi-play"
        @click="startQuiz"
      >
        Start Quiz
      </v-btn>
    </div>
    
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
          class="outfit"
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
const quizTitle = ref('Create Quiz');
const router = useRouter();
const route = useRoute();
const authStore = userAuth();
const quizStore = useQuizStore();
const isAddingQuestion = ref(false);
const isLoading = ref(true);
const showError = ref(false);
const errorMessage = ref('');

const quizId = computed(() => {
  return route.query.id as string || localStorage.getItem('lastQuizId') || 'a891c0e1-2875-4ce0-9111-e981dfa82c90';
});

const startQuiz = () => {
  const allValid = questions.value.every(q => q.text.trim() !== '' && q.options.every(opt => opt.text.trim() !== ''));
  if (!allValid) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Questions',
      text: 'Please fill in all questions and options before starting the quiz.',
      confirmButtonColor: '#9D7BFC',
    });
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
      title: 'Question Added',
      text: 'Your new question has been added successfully.',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
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
    
    // Confirm deletion
    const result = await Swal.fire({
      title: 'Delete Question?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F44336',
      cancelButtonColor: '#9E9E9E',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
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
      title: 'Question Deleted',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
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
    
    // Show success toast
    Swal.fire({
      icon: 'success',
      title: 'Question Updated',
      toast: true,
      position: 'bottom-end',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    
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
      quizTitle.value = quizData.title || 'Create Quiz';
      
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

/* Outfit font classes */
.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-regular {
  font-weight: 400;
}

.outfit-medium {
  font-weight: 500;
}

.outfit-semibold {
  font-weight: 600;
}

.outfit-bold {
  font-weight: 700;
}

/* Card styling */
.question-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08) !important;
  border-color: #9D7BFC50;
}

.question-header {
  background-color: rgba(0, 0, 0, 0.02);
}

.question-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #9D7BFC;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Animated button */
.animated-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Limit width for better readability */
.max-w-md {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>