<template>
  <div class="edit-question-container" v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }">
    <h1 class="text-h5 font-weight-bold mb-6 outfit">Edit Quiz Question</h1>
    
    <v-form ref="editForm" v-model="isFormValid" @submit.prevent="submitEdit">
      <v-text-field
        v-model="questionText"
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
      
      <div v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { delay: 200, duration: 500 } }">
        <v-card 
          v-for="(option, index) in options" 
          :key="index" 
          class="mb-4 pa-4 option-card" 
          :class="{ 'correct-option': option.isCorrect }"
          variant="outlined"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: 100 * index } }">
          <div class="d-flex align-center mb-2">
            <v-chip
              size="small"
              :color="option.isCorrect ? 'success' : 'grey'" 
              class="mr-4 option-number-chip"
            >
              Option {{ index + 1 }}
            </v-chip>
            <v-spacer></v-spacer>
            <div class="correct-option-toggle d-flex align-center">
              <span class="text-caption text-medium-emphasis mr-2">Correct Answer</span>
              <v-switch
                v-model="option.isCorrect"
                hide-details
                density="compact"
                color="success"
                @change="handleCorrectOptionChange(index)"
                :aria-label="`Mark option ${index + 1} as correct answer`"
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
            :placeholder="`Enter option ${index + 1} text`"
            bg-color="surface"
          ></v-text-field>
        </v-card>
      </div>
      
      <div class="form-actions d-flex mt-8" v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 500, duration: 400 } }">
        <v-spacer></v-spacer>
        <v-btn
          type="button"
          color="grey-darken-1"
          variant="text"
          class="me-4 action-btn"
          prepend-icon="mdi-close"
          rounded="xl"
          @click="router.back()"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid || isSubmitting"
          class="action-btn save-btn"
          prepend-icon="mdi-check"
          rounded="xl"
        >
          Save Changes
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = userAuth();

const questionText = ref('');
const options = ref([
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
  { text: '', isCorrect: false },
]);
const isFormValid = ref(false);
const isSubmitting = ref(false);
const editForm = ref(null);

const props = defineProps({
  quizId: {
    type: String,
    required: true,
  },
  questionIndex: {
    type: Number,
    required: true,
  },
  initialQuestion: {
    type: Object,
    default: null,
  }
});

// Ensure only one option is marked as correct
const handleCorrectOptionChange = (changedIndex) => {
  if (options.value[changedIndex].isCorrect) {
    // Uncheck other options
    options.value.forEach((option, index) => {
      if (index !== changedIndex) {
        option.isCorrect = false;
      }
    });
  }
};

// Initialize form with quiz question data
onMounted(async () => {
  if (props.initialQuestion) {
    questionText.value = props.initialQuestion.question;
    
    // If we have options, use them
    if (props.initialQuestion.options && props.initialQuestion.options.length > 0) {
      const initialOptions = [...props.initialQuestion.options];
      
      // Make sure we have at least 4 options
      while (initialOptions.length < 4) {
        initialOptions.push({ text: '', isCorrect: false });
      }
      
      // Map the options to our expected format
      options.value = initialOptions.map(opt => ({
        text: opt.text || '',
        isCorrect: !!opt.isCorrect,
        id: opt.id || null
      }));
    }
  }
  
  // Allow time for initial animations to complete
  await nextTick();
});

const submitEdit = async () => {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  try {
    // Make sure at least one option is marked as correct
    const hasCorrectOption = options.value.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Correct Answer',
        text: 'Please mark at least one option as the correct answer.',
        confirmButtonColor: '#1976d2',
        iconColor: '#ff9800'
      });
      isSubmitting.value = false;
      return;
    }
    
    // Get token
    const token = authStore.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const endpoint = `https://owlmingo-16f448c07f1f.herokuapp.com/api/v1/user/auth/quiz/${props.quizId}/questions/${props.questionIndex}`;
    
    // Prepare payload
    const payload = {
      question: questionText.value,
      options: options.value.map(opt => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        // Include ID if available
        ...(opt.id ? { id: opt.id } : {})
      }))
    };

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update question');
    }

    const responseData = await response.json();
    // console.log('Update response:', responseData);
    
    // Swal.fire({
    //   icon: 'success',
    //   title: 'Success!',
    //   text: 'Question updated successfully!',
    //   timer: 2000,
    //   showConfirmButton: false,
    //   timerProgressBar: true,
    //   iconColor: '#4caf50'
    // });

    // Go back to the quiz review
    setTimeout(() => {
      router.push(`/quiz/review-quiz?id=${props.quizId}`);
    }, 2000);
    
  } catch (error) {
    console.error('Error updating question:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An error occurred while updating the question.',
      confirmButtonColor: '#1976d2',
      iconColor: '#f44336'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
}

.edit-question-container {
  max-width: 800px;
  margin: 0 auto;
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

.correct-option {
  border-left-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
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
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.save-btn {
  position: relative;
  overflow: hidden;
}

.save-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.save-btn:hover::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .correct-option-toggle {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-actions .v-btn {
    width: 100%;
  }
}
</style>
