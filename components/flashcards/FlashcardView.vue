<template>
  <v-container fluid class="pa-0">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Header Section with proper styling -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between pa-6">
      <h1 class="text-h4 font-weight-bold outfit outfit-bold gradient-text mb-4 mb-md-0">Flashcards</h1>
      <nuxt-link to="/flashcard/library">
        <v-btn 
          class="back-btn animated-btn outfit outfit-medium d-flex align-center" 
          color="primary" 
          variant="outlined" 
          elevation="0"
          rounded="xl"
          prepend-icon="mdi-arrow-left"
        >
          Back to library
        </v-btn>
      </nuxt-link>
    </div>
    
    <!-- Single unified progress bar -->
    <div class="progress-container mx-6 mb-6">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-body-2 outfit outfit-medium text-grey-darken-1">{{ selectedIndex === 0 ? 'Card' : 'Question' }} {{ currentIndex + 1 }} of {{ flashcards.length }}</span>
        <span class="text-body-2 outfit outfit-medium text-grey-darken-1">{{ Math.round((currentIndex / (flashcards.length - 1)) * 100) }}% complete</span>
      </div>
      <v-progress-linear
        :model-value="(currentIndex / (flashcards.length - 1)) * 100"
        color="primary"
        height="8"
        rounded
        bg-color="grey-lighten-4"
        class="progress-bar"
      ></v-progress-linear>
    </div>
    
    <!-- Main Content with Side Mode Selector -->
    <v-row class="ma-0 px-6">
      <!-- Left Side Mode Selector -->
      <v-col cols="12" md="3" class="pa-3">
        <div class="mode-selector-panel">
          <div 
            v-for="(mode, index) in modes" 
            :key="index"
            @click="selectedIndex = index"
            :class="[
              'mode-card-rect', 
              selectedIndex === index ? 'mode-card-rect-active' : '',
            ]"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: index * 100 } }"
          >
            <div class="mode-card-content-rect">
              <v-icon 
                :color="selectedIndex === index ? 'white' : 'grey'"
                size="medium"
                class="mode-icon-rect me-3"
              >
                {{ mode.icon }}
              </v-icon>
              <span class="mode-title-rect outfit outfit-medium">{{ mode.title }}</span>
            </div>
            <div :class="['mode-indicator-rect', selectedIndex === index ? 'mode-indicator-rect-active' : '']"></div>
          </div>
        </div>
      </v-col>
      
      <!-- Right Side Content Area -->
      <v-col cols="12" md="9" class="pa-3">
        <v-window v-model="selectedIndex">
          <!-- FLASHCARD MODE -->
          <v-window-item :value="0">
            <v-card class="content-card" elevation="3" v-motion
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
              <v-card-text class="pa-6">
                <div class="flashcard-mode">
                  <v-card 
                    class="flashcard mx-auto mb-6"
                    @click="flipCard" 
                    :class="{ flipped: isFlipped }" 
                    elevation="4"
                    rounded="xl"
                    v-motion
                    :initial="{ scale: 0.95, opacity: 0.9 }"
                    :enter="{ scale: 1, opacity: 1, transition: { duration: 300 } }"
                    :visible="{ scale: 1, opacity: 1 }"
                    :hovered="{ y: -5 }"
                  >
                    <div class="card-inner">
                      <!-- Front face with enhanced styling -->
                      <div class="card-face card-front">
                        <div class="card-content outfit outfit-medium">
                          {{ flashcards[currentIndex] }}
                        </div>
                        <div class="flip-hint">
                          <v-icon size="small">mdi-gesture-tap</v-icon>
                          <span class="outfit outfit-regular">Tap to flip</span>
                        </div>
                      </div>

                      <!-- Back face with enhanced styling - removed explanation features -->
                      <div class="card-face card-back outfit">
                        <div class="card-content outfit outfit-medium">
                          {{ backFlashcards[currentIndex] }}
                        </div>
                      </div>
                    </div>
                  </v-card>

                  <!-- Navigation controls with cleaner styling -->
                  <div class="navigation-controls mb-6">
                    <div class="d-flex align-center justify-center">
                      <v-btn 
                        class="nav-btn animated-btn-alt me-4" 
                        :disabled="currentIndex === 0" 
                        @click.stop="prevFlashcard"
                        icon="mdi-chevron-left" 
                        variant="outlined" 
                        color="primary"
                        elevation="1"
                        rounded="xl"
                      ></v-btn>
                      
                      <div class="progress-dots d-flex">
                        <div 
                          v-for="(_, index) in flashcards" 
                          :key="index"
                          @click="currentIndex = index"
                          :class="['progress-dot', { 'active': currentIndex === index }]"
                        ></div>
                      </div>
                      
                      <v-btn 
                        class="nav-btn animated-btn-alt ms-4" 
                        :disabled="currentIndex === flashcards.length - 1" 
                        @click.stop="nextFlashcard"
                        icon="mdi-chevron-right" 
                        variant="outlined" 
                        color="primary"
                        elevation="1"
                        rounded="xl"
                      ></v-btn>
                    </div>
                  </div>
                  
                  <!-- Controls with cleaner styling -->
                  <v-divider class="mb-4"></v-divider>
                  <div class="d-flex flex-wrap align-center justify-space-between">
                    <div class="sorting-controls">
                      <span class="text-body-2 text-grey-darken-1 me-3 outfit outfit-regular">Sort by:</span>
                      <v-btn-toggle v-model="sortOption" color="primary" rounded="lg" density="comfortable">
                        <v-btn value="chronological" class="outfit outfit-medium px-3">
                          <v-icon start size="small">mdi-sort-alphabetical-ascending</v-icon>
                          Chronological
                        </v-btn>
                        <v-btn value="random" class="outfit outfit-medium px-3">
                          <v-icon start size="small">mdi-shuffle</v-icon>
                          Random
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                    
                    <v-btn
                      prepend-icon="mdi-share-variant"
                      class="share-btn animated-btn outfit outfit-medium mt-3 mt-sm-0"
                      color="primary"
                      variant="text"
                      @click="openShareDialog"
                    >
                      Share deck
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- EXAM MODE with improved layout -->
          <v-window-item :value="1">
            <v-card class="content-card" elevation="3" v-motion
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
              <v-card-text class="pa-6">
                <div class="exam-mode">
                  <!-- Header with cleaner styling -->
                  <div class="text-center mb-8">
                    <h2 class="text-h5 outfit outfit-semibold mb-2 gradient-text-alt">Exam Mode</h2>
                    <p class="text-body-2 text-grey-darken-1 outfit outfit-regular">
                      Test your knowledge by answering the questions
                    </p>
                  </div>
                  
                  <!-- Question card styled more like flashcard -->
                  <v-card 
                    class="flashcard-exam mx-auto mb-6"
                    elevation="4"
                    rounded="xl"
                    v-motion
                    :initial="{ y: 20, opacity: 0 }"
                    :enter="{ y: 0, opacity: 1, transition: { duration: 400 } }"
                    :key="'question-' + currentIndex"
                  >
                    <div class="card-face exam-question-face">
                      <div class="card-content outfit outfit-medium">
                        {{ flashcards[currentIndex] }}
                      </div>
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
                      v-model="userAnswer" 
                      placeholder="Type your answer here..." 
                      class="answer-input outfit outfit-regular custom-textarea" 
                      variant="outlined"
                      :error="!!feedback && feedback.includes('❌')" 
                      :success="!!feedback && feedback.includes('🎉')"
                      @keyup.ctrl.enter="submitAnswer"
                      :disabled="isSubmitting || showExplanation"
                      hide-details
                      bg-color="white"
                      auto-grow
                      rows="3"
                      counter
                    ></v-textarea>
                    
                    <!-- Submit button -->
                    <v-btn 
                      v-if="!showExplanation && !answerSubmitted"
                      @click="submitAnswer" 
                      class="submit-btn animated-btn outfit outfit-medium d-flex align-center justify-center mt-6"
                      :disabled="!userAnswer || isSubmitting" 
                      :loading="isSubmitting" 
                      color="exam-btn" 
                      block 
                      rounded="xl" 
                      height="48"
                    >
                      <span class="d-flex align-center">
                        Submit Answer
                        <v-icon class="ms-2 btn-icon">mdi-send</v-icon>
                      </span>
                    </v-btn>
                    
                    <!-- Explain button - appears after submission -->
                    <v-btn 
                      v-if="answerSubmitted && !showExplanation"
                      @click="toggleExplanation" 
                      class="explain-btn animated-btn outfit outfit-medium d-flex align-center justify-center mt-6"
                      color="exam-explain" 
                      block 
                      rounded="xl" 
                      height="48"
                    >
                      <span class="d-flex align-center">
                        Explain Answer
                        <v-icon class="ms-2 btn-icon">mdi-book-open-variant</v-icon>
                      </span>
                    </v-btn>
                    
                    <!-- Hide explanation button -->
                    <v-btn 
                      v-if="showExplanation"
                      @click="toggleExplanation" 
                      class="explain-btn animated-btn outfit outfit-medium d-flex align-center justify-center mt-6"
                      color="exam-explain-alt" 
                      block 
                      rounded="xl" 
                      height="48"
                    >
                      <span class="d-flex align-center">
                        Hide Explanation
                        <v-icon class="ms-2 btn-icon">mdi-chevron-up</v-icon>
                      </span>
                    </v-btn>
                  </v-sheet>
                  
                  <!-- Feedback card with improved animation -->
                  <transition name="bounce">
                    <v-card 
                      v-if="feedback" 
                      :class="['feedback-card mt-6', feedback.includes('❌') ? 'error-card' : 'success-card']"
                      variant="tonal"
                      elevation="1"
                      rounded="xl"
                    >
                      <v-card-text class="pa-4">
                        <div class="d-flex align-center">
                          <v-icon size="large" :color="feedback.includes('❌') ? 'error' : 'success'" class="me-3">
                            {{ feedback.includes('❌') ? 'mdi-close-circle' : 'mdi-check-circle' }}
                          </v-icon>
                          <span class="outfit outfit-medium text-body-1">{{ feedback }}</span>
                        </div>
                        
                        <div v-if="feedback.includes('❌')" class="correct-answer-container mt-3 pa-3">
                          <div class="d-flex align-center mb-1">
                            <v-icon color="primary" size="small" class="me-2">mdi-information-outline</v-icon>
                            <span class="text-body-2 outfit outfit-semibold">Correct answer:</span>
                          </div>
                          <p class="text-body-1 outfit correct-answer-text ml-6">
                            {{ quizAnswers[currentIndex] }}
                          </p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </transition>
                  
                  <!-- Explanation card - shows when explanation is requested -->
                  <transition name="fade">
                    <v-card 
                      v-if="showExplanation" 
                      class="explanation-card mt-6"
                      variant="tonal"
                      color="blue-lighten-5"
                      elevation="1"
                      rounded="xl"
                      v-motion
                      :initial="{ opacity: 0, y: 20 }"
                      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
                    >
                      <v-card-text class="pa-5">
                        <div class="d-flex mb-3">
                          <v-icon color="primary" class="me-3 mt-1">mdi-lightbulb-on</v-icon>
                          <h3 class="text-body-1 outfit outfit-semibold">Explanation</h3>
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
                      @click="prevFlashcard"
                      variant="outlined"
                      color="exam-btn-outline"
                      prepend-icon="mdi-arrow-left"
                      class="nav-btn animated-btn outfit outfit-medium me-4 exam-nav-btn"
                      rounded="xl"
                    >
                      Previous
                    </v-btn>
                    
                    <v-btn
                      :disabled="currentIndex === flashcards.length - 1"
                      @click="nextFlashcard"
                      variant="elevated"
                      color="exam-btn"
                      append-icon="mdi-arrow-right"
                      class="nav-btn animated-btn outfit outfit-medium exam-nav-btn"
                      rounded="xl"
                    >
                      Next
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    
    <!-- Share Dialog with improved styling -->
    <v-dialog v-model="shareDialog" max-width="500px" transition="dialog-bottom-transition">
      <v-card class="pa-4 share-dialog" rounded="xl">
        <v-card-title class="text-h5 outfit outfit-semibold d-flex align-center">
          <v-icon color="primary" class="me-2">mdi-share-variant</v-icon>
          Share Flashcard Deck
        </v-card-title>
        <v-card-text>
          <p class="mb-4 outfit outfit-regular">Share this link with others:</p>
          <v-text-field
            v-model="shareLink"
            readonly
            variant="outlined"
            append-inner-icon="mdi-content-copy"
            @click:append-inner="copyShareLink"
            class="custom-input"
            bg-color="grey-lighten-5"
          ></v-text-field>
          <v-slide-y-transition>
            <v-alert
              v-if="linkCopied"
              type="success"
              variant="tonal"
              class="mt-3"
              density="compact"
              icon="mdi-check-circle"
            >
              Link copied to clipboard!
            </v-alert>
          </v-slide-y-transition>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" variant="text" class="outfit outfit-medium" @click="shareDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

// Mode configuration
const modes = [
  { title: 'Flashcards', icon: 'mdi-card-text-outline' },
  { title: 'Exam Mode', icon: 'mdi-brain' }
];

// Basic data
const flashcards = ref(['Front of card 1', 'Front of card 2']);
const backFlashcards = ref(['Back of card 1', 'Back of card 2']);
const quizAnswers = ref(['Back of card 1', 'Back of card 2']);
const showExplanation = ref(false);
const answerSubmitted = ref(false);
const userAnswer = ref('');
const feedback = ref('');
const currentIndex = ref(0);
const selectedIndex = ref(0);
const isFlipped = ref(false);
const isSubmitting = ref(false);

// Explanation text for exam mode
const explanationText = ref('This is a detailed explanation that helps you understand the correct answer. It provides additional context about why this answer is correct and what concepts are involved.');

// Options
const sortOption = ref('chronological');
const shareDialog = ref(false);
const shareLink = ref('');
const linkCopied = ref(false);

// Computed property for sorted flashcards
const sortedFlashcards = computed(() => {
  if (sortOption.value === 'random') {
    return [...flashcards.value].sort(() => Math.random() - 0.5);
  }
  return flashcards.value;
});

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
  isFlipped.value = false;
  currentIndex.value = 0;
});

watch(currentIndex, () => {
  isFlipped.value = false;
  if (selectedIndex.value === 1) {
    resetQuizState();
  }
});

watch(sortOption, () => {
  currentIndex.value = 0;
});

const resetQuizState = () => {
  userAnswer.value = '';
  feedback.value = '';
  isSubmitting.value = false;
  showExplanation.value = false;
  answerSubmitted.value = false;
};

const flipCard = () => {
  isFlipped.value = !isFlipped.value;
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

  if (isCorrect) {
    feedback.value = '🎉 Correct! Well done!';
  } else {
    feedback.value = '❌ Not quite right.';
  }
  
  answerSubmitted.value = true;
  isSubmitting.value = false;
};

const toggleExplanation = () => {
  showExplanation.value = !showExplanation.value;
};

const openShareDialog = () => {
  shareDialog.value = true;
  shareLink.value = `https://owlmingo.com/share/flashcards/${Date.now().toString(36)}`;
};

const copyShareLink = () => {
  navigator.clipboard.writeText(shareLink.value).then(() => {
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 3000);
  });
};
</script>

<style scoped>
/* Import Outfit font */
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

/* Gradient text styling for headers */
.gradient-text {
  background: linear-gradient(135deg, #7b83e0, #9D7BFC);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text-alt {
  background: linear-gradient(135deg, #7d8ced, #7e81e8); /* Softer gradient for Exam Mode */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Background Pattern - consistent with other components */
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(#7b83e015 1px, rgba(245, 245, 255, 0.8) 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  z-index: -1;
}

/* Progress container - unified styling */
.progress-container {
  transition: all 0.3s ease;
}

/* Progress bar */
.progress-bar {
  box-shadow: 0 2px 5px rgba(137, 158, 255, 0.1);
}

/* Progress dots */
.progress-dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 0 10px;
  max-width: 70%;
  overflow-x: auto;
  padding: 10px 0;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(123, 131, 224, 0.2); /* Light purple instead of gray */
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress-dot:hover {
  background-color: rgba(123, 131, 224, 0.4); /* Medium purple instead of darker gray */
}

.progress-dot.active {
  background-color: #7b83e0; /* Full purple color */
  transform: scale(1.3);
}

/* Content card styling */
.content-card {
  border-radius: 16px;
  border: 1px solid rgba(123, 131, 224, 0.15);
  box-shadow: 0 8px 20px rgba(123, 131, 224, 0.08) !important;
  transition: all 0.3s ease;
  background-color: rgba(250, 250, 255, 0.95) !important; /* Very light purple tint */
  overflow: hidden;
}

.content-card:hover {
  box-shadow: 0 12px 30px rgba(123, 131, 224, 0.12) !important;
  transform: translateY(-3px);
}

/* Mode Selector Styling */
.mode-selector {
  margin-bottom: 20px;
}

.mode-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 30px;
  margin: 0 10px 10px;
  border-radius: 14px;
  background-color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  min-width: 160px;
}

.mode-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.mode-card-active {
  background-color: rgba(67, 97, 238, 0.05);
  box-shadow: 0 6px 15px rgba(67, 97, 238, 0.15);
}

.mode-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.mode-icon {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mode-card-active .mode-icon {
  transform: scale(1.2);
}

.mode-title {
  font-size: 1rem;
  transition: color 0.3s ease, font-weight 0.3s ease;
  color: #757575;
}

.mode-card-active .mode-title {
  color: var(--v-primary-base);
  font-weight: 600;
}

.mode-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background-color: transparent;
  transition: background-color 0.3s ease, transform 0.3s ease;
  transform: scaleX(0);
  transform-origin: center;
}

.mode-indicator-active {
  background-color: var(--v-primary-base);
  transform: scaleX(1);
}

/* Enhanced flashcard styling */
.flashcard {
  height: 340px;
  perspective: 1500px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 16px;
  max-width: 650px;
  margin: 0 auto;
}

.flashcard:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(67, 97, 238, 0.15) !important;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  padding: 2.5rem;
  background: linear-gradient(145deg, rgba(250, 250, 255, 0.95), #f8faff);
  box-shadow: inset 0 1px 1px rgba(123, 131, 224, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-front {
  transform: rotateY(0deg);
  position: relative;
}

.card-back {
  transform: rotateY(180deg);
}

.card-content {
  font-size: 1.5rem;
  line-height: 1.6;
  text-align: center;
  transition: all 0.3s ease;
  max-width: 90%;
}

.flip-hint {
  position: absolute;
  bottom: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(123, 131, 224, 0.7); /* Purple instead of gray */
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.flashcard:hover .flip-hint {
  opacity: 1;
}

/* Navigation controls */
.navigation-controls {
  padding: 0 16px;
}

.nav-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animated-btn-alt {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animated-btn-alt:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
}

.animated-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Explanation box */
.explanation-box {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(67, 97, 238, 0.1);
  border-radius: 12px;
  padding: 16px;
  max-width: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.explanation-text {
  line-height: 1.8;
}

.explanation-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.explanation-btn:hover {
  transform: translateY(-2px);
  background: rgba(67, 97, 238, 0.1);
}

/* Share button and dialog */
.share-btn {
  transition: all 0.2s ease;
}

.share-btn:hover {
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

.share-dialog {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(67, 97, 238, 0.1);
}

/* Exam mode styling */
.question-card {
  border-left: 4px solid rgba(123, 131, 224, 0.6); /* Even softer border color */
  background: linear-gradient(145deg, rgba(250, 250, 255, 0.95), #f6f7ff); /* Softer background */
  border: 1px solid rgba(123, 131, 224, 0.15);
  box-shadow: 0 4px 12px rgba(123, 131, 224, 0.08); /* Softer shadow */
}

.answer-section {
  border: 1px solid rgba(123, 131, 224, 0.15);
  background-color: rgba(245, 246, 255, 0.8); /* Softer background */
  transition: all 0.3s ease;
}

.answer-section:hover {
  box-shadow: 0 8px 20px rgba(123, 131, 224, 0.1); /* Softer shadow on hover */
}

/* Softer colors for exam mode buttons */
:deep(.v-btn.exam-btn) {
  background: linear-gradient(135deg, #bec0f7, #b5aef6) !important; /* Even softer, younger purple */
  color: rgba(250, 250, 255, 0.95) !important; /* Off-white text */
  box-shadow: 0 4px 10px rgba(123, 131, 224, 0.25) !important;
}

:deep(.v-btn.exam-btn:hover) {
  background: linear-gradient(135deg, #c4c6f8, #bbb5f7) !important; /* Even lighter on hover */
  box-shadow: 0 6px 15px rgba(123, 131, 224, 0.3) !important;
}

:deep(.v-btn.exam-btn-outline) {
  color: #b5aef6 !important;
  border-color: #b5aef6 !important;
}

:deep(.v-btn.exam-btn-outline:hover) {
  background-color: rgba(123, 131, 224, 0.08) !important;
  box-shadow: 0 4px 10px rgba(123, 131, 224, 0.15) !important;
}

.exam-nav-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.exam-nav-btn:hover:not(:disabled) {
  transform: translateY(-3px);
}

/* Custom textarea styling for exam mode */
.custom-textarea {
  transition: all 0.3s ease;
  background-color: rgba(250, 250, 255, 0.95) !important; /* Very light purple tint */
  border-radius: 12px;
  border: 1px solid rgba(123, 131, 224, 0.2) !important;
}

.custom-textarea:focus-within {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(123, 131, 224, 0.12) !important;
  background-color: rgba(250, 250, 255, 0.98) !important;
  border-color: rgba(123, 131, 224, 0.3) !important;
}

/* Feedback cards with softer colors */
.success-card {
  background-color: rgba(126, 192, 156, 0.06); /* Even softer green */
  border: 1px solid rgba(126, 192, 156, 0.15);
}

.error-card {
  background-color: rgba(239, 108, 108, 0.04); /* Even softer red */
  border: 1px solid rgba(239, 108, 108, 0.12);
}

/* Navigation wrapper */
.navigation-wrapper {
  padding: 0 16px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.navigation-wrapper:hover {
  opacity: 1;
}

/* Custom textarea styling */
.custom-textarea {
  transition: all 0.3s ease;
  background-color: white !important;
  border-radius: 12px;
  border: 1px solid rgba(123, 131, 224, 0.15) !important; /* Softer border */
}

.custom-textarea:focus-within {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(123, 131, 224, 0.08) !important; /* Softer shadow */
  background-color: white !important;
  border-color: rgba(123, 131, 224, 0.25) !important; /* Softer focus border */
}

/* Enhanced animations */
.bounce-enter-active {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.bounce-leave-active {
  animation: bounceOut 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes bounceOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.scale-enter-active, .scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive design */
@media (max-width: 960px) {
  .flashcard {
    height: 300px;
  }
  
  .card-content {
    font-size: 1.25rem;
  }

  .progress-dots {
    max-width: 60%;
  }
}

@media (max-width: 600px) {
  .flashcard {
    height: 260px;
  }

  .card-content {
    font-size: 1.1rem;
  }
  
  .explanation-text {
    font-size: 0.9rem;
  }
  
  .card-face {
    padding: 1.5rem;
  }

  .progress-dots {
    max-width: 50%;
  }

  .navigation-wrapper {
    flex-direction: column;
    gap: 16px;
  }

  .navigation-wrapper .nav-btn {
    width: 100%;
  }
}

/* Vertical Mode Selector Panel Styling */
.mode-selector-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.mode-card-rect {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 16px;  /* Increased vertical padding */
  min-height: 90px;    /* Increased height for better visibility */
  border-radius: 12px;
  background-color: rgba(250, 250, 255, 0.9); /* Very light purple tint instead of white */
  box-shadow: 0 3px 10px rgba(123, 131, 224, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  border-left: 4px solid transparent;
}

.mode-card-rect:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 15px rgba(123, 131, 224, 0.15);
}

.mode-card-rect-active {
  background: linear-gradient(135deg, #7b83e0, #9D7BFC); /* Updated to match brand gradient */
  box-shadow: 0 6px 15px rgba(187, 166, 247, 0.3); /* Updated shadow color to match */
  border-left: 4px solid #9a99fa;
}

.mode-card-content-rect {
  display: flex;
  align-items: center;
  z-index: 2;
  width: 100%;
}

.mode-icon-rect {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-right: 16px;
  font-size: 28px; /* Larger icon for better visibility */
}

.mode-card-rect-active .mode-icon-rect {
  transform: scale(1.2);
  color: white !important; /* Force white icon color when active */
}

.mode-title-rect {
  font-size: 1.2rem; /* Increased font size */
  transition: color 0.3s ease, font-weight 0.3s ease;
  color: rgba(123, 131, 224, 0.8); /* Purple instead of gray */
}

.mode-card-rect-active .mode-title-rect {
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25); /* Enhanced text shadow for better readability */
  letter-spacing: 0.5px;
}

.mode-indicator-rect {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: transparent;
  transition: all 0.3s ease;
}

.mode-indicator-rect-active {
  background-color: #997cf9; /* Matched with left border */
}

/* Enhanced responsive design for side panel */
@media (max-width: 960px) {
  .mode-selector-panel {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .mode-card-rect {
    width: 45%;
    border-left: none;
    border-bottom: 4px solid transparent;
    min-height: 70px; /* Adjusted for horizontal layout */
  }
  
  .mode-card-rect-active {
    border-left: none;
    border-bottom: 4px solid #6e6bfa;
  }
  
  .mode-card-rect:hover {
    transform: translateY(-5px);
  }
  
  .mode-card-content-rect {
    justify-content: center;
  }
  
  .mode-title-rect {
    font-size: 1rem;
  }
  
  .mode-indicator-rect {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    height: 4px;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .mode-card-rect {
    width: 100%;
    padding: 16px;
    min-height: 60px; /* Slightly smaller on mobile */
  }
  
  .mode-card-content-rect {
    justify-content: flex-start;
  }
  
  .mode-icon-rect {
    margin-right: 10px;
  }
}

/* Exam mode flashcard styling */
.flashcard-exam {
  height: 280px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 16px;
  max-width: 650px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(123, 131, 224, 0.15);
  background: linear-gradient(145deg, rgba(250, 250, 255, 0.95), #f8faff);
  box-shadow: 0 8px 25px rgba(123, 131, 224, 0.12) !important;
}

.flashcard-exam:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(67, 97, 238, 0.15) !important;
}

.exam-question-face {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 1px 1px rgba(123, 131, 224, 0.1);
}

/* Explanation card styling */
.explanation-card {
  background-color: rgba(240, 245, 255, 0.8);
  border: 1px solid rgba(123, 131, 224, 0.15);
  transition: all 0.3s ease;
}

.explanation-text {
  line-height: 1.8;
  color: #555;
}

/* Explain button styling */
:deep(.v-btn.exam-explain) {
  background: linear-gradient(135deg, #94a6f0, #9b9bf6) !important; /* Slightly different than exam-btn */
  color: rgba(250, 250, 255, 0.95) !important;
  box-shadow: 0 4px 10px rgba(123, 131, 224, 0.2) !important;
}

:deep(.v-btn.exam-explain:hover) {
  background: linear-gradient(135deg, #9bacf5, #a2a2fb) !important;
  box-shadow: 0 6px 15px rgba(123, 131, 224, 0.25) !important;
  transform: translateY(-3px);
}

:deep(.v-btn.exam-explain-alt) {
  background: linear-gradient(135deg, #9eaaf0, #a1a0f5) !important;
  color: rgba(250, 250, 255, 0.95) !important;
  box-shadow: 0 4px 10px rgba(123, 131, 224, 0.15) !important;
}

:deep(.v-btn.exam-explain-alt:hover) {
  background: linear-gradient(135deg, #aab4f5, #adacf8) !important;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(123, 131, 224, 0.2) !important;
}

/* Improved feedback card styling */
.correct-answer-container {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border-left: 3px solid rgba(123, 131, 224, 0.6);
}

.correct-answer-text {
  color: #4a4a4a;
  line-height: 1.5;
  margin-top: 4px;
}
</style>