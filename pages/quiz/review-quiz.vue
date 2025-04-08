<template>
  <v-container class="mb-16">
    <!-- Header Section with Animation -->
    <v-row align="center" justify="space-between" class="mt-4 mb-6" v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <v-col cols="12" sm="8">
        <div class="d-flex align-center">
          <v-text-field
            v-model="quizTitle"
            label="Quiz Title"
            variant="outlined"
            density="comfortable"
            class="quiz-title-input"
            hide-details
            @change="saveQuizTitle"
          ></v-text-field>
        </div>
        <p class="text-body-1 text-grey-darken-2 mt-2">Create or edit quiz questions and manage your quiz content</p>
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
        
        <div v-else-if="error" class="text-center py-16" v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }">
          <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
          <h2 class="text-h5 outfit mb-2">{{ error }}</h2>
          <v-btn color="primary" class="mt-6 rounded-xl" @click="loadQuizData">Try Again</v-btn>
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
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 * index } }">
            <v-card-title class="d-flex align-center pa-4">
              <v-avatar color="primary" class="mr-3" size="36">
                <span class="white--text">{{ index + 1 }}</span>
              </v-avatar>
              <h3 class="text-h6 outfit">Question {{ index + 1 }}</h3>
              <v-spacer></v-spacer>
              
              <v-btn
                v-if="!editModes[index]"
                icon
                variant="text"
                color="primary"
                @click="startEditing(index)"
                class="edit-btn mr-2"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Edit Question</v-tooltip>
              </v-btn>
              
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
              <!-- View Mode -->
              <div v-if="!editModes[index]" class="view-mode">
                <p class="question-text mb-4">{{ question.text }}</p>
                
                <div class="options-list">
                  <div 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    class="option-item d-flex align-center mb-3 pa-3"
                    :class="{'correct-option': question.selectedOption === option.value}"
                  >
                    <div class="option-indicator mr-3">
                      <span>{{ String.fromCharCode(65 + optIndex) }}</span>
                    </div>
                    <div class="option-text">{{ option.text }}</div>
                    <v-spacer></v-spacer>
                    <v-icon 
                      v-if="question.selectedOption === option.value" 
                      color="success" 
                      class="ms-2"
                    >
                      mdi-check-circle
                    </v-icon>
                  </div>
                </div>
              </div>
              
              <!-- Edit Mode -->
              <div v-else class="edit-mode">
                <v-form ref="editForms" class="edit-question-form">
                  <v-text-field
                    v-model="question.text"
                    label="Question Text"
                    required
                    variant="outlined"
                    class="mb-4 question-text-field"
                    :rules="[v => !!v || 'Question text is required']"
                    placeholder="Enter your question here"
                    density="comfortable"
                    bg-color="surface"
                  ></v-text-field>
                  
                  <p class="text-subtitle-1 font-weight-medium mb-3 outfit">Answer Options</p>
                  
                  <div>
                    <v-card 
                      v-for="(option, optIndex) in question.options" 
                      :key="optIndex" 
                      class="mb-4 pa-4 option-card" 
                      :class="{ 'correct-option': question.selectedOption === option.value }"
                      variant="outlined">
                      <div class="d-flex align-center mb-2">
                        <v-chip
                          size="small"
                          :color="question.selectedOption === option.value ? 'success' : 'grey'" 
                          class="mr-4 option-number-chip"
                        >
                          Option {{ optIndex + 1 }}
                        </v-chip>
                        <v-spacer></v-spacer>
                        <div class="correct-option-toggle d-flex align-center">
                          <span class="text-caption text-medium-emphasis mr-2">Correct Answer</span>
                          <v-switch
                            :model-value="question.selectedOption === option.value"
                            hide-details
                            density="compact"
                            color="success"
                            @update:model-value="val => val ? question.selectedOption = option.value : null"
                            :aria-label="`Mark option ${optIndex + 1} as correct answer`"
                          ></v-switch>
                        </div>
                      </div>
                      
                      <v-text-field
                        v-model="option.text"
                        label="Option Text"
                        variant="outlined"
                        density="comfortable"
                        :rules="[v => !!v || 'Option text is required']"
                        required
                        class="option-text-field"
                        :placeholder="`Enter option ${optIndex + 1} text`"
                        bg-color="surface"
                      ></v-text-field>
                    </v-card>
                  </div>
                  
                  <div class="d-flex justify-end mt-4">
                    <v-btn
                      color="grey-darken-1"
                      variant="text"
                      class="me-4 action-btn"
                      @click="cancelEdit(index)"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="flat"
                      class="action-btn"
                      :loading="isSaving === index"
                      @click="saveQuestion(index)"
                    >
                      Save Changes
                    </v-btn>
                  </div>
                </v-form>
              </div>
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
    
    <!-- Feedback Snackbars -->
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
    
    <v-snackbar
      v-model="showSuccess"
      color="success"
      :timeout="2000"
      location="bottom"
    >
      {{ successMessage }}
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
  import { ref, computed, onMounted, watch, reactive } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { userAuth } from '~/store/userAuth';
  import { useQuizStore } from '~/store/quizStore';
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
  const isLoading = ref(false);
  const error = ref('');
  const showError = ref(false);
  const showSuccess = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const confirmDialog = ref(false);
  const questionToDelete = ref<number | null>(null);
  const saveTimeout = ref<number | null>(null);
  const editModes = reactive<{ [key: number]: boolean }>({});
  const isSaving = ref<number | null>(null);
  const editForms = ref<any[]>([]);

  const quizId = computed(() => {
    return route.query.id as string || localStorage.getItem('lastQuizId') || '';
  });

  // Display error message
  const showErrorMessage = (message: string) => {
    errorMessage.value = message;
    showError.value = true;
  };
  
  // Display success message
  const showSuccessMessage = (message: string) => {
    successMessage.value = message;
    showSuccess.value = true;
  };
  
  // Load quiz data from API - Define this BEFORE the watcher
  const loadQuizData = async () => {
    try {
      isLoading.value = true;
      error.value = '';
      
      if (!quizId.value) {
        error.value = 'No quiz ID found';
        return;
      }
      
      // Use the quizStore to fetch the quiz data
      const result = await quizStore.fetchQuiz(quizId.value);
      
      if (result.success) {
        const quizData = result.data;
        
        // Update the quiz title
        quizTitle.value = quizData.title || 'Edit Quiz';
        
        // Map API questions to component format
        if (quizData.questions && Array.isArray(quizData.questions)) {
          questions.value = quizData.questions.map((q: any) => {
            return mapQuestionToLocal(q) as Question;
          });
        } else {
          questions.value = [];
        }
        
        // Reset edit modes
        Object.keys(editModes).forEach(key => {
          delete editModes[parseInt(key)];
        });
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

  // Map API question to local format
  const mapQuestionToLocal = (apiQuestion: any) => {
    // Find the correct option
    const correctOptionIndex = apiQuestion.options.findIndex((opt: any) => opt.isCorrect);
    
    const mappedQuestion = {
      id: apiQuestion.questionIndex || apiQuestion.id || Date.now(),
      text: apiQuestion.question || '',
      type: false,
      options: apiQuestion.options.map((opt: any, idx: number) => ({
        value: opt.id || `opt${idx + 1}`,
        text: opt.text || ''
      })),
      selectedOption: correctOptionIndex >= 0 ? 
        (apiQuestion.options[correctOptionIndex].id || `opt${correctOptionIndex + 1}`) : null
    };
    
    return mappedQuestion;
  };

  // NOW add the watcher after the functions it uses are defined
  watch(() => route.query.id, (newId) => {
    if (newId) {
      loadQuizData();
    }
  }, { immediate: true });

  // Toggle edit mode for a specific question
  const startEditing = (index: number) => {
    // Exit any other edit modes first
    Object.keys(editModes).forEach(key => {
      editModes[parseInt(key)] = false;
    });
    
    // Enter edit mode for this question
    editModes[index] = true;
  };

  // Cancel edit mode
  const cancelEdit = (index: number) => {
    // Reload the question data to revert changes
    if (quizStore.currentQuiz && quizStore.currentQuiz.questions) {
      const originalQuestion = quizStore.currentQuiz.questions[index];
      if (originalQuestion) {
        const mappedQuestion = mapQuestionToLocal(originalQuestion);
        questions.value[index] = mappedQuestion as Question;
      }
    }
    
    // Exit edit mode
    editModes[index] = false;
  };

  // Auto-save quiz title when changed
  const saveQuizTitle = async () => {
    if (!quizId.value || !quizTitle.value.trim()) return;
    
    try {
      // Use the quizStore to update quiz title
      await quizStore.updateQuizTitle(quizId.value, quizTitle.value);
      showSuccessMessage('Quiz title updated');
    } catch (error) {
      console.error('Error updating quiz title:', error);
      showErrorMessage('Failed to update quiz title');
    }
  };

  // Save edited question
  const saveQuestion = async (index: number) => {
    const question = questions.value[index];
    
    // Validate the question
    if (!question.text.trim()) {
      showErrorMessage('Question text is required');
      return;
    }
    
    // Validate options
    const emptyOptions = question.options.filter(opt => !opt.text.trim());
    if (emptyOptions.length > 0) {
      showErrorMessage('All option texts are required');
      return;
    }
    
    // Validate that a correct answer is selected
    if (!question.selectedOption) {
      showErrorMessage('Please select a correct answer');
      return;
    }
    
    try {
      isSaving.value = index;
      
      // Format the question data for the API
      const questionData = {
        question: question.text,
        options: question.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.value === question.selectedOption
        }))
      };
      
      // Call the API to update the question
      const result = await quizStore.updateQuestion(quizId.value, index, questionData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update question');
      }
      
      // Exit edit mode
      editModes[index] = false;
      showSuccessMessage('Question updated successfully');
      
    } catch (error) {
      console.error('Error updating question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to update question');
    } finally {
      isSaving.value = null;
    }
  };

  // Validate all questions before starting
  const startQuiz = () => {
    // Exit any edit modes first
    Object.keys(editModes).forEach(key => {
      editModes[parseInt(key)] = false;
    });
    
    const allValid = questions.value.every(q => 
      q.text.trim() !== '' && 
      q.options.every(opt => opt.text.trim() !== '') &&
      q.selectedOption
    );
    
    if (!allValid) {
      showErrorMessage('Please fill in all questions and set correct answers before starting the quiz.');
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

      const response = await fetch(
        `${quizStore.apiBaseUrl}/user/auth/quiz/questions`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      // Reload the quiz to get the updated questions
      await loadQuizData();
      
      // Optionally start editing the new question
      if (questions.value.length > 0) {
        startEditing(questions.value.length - 1);
      }

      showSuccessMessage('Question added successfully');
      
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
        `${quizStore.apiBaseUrl}/user/auth/quiz/${quizId.value}/questions/${questionIndex}`, 
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
      
      // Update edit modes
      const newEditModes: { [key: number]: boolean } = {};
      Object.keys(editModes).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newEditModes[keyNum] = editModes[keyNum];
        } else if (keyNum > index) {
          newEditModes[keyNum - 1] = editModes[keyNum];
        }
      });
      
      // Replace editModes with updated version
      Object.keys(editModes).forEach(key => {
        delete editModes[parseInt(key)];
      });
      Object.keys(newEditModes).forEach(key => {
        editModes[parseInt(key)] = newEditModes[parseInt(key)];
      });
      
      showSuccessMessage('Question deleted successfully');
      
    } catch (error) {
      console.error('Error removing question:', error);
      showErrorMessage(error instanceof Error ? error.message : 'Failed to remove question');
    }
  };

  onMounted(async () => {
    // The loadQuizData is already called by the watcher with immediate: true
    // So we don't need to call it again here
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

.delete-btn, .edit-btn {
  transition: all 0.3s ease;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  color: #f44336 !important;
}

.edit-btn:hover {
  opacity: 1;
  color: #1976d2 !important;
}

.add-question-btn {
  transition: all 0.3s ease;
}

.add-question-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
}

.option-item {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.option-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.option-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.correct-option {
  background-color: rgba(76, 175, 80, 0.05);
  border-left: 3px solid #4caf50;
}

.correct-option .option-indicator {
  background-color: rgba(76, 175, 80, 0.2);
  color: #2e7d32;
}

/* Edit mode styles */
.edit-question-form {
  padding: 0;
}

.question-text-field {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.question-text-field:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.option-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.option-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.option-number-chip {
  font-weight: 500;
  transition: all 0.3s ease;
}

.option-text-field {
  transition: all 0.2s ease;
}

.action-btn {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 8px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
}

.quiz-title-input {
  max-width: 400px;
  font-size: 1.5rem;
  font-weight: bold;
}

.quiz-title-input :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: "Outfit", sans-serif;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .quiz-content {
    margin-right: 0;
    padding: 0 16px;
  }
}
</style>