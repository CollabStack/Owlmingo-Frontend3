<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Edit Quiz Question</h1>
    <v-form ref="editForm" v-model="isFormValid" @submit.prevent="submitEdit">
      <v-text-field
        v-model="questionText"
        label="Question Text"
        required
        variant="outlined"
        class="mb-4"
        :rules="[v => !!v || 'Question text is required']"
      ></v-text-field>
      
      <p class="text-subtitle-1 font-weight-medium mb-2">Answer Options</p>
      
      <v-card v-for="(option, index) in options" :key="index" class="mb-4 pa-4" variant="outlined">
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-2 font-weight-medium me-4">Option {{ index + 1 }}</span>
          <v-spacer></v-spacer>
          <v-checkbox
            v-model="option.isCorrect"
            label="Correct Answer"
            class="mt-0"
            hide-details
            density="comfortable"
            @change="handleCorrectOptionChange(index)"
          ></v-checkbox>
        </div>
        
        <v-text-field
          v-model="option.text"
          label="Option Text"
          variant="outlined"
          density="comfortable"
          :rules="[v => !!v || 'Option text is required']"
          required
        ></v-text-field>
      </v-card>
      
      <div class="d-flex mt-6">
        <v-spacer></v-spacer>
        <v-btn
          type="button"
          color="grey-darken-1"
          variant="text"
          class="me-2"
          @click="router.back()"
        >
          Cancel
        </v-btn>
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid || isSubmitting"
        >
          Save Changes
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
onMounted(() => {
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
        text: 'Please mark at least one option as the correct answer.'
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
    console.log('Update response:', responseData);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Question updated successfully!',
      timer: 2000,
      showConfirmButton: false
    });

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
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
