<template>
  <v-card class="content-card" elevation="3" v-motion
    :initial="{ opacity: 0, y: 50 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
    <v-card-text class="pa-6">
      <div class="flashcard-mode">
        <v-card 
          class="flashcard mx-auto mb-6"
          @click="$emit('flip-card')" 
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
                {{ flashcards.fronts[currentIndex] }}
              </div>
              <div class="flip-hint">
                <v-icon size="small" color="grey-darken-1">mdi-gesture-tap</v-icon>
                <span class="outfit outfit-regular text-grey-darken-1">Tap to flip</span>
              </div>
            </div>

            <!-- Back face with enhanced styling -->
            <div class="card-face card-back outfit">
              <div class="card-content outfit outfit-medium">
                {{ flashcards.backs[currentIndex] }}
              </div>
              <div class="flip-hint">
                <v-icon size="small" color="grey-darken-1">mdi-gesture-tap</v-icon>
                <span class="outfit outfit-regular text-grey-darken-1">Tap to flip</span>
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
              @click.stop="$emit('prev-flashcard')"
              icon="mdi-chevron-left" 
              variant="outlined" 
              color="primary"
              elevation="1"
              rounded="xl"
            ></v-btn>
            
            <div class="progress-dots d-flex">
              <div 
                v-for="(_, index) in flashcards.fronts" 
                :key="index"
                @click="$emit('update:current-index', index)"
                :class="['progress-dot', { 'active': currentIndex === index }]"
              ></div>
            </div>
            
            <v-btn 
              class="nav-btn animated-btn-alt ms-4" 
              :disabled="currentIndex === flashcards.fronts.length - 1" 
              @click.stop="$emit('next-flashcard')"
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
        <div class="d-flex flex-wrap align-center">
          <div class="d-flex flex-wrap align-center me-4 mb-3 mb-md-0">
            <span class="text-body-2 text-grey-darken-1 me-3 outfit outfit-regular">Sort by:</span>
            <v-btn-toggle v-model="localSortOption" color="primary" rounded="lg" density="comfortable">
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
          
          <div class="d-flex align-center">
            <span class="text-body-2 text-grey-darken-1 me-3 outfit outfit-regular">Card order:</span>
            <v-btn-toggle v-model="localCardSideOrder" color="primary" rounded="lg" density="comfortable">
              <v-btn value="front-first" class="outfit outfit-medium px-3">
                <v-icon start size="small">mdi-card-text-outline</v-icon>
                Front First
              </v-btn>
              <v-btn value="back-first" class="outfit outfit-medium px-3">
                <v-icon start size="small">mdi-card-text</v-icon>
                Back First
              </v-btn>
            </v-btn-toggle>
          </div>
          
          <v-spacer></v-spacer>
          
          <v-btn
            prepend-icon="mdi-share-variant"
            class="share-btn animated-btn outfit outfit-medium mt-3 mt-sm-0"
            color="primary"
            variant="text"
            @click="$emit('open-share-dialog')"
          >
            Share deck
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
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  isFlipped: {
    type: Boolean,
    default: false
  },
  cardSideOrder: {
    type: String,
    default: 'front-first'
  },
  sortOption: {
    type: String,
    default: 'chronological'
  }
});

const emit = defineEmits([
  'flip-card', 
  'prev-flashcard', 
  'next-flashcard', 
  'update:current-index', 
  'update:sort-option', 
  'update:card-side-order',
  'open-share-dialog'
]);

// Use computed properties with getters and setters to enable two-way binding
const localSortOption = computed({
  get: () => props.sortOption,
  set: (value) => emit('update:sort-option', value)
});

const localCardSideOrder = computed({
  get: () => props.cardSideOrder,
  set: (value) => emit('update:card-side-order', value)
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

/* Enhanced flashcard styling */
.flashcard {
  height: 340px;
  perspective: 1500px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 16px;
  max-width: 650px;
  margin: 0 auto;
  will-change: transform;
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

/* Fixed card face positioning */
.card-face {
  position: absolute; /* Changed from relative to absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
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
}

.card-back {
  transform: rotateY(180deg);
}

.card-content {
  font-size: 1.8rem;
  line-height: 1.6;
  text-align: center;
  transition: all 0.3s ease;
  max-width: 90%;
  font-weight: 500;
  word-break: break-word; /* Added for text wrapping */
}

/* Reposition the flip hint to bottom right corner */
.flip-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  background-color: rgba(245, 245, 250, 0.7);
  backdrop-filter: blur(2px);
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card-face:hover .flip-hint {
  opacity: 1;
  transform: translateY(-3px);
}

.flip-hint .v-icon {
  margin-right: 4px;
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

/* Share button */
.share-btn {
  transition: all 0.2s ease;
}

.share-btn:hover {
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 960px) {
  .flashcard {
    height: 300px;
  }
  
  .card-content {
    font-size: 1.5rem; /* Increased from 1.25rem */
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
    font-size: 1.3rem; /* Increased from 1.1rem */
  }
  
  .card-face {
    padding: 1.5rem;
  }

  .progress-dots {
    max-width: 50%;
  }
}
</style>
