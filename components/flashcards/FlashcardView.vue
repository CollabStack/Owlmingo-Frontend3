<template>
  <v-container fluid class="pa-0">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Header Section -->
    <FlashcardHeader 
      :deck-title="deckTitle" 
      :mode="'view'"
      @back="navigateToLibrary" 
    />
    
    <!-- Single unified progress bar -->
    <FlashcardProgress 
      :current-index="currentIndex"
      :total-cards="flashcards.length"
      :selected-index="selectedIndex"
    />
    
    <!-- Main Content with Side Mode Selector -->
    <v-row class="ma-0 px-6">
      <!-- Left Side Mode Selector -->
      <v-col cols="12" md="3" class="pa-3">
        <FlashcardModeSelector 
          :modes="modes"
          :selected-index="selectedIndex"
          @update:selected-index="selectedIndex = $event"
        />
      </v-col>
      
      <!-- Right Side Content Area -->
      <v-col cols="12" md="9" class="pa-3">
        <v-window v-model="selectedIndex">
          <!-- FLASHCARD MODE -->
          <v-window-item :value="0">
            <FlashcardStudyMode 
              :flashcards="sortedFlashcards"
              :current-index="currentIndex"
              :is-flipped="isFlipped"
              :card-side-order="cardSideOrder"
              :sort-option="sortOption"
              @flip-card="flipCard"
              @prev-flashcard="prevFlashcard"
              @next-flashcard="nextFlashcard"
              @update:current-index="currentIndex = $event"
              @update:sort-option="sortOption = $event"
              @update:card-side-order="cardSideOrder = $event"
              @open-share-dialog="openShareDialog"
            />
          </v-window-item>

          <!-- EXAM MODE -->
          <v-window-item :value="1">
            <FlashcardExamMode 
              :flashcards="flashcards"
              :quiz-answers="quizAnswers"
              :current-index="currentIndex"
              :user-answer="userAnswer"
              :feedback="feedback"
              :is-submitting="isSubmitting"
              :show-explanation="showExplanation"
              :answer-submitted="answerSubmitted"
              :explanation-text="explanationText"
              @update:user-answer="userAnswer = $event"
              @submit-answer="submitAnswer"
              @toggle-explanation="toggleExplanation"
              @prev-flashcard="prevFlashcard"
              @next-flashcard="nextFlashcard"
              @update:current-index="currentIndex = $event"
            />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    
    <!-- Share Dialog -->
    <FlashcardShareDialog
      v-model="shareDialog"
      :share-link="shareLink"
      :link-copied="linkCopied"
      @copy-link="copyShareLink"
      @close="shareDialog = false"
    />
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useFlashcardStore } from '~/store/flashcardStore';
import { useRoute, useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';

import FlashcardHeader from './components/FlashcardHeader.vue';
import FlashcardProgress from './components/FlashcardProgress.vue';
import FlashcardModeSelector from './components/FlashcardModeSelector.vue';
import FlashcardStudyMode from './components/FlashcardStudyMode.vue';
import FlashcardExamMode from './components/FlashcardExamMode.vue';
import FlashcardShareDialog from './components/FlashcardShareDialog.vue';

// Mode configuration
const modes = [
  { title: 'Flashcards', icon: 'mdi-card-text-outline' },
  { title: 'Exam Mode', icon: 'mdi-brain' }
];

// Stores and routing
const route = useRoute();
const router = useRouter();
const flashcardStore = useFlashcardStore();
const authStore = userAuth();

// Basic data
const flashcards = ref([]);
const backFlashcards = ref([]);
const quizAnswers = ref([]);
const cardIds = ref([]); // Add this to store actual card IDs
const showExplanation = ref(false);
const answerSubmitted = ref(false);
const userAnswer = ref('');
const feedback = ref('');
const currentIndex = ref(0);
const selectedIndex = ref(0);
const isFlipped = ref(false);
const isSubmitting = ref(false);
const loading = ref(true);
const deckTitle = ref('');
const deckId = ref('');
const error = ref(null);

// Initialize with empty objects to prevent errors before data loads
flashcards.value = [{text: '', image: null}];
backFlashcards.value = [{text: '', image: null}];

// Explanation text for exam mode
const explanationText = ref('This is a detailed explanation that helps you understand the correct answer. It provides additional context about why this answer is correct and what concepts are involved.');

// Options
const sortOption = ref('chronological');
const cardSideOrder = ref('front-first');
const shareDialog = ref(false);
const shareLink = ref('');
const linkCopied = ref(false);
const isShared = ref(false);

// Get the deck ID from the URL parameters
onMounted(async () => {
  const id = route.query.id;
  if (!id) {
    error.value = 'No flashcard deck ID provided';
    loading.value = false;
    return;
  }
  
  deckId.value = id;
  await loadFlashcardDeck(id);
});

// Load the flashcard deck from the API
const loadFlashcardDeck = async (globalId) => {
  try {
    loading.value = true;
    
    // Check authentication
    if (!authStore.isLoggedIn) {
      router.push('/auth');
      return;
    }
    
    const result = await flashcardStore.getDeck(globalId);
    
    if (!result.authenticated) {
      router.push('/auth');
      return;
    }
    
    if (result.success) {
      const deck = result.data;
      deckTitle.value = deck.flash_card_title || 'Untitled Deck';
      
      // Format the cards for display and make sure both front and back are populated
      if (deck.cards && deck.cards.length > 0) {
        // Update to capture both text and image URLs
        flashcards.value = deck.cards.map(card => ({
          text: ensureHtmlContent(card.front) || '',
          image: card.frontImage || null
        }));
        
        backFlashcards.value = deck.cards.map(card => ({
          text: ensureHtmlContent(card.back) || '',
          image: card.backImage || null
        }));
        
        quizAnswers.value = deck.cards.map(card => card.back || '');
        cardIds.value = deck.cards.map(card => card._id || ''); // Store the actual card IDs
        
        // Debug log to verify data is loaded correctly
        console.log("Loaded cards:", flashcards.value.length, "with backs:", backFlashcards.value.length);
        console.log("Sample front:", flashcards.value[0]);
        console.log("Sample back:", backFlashcards.value[0]);
        console.log("Sample card ID:", cardIds.value[0]);
      } else {
        error.value = 'This flashcard deck has no cards';
        // Initialize with empty arrays to prevent errors
        flashcards.value = [{text: 'No cards available', image: null}];
        backFlashcards.value = [{text: 'No cards available', image: null}];
      }
      
      isShared.value = deck.isPublic || false;
      
      // Reset state
      currentIndex.value = 0;
      isFlipped.value = false;
      resetQuizState();
    } else {
      error.value = result.error || 'Failed to load flashcard deck';
    }
  } catch (err) {
    console.error('Error loading flashcard deck:', err);
    error.value = err.message || 'An error occurred while loading the flashcard deck';
    // Initialize with empty arrays to prevent errors
    flashcards.value = [{text: 'Error loading cards', image: null}];
    backFlashcards.value = [{text: 'Error loading cards', image: null}];
  } finally {
    loading.value = false;
  }
};

// Helper function to ensure content has proper HTML formatting
const ensureHtmlContent = (content) => {
  if (!content) return '';
  
  // Check if content already has HTML formatting (paragraphs, etc.)
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content);
  
  if (!hasHtmlTags) {
    // If plain text, wrap in paragraph tags
    return `<p>${content}</p>`;
  }
  
  return content;
};

// Computed property for sorted flashcards
const sortedFlashcards = computed(() => {
  if (sortOption.value === 'random') {
    // Create a copy of the arrays and sort them in the same random order
    const indices = [...Array(flashcards.value.length).keys()];
    const shuffled = indices.sort(() => Math.random() - 0.5);
    
    return {
      fronts: shuffled.map(i => flashcards.value[i]),
      backs: shuffled.map(i => backFlashcards.value[i])
    };
  }
  
  return {
    fronts: flashcards.value,
    backs: backFlashcards.value
  };
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
  // Reset flipped state when changing sort
  isFlipped.value = cardSideOrder.value === 'back-first';
});

// Watch for card side order changes
watch(cardSideOrder, () => {
  if (isFlipped.value !== (cardSideOrder.value === 'back-first')) {
    flipCard();
  }
});

// When going to a new card, set the card to show the correct side first
watch(currentIndex, () => {
  isFlipped.value = cardSideOrder.value === 'back-first';
});

// Component methods
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

const navigateToLibrary = () => {
  router.push('/flashcard/library');
};

const submitAnswer = async () => {
  if (isSubmitting.value || !userAnswer.value.trim()) return;
  
  isSubmitting.value = true;
  
  try {
    // Get the actual card ID for the current card
    const cardId = cardIds.value[currentIndex.value];
    
    if (!cardId) {
      console.error('Card ID not found for index:', currentIndex.value);
      throw new Error('Card ID not found');
    }
    
    // Call the API to evaluate the answer with the actual card ID
    const result = await flashcardStore.evaluateAnswer(
      deckId.value,
      cardId, // Use the actual card ID instead of the index
      userAnswer.value
    );
    
    if (result.success) {
      const evaluationResult = result.data;
      
      if (evaluationResult.isCorrect) {
        feedback.value = `🎉 Correct! Your score: ${evaluationResult.score}%`;
      } else {
        feedback.value = `❌ Not quite right. Your score: ${evaluationResult.score}%`;
      }
      
      // Store the feedback for the explanation
      explanationText.value = '';
      
      if (evaluationResult.feedback) {
        if (evaluationResult.feedback.whatWasIncorrect) {
          explanationText.value += `What was incorrect: ${evaluationResult.feedback.whatWasIncorrect}\n\n`;
        }
        
        if (evaluationResult.feedback.whatCouldBeIncluded) {
          explanationText.value += `What could be included: ${evaluationResult.feedback.whatCouldBeIncluded}\n\n`;
        }
        
        if (evaluationResult.feedback.keyPointsCovered && evaluationResult.feedback.keyPointsCovered.length) {
          explanationText.value += `Key points covered: ${evaluationResult.feedback.keyPointsCovered.join(', ')}\n\n`;
        }
        
        if (evaluationResult.feedback.missingPoints && evaluationResult.feedback.missingPoints.length) {
          explanationText.value += `Missing points: ${evaluationResult.feedback.missingPoints.join(', ')}`;
        }
      }
    } else {
      // Simple feedback if API call fails
      if (userAnswer.value.toLowerCase() === backFlashcards.value[currentIndex.value].text.toLowerCase()) {
        feedback.value = '🎉 Correct! Well done!';
      } else {
        feedback.value = '❌ Not quite right.';
      }
    }
  } finally {
    answerSubmitted.value = true;
    isSubmitting.value = false;
  }
};

const toggleExplanation = () => {
  showExplanation.value = !showExplanation.value;
};

const openShareDialog = async () => {
  try {
    // Check if already shared, otherwise toggle sharing
    if (!isShared.value) {
      const result = await flashcardStore.toggleSharing(deckId.value, true);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to share flashcard deck');
      }
      
      isShared.value = true;
    }
    
    // Get the share URL
    shareLink.value = `${window.location.origin}/shared/flashcards/${deckId.value}`;
    shareDialog.value = true;
  } catch (err) {
    console.error('Error sharing flashcard deck:', err);
    Swal.fire({
      icon: 'error',
      title: 'Sharing Error',
      text: err.message || 'An error occurred while trying to share this flashcard deck'
    });
  }
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
/* Background Pattern - consistent with other components */
.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(#7b83e015 1px, rgba(245, 245, 255, 0.8) 1px);
  background-size: 20px 20px;
  opacity: 0.6;
  z-index: -1;
  animation: patternFade 1.5s ease-in;
}

@keyframes patternFade {
  0% { opacity: 0; }
  100% { opacity: 0.6; }
}

/* Transition for switching between modes */
:deep(.v-window__container) {
  transition: all 0.5s ease;
}

:deep(.v-window-item--active) {
  animation: fadeScale 0.5s ease;
}

@keyframes fadeScale {
  0% { 
    opacity: 0;
    transform: scale(0.95);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
  }
}
</style>