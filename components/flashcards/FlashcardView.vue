<template>
    <v-container fluid class="pa-0">
      <!-- Background Pattern -->
      <div class="background-pattern"></div>
      <div class="d-flex align-center justify-space-between pa-6 mx-6"
      >
        <p class="text-h5">Flashcards</p>
        <nuxt-link to="/flashcard/library">
        <v-btn class="back-btn align-center" color="primary" 
        variant="outlined" elevation="0"
        rounded="xl"
        >
          <v-icon>mdi-arrow-left</v-icon>
          Back to library
        </v-btn>
      </nuxt-link>
      </div>
      <!-- Progress Bar -->
      <v-progress-linear 
        v-if="selectedIndex === 0" 
        :model-value="(currentIndex / (flashcards.length - 1)) * 100"
        color="primary" 
        height="6" 
        rounded 
        class="mb-4 progress-bar"
      ></v-progress-linear>
  
      <v-row class="fill-height ma-0">
        <!-- Sidebar -->
        <v-col cols="12" md="3" class="pa-4">
          <v-card class="sidebar-card bg-white" elevation="0" v-motion 
            :initial="{ opacity: 0, x: -50 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 500 } }">
            <v-list class="pa-3" nav>
              <v-list-item 
                v-for="(item, index) in menuItems" 
                :key="index" 
                @click="selectItem(index)"
                :class="{ 'selected-item ': selectedIndex === index }" 
                class="sidebar-item mb-3 outfit" 
                v-motion
                :initial="{ opacity: 0, x: -20 }" 
                :enter="{ opacity: 1, x: 0, transition: { delay: index * 150 } }"
                :ripple="false">
                <template v-slot:prepend>
                  <v-icon 
                    :class="{ 'menu-icon': true, 'rotating-icon': selectedIndex === index }"
                    :color="selectedIndex === index ? 'primary' : 'grey'">
                    {{ item.icon }}
                  </v-icon>
                </template>
                <v-list-item-title class="menu-title " :class="{ 'selected-text': selectedIndex === index }">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
  
        <!-- Main Content Area -->
        <v-col cols="12" md="9" class="pa-6">
          <v-card class="content-card bg-white" v-motion 
            :initial="{ opacity: 0, y: 50 }" 
            :enter="{ opacity: 1, y: 0 }">
            <v-card-text class="pa-6">
              <transition name="fade" mode="out-in">
                <!-- Flashcard Mode -->
                <div v-if="selectedIndex === 0" :key="currentIndex" class="flashcard-wrapper">
                  <div class="study-info mb-4">
                    <h2 class="text-h5 outfit">Flashcard Study</h2>
                    <p class="text-body-2 text-grey">
                      Press SPACE to flip | ← → arrows to navigate
                    </p>
                  </div>
  
                  <v-card class="flashcard " @click="flipCard" :class="{ flipped: isFlipped }">
                    <div class="card-inner">
                      <!-- Front face -->
                      <div class="card-face card-front">
                        <div class="card-content outfit">
                          {{ flashcards[currentIndex] }}
                        </div>
                      </div>
  
                      <!-- Back face -->
                      <!-- Back face -->
                      <div class="card-face card-back outfit d-flex flex-column align-center justify-center overflow-auto">
                        <div class="card-content outfit mb-4">
                          {{ backFlashcards[currentIndex] }}
                        </div>
                        <div class="d-flex flex-column align-center">
                          <v-btn 
                            color="primary"
                            variant="tonal"
                            rounded="xl"
                            size="large"
                            elevation="0"
                            class="mb-2 explanation-btn"
                            min-width="180"
                            @click.stop="showExplanation = !showExplanation"
                          >
                            <span class="d-flex align-center">
                              {{ showExplanation ? 'Hide' : 'Explain' }}
                              <v-icon class="ms-1">{{ showExplanation ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </span>
                          </v-btn>
                          <transition name="fade">
                            <p v-if="showExplanation" class="explanation-text text-body-2 text-grey-darken-1 text-center rounded-lg pa-4 mt-4 border bg-hex">
                              This is a detailed explanation of the answer. The explanation helps reinforce learning by providing additional context and clarification.
                            </p>
                          </transition>
                        </div>
                      </div>
                    </div>
                    
                  </v-card>
  
                  <!-- Progress indicator -->
                  <div class="progress-wrapper mt-6">
                    <div class="progress-text outfit">
                      <span class="text-primary font-weight-medium">{{ currentIndex + 1 }}</span>
                      <span class="text-grey-darken-1">/{{ flashcards.length }}</span>
                    </div>
                  </div>
  
                  <!-- Navigation Controls -->
                  <div class="navigation-controls">
                    <v-btn class="nav-btn" 
                      :disabled="currentIndex === 0" 
                      @click.stop="prevFlashcard"
                      icon="mdi-chevron-left" 
                      variant="outlined" 
                      elevation="0">
                    </v-btn>
                    <v-btn class="nav-btn" 
                      :disabled="currentIndex === flashcards.length - 1" 
                      @click.stop="nextFlashcard"
                      icon="mdi-chevron-right" 
                      variant="outlined" 
                      elevation="0">
                    </v-btn>
                  </div>
                </div>
  
                <!-- Quiz Mode -->
                <div v-else class="quiz-container outfit" :key="selectedIndex">
                  <div class="quiz-header mb-6">
                    <h2 class="text-h5">Exam Mode</h2>
                    <p class="text-subtitle-1 text-grey">Question {{ currentIndex + 1 }} of {{ flashcards.length }}</p>
                  </div>
  
                  <div class="quiz-content">
                    <p class="quiz-question mb-4">{{ flashcards[currentIndex] }}</p>
  
                    <v-text-field 
                      v-model="userAnswer" 
                      label="Your Answer" 
                      class="answer-input" 
                      variant="outlined"
                      :error="!!feedback && feedback.includes('❌')" 
                      :success="!!feedback && feedback.includes('🎉')"
                      @keyup.enter="submitAnswer"
                      :disabled="isSubmitting">
                    </v-text-field>
  
                    <v-btn 
                      @click="submitAnswer" 
                      class="submit-btn d-flex align-center justify-center"
                      :disabled="!userAnswer || isSubmitting" 
                      :loading="isSubmitting" 
                      color="primary" 
                      block 
                      rounded="xl" 
                      height="48">
                      <span class="d-flex align-center">
                        Submit Answer
                        <v-icon class="ms-2 btn-icon">mdi-send</v-icon>
                      </span>
                    </v-btn>
  
                    <transition name="scale">
                      <div v-if="feedback" 
                        :class="['feedback-message mt-4', feedback.includes('❌') ? 'error' : 'success']">
                        {{ feedback }}
                      </div>
                    </transition>
                  </div>
                </div>
              </transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  
  const menuItems = ref([
    { title: 'Flashcards', icon: 'mdi-card-text-outline' },
    { title: 'Exam Mode', icon: 'mdi-brain' }
  ]);
  
  const flashcards = ref(['Front of card 1', 'Front of card 2']);
  const backFlashcards = ref(['Back of card 1', 'Back of card 2']);
  const quizAnswers = ref(['Back of card 1', 'Back of card 2']);
  const showExplanation = ref(false);
  const userAnswer = ref('');
  const feedback = ref('');
  const currentIndex = ref(0);
  const selectedIndex = ref(0);
  const isFlipped = ref(false);
  const isSubmitting = ref(false);
  
  // Keyboard navigation
  const handleKeyPress = (e) => {
    if (selectedIndex.value === 0) {
      switch(e.key) {
        case ' ':
          e.preventDefault();
          flipCard();
          break;
        case 'ArrowLeft':
          prevFlashcard();
          break;
        case 'ArrowRight':
          nextFlashcard();
          break;
      }
    }
  };
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress);
  });
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
  });
  
  watch(selectedIndex, (newVal) => {
    if (newVal === 1) {
      resetQuizState();
    }
  });
  
  watch(currentIndex, () => {
    isFlipped.value = false;
    if (selectedIndex.value === 1) {
      resetQuizState();
    }
  });
  
  const resetQuizState = () => {
    userAnswer.value = '';
    feedback.value = '';
    isSubmitting.value = false;
  };
  
  const selectItem = (index) => {
    selectedIndex.value = index;
    currentIndex.value = 0;
  };
  
  const flipCard = () => {
    isFlipped.value = !isFlipped.value;
    // Add haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };
  
  const nextFlashcard = () => {
    if (currentIndex.value < flashcards.value.length - 1) {
      currentIndex.value++;
    }
  };
  
  const prevFlashcard = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };
  
  const submitAnswer = async () => {
    if (isSubmitting.value) return;
    
    isSubmitting.value = true;
    const isCorrect = userAnswer.value.trim().toLowerCase() === 
      quizAnswers.value[currentIndex.value].toLowerCase();
  
    feedback.value = isCorrect ?
      '🎉 Correct! Well done!' :
      '❌ Not quite right. Try again!';
  
    if (isCorrect && currentIndex.value < flashcards.value.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      nextFlashcard();
    }
  
    isSubmitting.value = false;
  };
  </script>
  
  <style scoped>
  /* Base Styles */
  /* @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap'); */
  
  .explanation-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 700;
    backdrop-filter: blur(8px);
  }
  
  .explanation-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
    background: rgba(67, 97, 238, 0.15);
  }
  
  .explanation-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(67, 97, 238, 0.1);
  }
  
  .explanation-text {
    max-width: 90%;
    line-height: 2;
    backdrop-filter: blur(8px);
  }
  
  /* Background Pattern */
  .background-pattern {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(#4361ee15 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
    z-index: -1;
  }
  
  /* Layout */
  .content-card {
    backdrop-filter: blur(10px);
    border-radius: 24px;
    border: 1px solid rgba(67, 97, 238, 0.1);
    box-shadow: var(--card-shadow);
  }
  
  /* Sidebar Styles */
  .sidebar-card {
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(67, 97, 238, 0.1);
  }
  
  .sidebar-item {
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .selected-item {
    background: rgba(67, 97, 238, 0.1);
  }
  
  .menu-icon {
    transition: all 0.3s ease;
  }
  
  .rotating-icon {
    transform: rotate(360deg);
  }
  
  /* Flashcard Styles */
  .flashcard {
    height: 300px;
    perspective: 1500px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .flashcard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(67, 97, 238, 0.15);
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  
  .flashcard.flipped .card-inner {
    transform: rotateY(180deg);
  }
  
  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    
    border-radius: 16px;
    padding: 2rem;
    background: linear-gradient(145deg, #ffffff, #f8faff);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8);
  }
  
  .card-front {
    transform: rotateY(0deg);
  }
  
  .card-back {
    transform: rotateY(180deg);
  }
  
  .card-content {
    font-size: 1.25rem;
    line-height: 1.6;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  /* Progress Styles */
  .progress-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .progress-text {
    display: flex;
    gap: 0.25rem;
    font-size: 1.1rem;
  }
  
  /* Navigation Controls */
  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    gap: 1.5rem;
  }
  
  .nav-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
  }
  
  .nav-btn:hover:not(:disabled) {
    background: rgba(67, 97, 238, 0.1);
    border-color: var(--primary-color);
    transform: scale(1.1);
  }
  
  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Quiz Mode Styles */
  .quiz-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .quiz-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  
  .quiz-question {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--v-primary-base);
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .answer-input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .answer-input:hover {
    transform: translateY(-2px);
  }
  
  .submit-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: none;
    font-weight: 500;
    margin: 1.5rem auto;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
  }
  
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(67, 97, 238, 0.25);
  }
  
  .feedback-message {
    padding: 1rem;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
  }
  
  .feedback-message.success {
    background: rgba(76, 175, 80, 0.1);
    color: var(--success-color);
  }
  
  .feedback-message.error {
    background: rgba(244, 67, 54, 0.1);
    color: var(--error-color);
  }
  
  /* Animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .scale-enter-active,
  .scale-leave-active {
    transition: all 0.3s ease;
  }
  
  .scale-enter-from,
  .scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  
  /* Responsive Design */
  @media (max-width: 960px) {
    .flashcard {
      height: 250px;
    }
  
    .navigation-controls {
      width: 100%;
    }
  }
  
  @media (max-width: 600px) {
    .flashcard {
      height: 200px;
    }
  
    .card-content {
      font-size: 0.9rem;
    }
  
    .feedback-message {
      font-size: 0.9rem;
    }
  }
  </style>