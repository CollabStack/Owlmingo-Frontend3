<template>
  <v-card class="content-card" elevation="2" v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
    <v-card-text class="pa-6">
      <div class="exam-mode">
        <!-- Header with cleaner styling -->
        <div class="text-center mb-8">
          <h2 class="text-h5 outfit outfit-semibold mb-2" style="background: linear-gradient(135deg, purple, purple); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Exam Mode</h2>
          <p class="text-body-2 text-grey-darken-1 outfit outfit-regular">
            Test your knowledge by answering the questions
          </p>
        </div>
        
        <!-- Question card styled more like flashcard -->
        <v-card 
          class="flashcard-exam mx-auto mb-6"
          elevation="2"
          rounded="xl"
          v-motion
          :initial="{ y: 20, opacity: 0 }"
          :enter="{ y: 0, opacity: 1, transition: { duration: 400 } }"
          :key="'question-' + currentIndex"
        >
          <div class="card-face exam-question-face">
            <!-- Show image if available - directly without container -->
            <v-img 
              v-if="flashcards?.[currentIndex]?.image" 
              :src="flashcards[currentIndex].image" 
              alt="Question Image" 
              class="card-image mb-4"
              :aspect-ratio="16/9"
              eager
              max-height="200"
              width="95%"
            >
              <!-- Loading overlay -->
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular 
                    indeterminate 
                    color="primary"
                    size="30"
                  ></v-progress-circular>
                </div>
              </template>
              
              <!-- Error handling -->
              <template v-slot:error>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon color="error">mdi-image-off</v-icon>
                </div>
              </template>
            </v-img>
            <div class="card-content outfit outfit-medium" v-html="flashcards?.[currentIndex]?.text || 'Loading...'"></div>
          </div>
        </v-card>
        
        <!-- Answer section with improved animation -->
        <v-sheet 
          color="grey-lighten-5" 
          class="answer-section pa-6 rounded-xl mb-6" 
          elevation="1"
          v-motion
          :initial="{ y: 20, opacity: 0 }"
          :enter="{ y: 0, opacity: 1, transition: { delay: 200, duration: 400 } }"
          :key="'answer-' + currentIndex"
        >
          <p class="text-subtitle-1 outfit outfit-semibold text-grey-darken-2 mb-3">Your Answer:</p>
          
          <v-textarea
            v-model="localUserAnswer" 
            placeholder="Type your answer here..." 
            class="answer-input outfit outfit-regular custom-textarea" 
            variant="outlined"
            :error="!!feedback && feedback.includes('❌')" 
            :success="!!feedback && feedback.includes('🎉')"
            @keyup.ctrl.enter="$emit('submit-answer')"
            :disabled="isSubmitting || answerSubmitted"
            hide-details
            bg-color="white"
            auto-grow
            rows="3"
            counter
          ></v-textarea>
          
          <!-- Submit button -->
          <v-btn 
            v-if="!answerSubmitted"
            @click="$emit('submit-answer')" 
            class="submit-btn animated-btn outfit outfit-medium d-flex align-center justify-center mt-6"
            :disabled="!localUserAnswer || isSubmitting" 
            :loading="isSubmitting" 
            color="exam-btn" 
            block 
            rounded="xl" 
            height="48"
          >
            <span class="d-flex align-center">
              Submit Answer
              <v-icon class="ms-2 btn-icon">mdi-check-circle-outline</v-icon>
            </span>
          </v-btn>
          
          <!-- Review answer button - appears after submission -->
          <v-btn 
            v-if="answerSubmitted && !showExplanation"
            @click="$emit('toggle-explanation')" 
            class="explain-btn animated-btn outfit outfit-medium d-flex align-center justify-center mt-6"
            color="exam-explain" 
            block 
            rounded="xl" 
            height="48"
          >
            <span class="d-flex align-center">
              Review Complete Answer
              <v-icon class="ms-2 btn-icon">mdi-eye-outline</v-icon>
            </span>
          </v-btn>
          
          <!-- Hide explanation button -->
          <v-btn 
            v-if="showExplanation"
            @click="$emit('toggle-explanation')" 
            class="explain-btn animated-btn outfit outfit-medium d-flex align-center justify-center mt-6"
            color="exam-explain-alt" 
            block 
            rounded="xl" 
            height="48"
          >
            <span class="d-flex align-center">
              Hide Answer Details
              <v-icon class="ms-2 btn-icon">mdi-eye-off-outline</v-icon>
            </span>
          </v-btn>
        </v-sheet>
        
        <!-- Feedback badge with improved animation - less intrusive -->
        <transition name="fade-scale">
          <v-card 
            v-if="feedback" 
            :class="['feedback-badge mt-2 mb-6', 
              feedback.includes('❌') ? 'error-badge' : 'success-badge']"
            variant="outlined"
            elevation="0"
            rounded="xl"
          >
            <v-card-text class="pa-3">
              <div class="d-flex align-center justify-center">
                <v-icon 
                  size="small" 
                  :color="feedback.includes('❌') ? 'error' : 'success'" 
                  class="me-2 feedback-icon"
                >
                  {{ feedback.includes('❌') ? 'mdi-close-circle' : 'mdi-checkbox-marked-circle' }}
                </v-icon>
                <span class="outfit outfit-medium text-body-2">
                  {{ feedback.includes('❌') ? 
                    'Not quite right. Check the detailed answer to see why.' : 
                    'Correct! Well done.' }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </transition>
        
        <!-- Explanation card with correct answer - shows ONLY when explanation is requested -->
        <transition name="fade">
          <v-card 
            v-if="showExplanation" 
            class="explanation-card mt-4"
            variant="outlined"
            color="blue-lighten-5"
            elevation="0"
            rounded="xl"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
          >
            <!-- Correct answer section -->
            <v-card-item class="correct-answer-header pa-4" :class="feedback.includes('❌') ? 'error-light-bg' : 'success-light-bg'">
              <template v-slot:prepend>
            <v-icon 
              :style="{ background: 'linear-gradient(135deg, #6a1b9a, #8e24aa)', '-webkit-background-clip': 'text', 'background-clip': 'text', '-webkit-text-fill-color': 'transparent' }" 
              size="x-large" 
              class="me-3 align-self-start answer-icon"
            >
              {{ feedback.includes('❌') ? 'mdi-clipboard-text' : 'mdi-check-decagram' }}
            </v-icon>
              </template>
              <v-card-title class="text-body-1 outfit outfit-semibold pa-0 gradient-answer-text">
            {{ feedback.includes('❌') ? 'Correct answer:' : 'Your answer was correct!' }}
              </v-card-title>
              <v-card-subtitle class="pt-2 text-body-1 outfit correct-answer-text">
            {{ quizAnswers[currentIndex] }}
              </v-card-subtitle>
            </v-card-item>
            
            <v-divider></v-divider>
            
            <!-- Explanation section -->
            <v-card-text class="pa-5">
              <div class="d-flex mb-3 align-items-center">
            <v-icon 
              :style="{ background: 'linear-gradient(135deg, #6a1b9a, #8e24aa)', '-webkit-background-clip': 'text', 'background-clip': 'text', '-webkit-text-fill-color': 'transparent' }" 
              size="x-large" 
              class="me-3 explanation-icon"
            >
              mdi-school
            </v-icon>
            <h3 class="text-body-1 outfit outfit-semibold gradient-explanation-text">Detailed Explanation</h3>
              </div>
              <p class="explanation-text text-body-2 outfit outfit-regular">
            {{ explanationText }}
              </p>
            </v-card-text>
          </v-card>
        </transition>
        
        <!-- Navigation with softer styling -->
        <div class="d-flex justify-center mt-8 navigation-wrapper">
          <v-btn
            :disabled="currentIndex === 0"
            @click="$emit('prev-flashcard')"
            variant="outlined"
            color="exam-btn-outline"
            prepend-icon="mdi-arrow-left-circle"
            class="nav-btn animated-btn outfit outfit-medium me-4 exam-nav-btn"
            rounded="xl"
          >
            Previous
          </v-btn>
          
          <v-btn
            :disabled="currentIndex === flashcards.length - 1"
            @click="$emit('next-flashcard')"
            variant="elevated"
            color="exam-btn"
            append-icon="mdi-arrow-right-circle"
            class="nav-btn animated-btn outfit outfit-medium exam-nav-btn"
            rounded="xl"
          >
            Next
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  flashcards: {
    type: Array,
    required: true
  },
  quizAnswers: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  userAnswer: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  showExplanation: {
    type: Boolean,
    default: false
  },
  answerSubmitted: {
    type: Boolean,
    default: false
  },
  explanationText: {
    type: String,
    default: ''
  }
});

const emit = defineEmits([
  'update:user-answer', 
  'submit-answer', 
  'toggle-explanation', 
  'prev-flashcard', 
  'next-flashcard',
  'update:current-index'
]);

// Use computed property with getter and setter to handle two-way binding
const localUserAnswer = computed({
  get: () => props.userAnswer,
  set: (value) => emit('update:user-answer', value)
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

/* Gradient text styling for headers */
.gradient-text-alt {
  background: linear-gradient(135deg, #a4abe8, #b6adf1); /* Even softer gradient for Exam Mode */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Content card styling */
.content-card {
  border-radius: 16px;
  border: 1px solid rgba(123, 131, 224, 0.12);
  box-shadow: 0 4px 15px rgba(123, 131, 224, 0.05) !important;
  transition: all 0.3s ease;
  background-color: rgba(250, 250, 255, 0.95) !important; /* Very light purple tint */
  overflow: hidden;
}

.content-card:hover {
  box-shadow: 0 6px 20px rgba(123, 131, 224, 0.08) !important;
  transform: translateY(-2px);
}

/* Exam flashcard styling */
.flashcard-exam {
  height: 320px; /* Increased from 280px */
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 16px;
  max-width: 650px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(123, 131, 224, 0.12);
  background: linear-gradient(145deg, rgba(252, 252, 255, 0.98), #f9faff);
  box-shadow: 0 6px 20px rgba(123, 131, 224, 0.08) !important;
}

.flashcard-exam:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(123, 131, 224, 0.12) !important;
}

.exam-question-face {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 1px 1px rgba(123, 131, 224, 0.05);
}

.exam-question-face .card-content {
  font-size: 1.7rem;
  font-weight: 500;
  text-align: center;
  max-width: 90%;
  color: #333;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.card-content :deep(p) {
  margin-top: 0;
  margin-bottom: 1rem;
}

.card-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* Answer section styling */
.answer-section {
  border: 1px solid rgba(123, 131, 224, 0.12);
  background-color: rgba(248, 249, 255, 0.9);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.answer-section:hover {
  box-shadow: 0 5px 15px rgba(123, 131, 224, 0.06);
  background-color: rgba(250, 250, 255, 0.95);
}

.custom-textarea {
  transition: all 0.3s ease;
  background-color: white !important;
  border-radius: 12px;
  border: 1px solid rgba(123, 131, 224, 0.12) !important;
}

.custom-textarea:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 3px 12px rgba(123, 131, 224, 0.05) !important;
  background-color: white !important;
  border-color: rgba(123, 131, 224, 0.20) !important;
}

/* Feedback badge styling - more subtle */
.feedback-badge {
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  border-width: 1px;
  transition: all 0.3s ease;
}

.success-badge {
  background-color: rgba(126, 192, 156, 0.05);
  border-color: rgba(126, 192, 156, 0.2);
}

.error-badge {
  background-color: rgba(239, 108, 108, 0.03);
  border-color: rgba(239, 108, 108, 0.15);
}

/* Explanation card styling with clear sections */
.explanation-card {
  background-color: rgba(248, 250, 255, 0.95);
  border: 1px solid rgba(123, 131, 224, 0.12);
  transition: all 0.3s ease;
}

.correct-answer-header {
  padding: 12px 16px;
  background-color: rgba(249, 249, 255, 0.9) !important;
  border-bottom: 1px solid rgba(139, 144, 232, 0.15);
}

.success-light-bg {
  background-color: rgba(126, 192, 156, 0.08);
}

.error-light-bg {
  background-color: rgba(244, 244, 252, 0.9);
}

.correct-answer-text {
  color: #333 !important;
  font-weight: 500;
  line-height: 1.5;
  font-size: 1.05rem;
}

.explanation-text {
  line-height: 1.8;
  color: #333 !important;
  font-size: 1rem;
}

/* Gradient text styling for titles */
.gradient-answer-text, 
.gradient-explanation-text {
  background: linear-gradient(135deg, rgb(139, 144, 232), rgb(157, 123, 252));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
}

/* Navigation styling */
.navigation-wrapper {
  padding: 0 16px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.navigation-wrapper:hover {
  opacity: 1;
}

.animated-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.animated-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Button styling - lighter colors */
:deep(.v-btn.exam-btn) {
  background: linear-gradient(135deg, #c2c3f2, #b8b5f3) !important;
  color: white !important;
  box-shadow: 0 3px 8px rgba(123, 131, 224, 0.18) !important;
}

:deep(.v-btn.exam-btn:hover) {
  background: linear-gradient(135deg, #c9caf5, #c0bdf6) !important;
  box-shadow: 0 5px 12px rgba(123, 131, 224, 0.22) !important;
}

:deep(.v-btn.exam-btn-outline) {
  color: #aeaef0 !important;
  border-color: #aeaef0 !important;
}

:deep(.v-btn.exam-btn-outline:hover) {
  background-color: rgba(123, 131, 224, 0.04) !important;
  box-shadow: 0 3px 8px rgba(123, 131, 224, 0.08) !important;
}

:deep(.v-btn.exam-explain) {
  background: linear-gradient(135deg, #b5bef1, #b6b6f3) !important;
  color: white !important;
  box-shadow: 0 3px 8px rgba(123, 131, 224, 0.15) !important;
}

:deep(.v-btn.exam-explain:hover) {
  background: linear-gradient(135deg, #bdc5f5, #bebdf6) !important;
  box-shadow: 0 5px 12px rgba(123, 131, 224, 0.20) !important;
  transform: translateY(-2px);
}

:deep(.v-btn.exam-explain-alt) {
  background: linear-gradient(135deg, #b9c1f3, #bbbaf4) !important;
  color: white !important;
  box-shadow: 0 3px 8px rgba(123, 131, 224, 0.12) !important;
}

:deep(.v-btn.exam-explain-alt:hover) {
  background: linear-gradient(135deg, #c2c9f7, #c4c2f7) !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(123, 131, 224, 0.15) !important;
}

.exam-nav-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.exam-nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Animations */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Add animations for the icons */
.feedback-icon {
  animation: pulse 1.5s infinite alternate;
}

.answer-icon {
  animation: fadeIn 1s;
}

.explanation-icon {
  animation: bounce 1s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

/* Responsive design for mobile */
@media (max-width: 960px) {
  .flashcard-exam {
    height: 290px; /* Increased from 250px */
  }
  
  .exam-question-face .card-content {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .flashcard-exam {
    height: 270px; /* Increased from 230px */
  }
  
  .exam-question-face .card-content {
    font-size: 1.3rem;
  }
  
  .explanation-text {
    font-size: 0.9rem;
  }
  
  .navigation-wrapper {
    flex-direction: column;
    gap: 16px;
  }
  
  .exam-nav-btn {
    width: 100%;
  }
}

/* Updated image styling - direct styling without container */
.card-image {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(123, 131, 224, 0.15);
  transition: transform 0.3s ease;
  align-self: center; /* Center the image */
  object-fit: contain; /* Ensure image maintains proportions */
}

.exam-question-face:hover .card-image {
  transform: scale(1.03);
}
</style>
