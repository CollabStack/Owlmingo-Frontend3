<template>
  <v-card 
    class="library-card rounded-lg mb-4" 
    elevation="1"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
  >
    <!-- Card Header with Title and Type Icon -->
    <v-card-item :class="`${getTypeClass}-lighten-5 pa-4`">
      <div class="d-flex align-center">
        <div class="card-icon-wrapper me-3">
          <v-avatar size="42" :color="getTypeClass" class="card-icon">
            <v-icon :icon="getTypeIcon" size="20" color="white"></v-icon>
          </v-avatar>
        </div>
        <div>
          <v-card-title class="text-h6 outfit outfit-semibold mb-1 text-truncate">{{ title }}</v-card-title>
          <v-card-subtitle class="outfit text-truncate">{{ subtitle }}</v-card-subtitle>
        </div>
      </div>
    </v-card-item>

    <!-- Card Content -->
    <v-card-text class="pa-4">
      <!-- Description or summary with fixed height -->
      <div class="description-container mb-3">
        <p v-if="description" class="outfit text-body-2 text-medium-emphasis description-text">
          {{ description }}
        </p>
      </div>
      
      <!-- Item count and last update info -->
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="text-caption outfit outfit-medium text-medium-emphasis">
          <v-icon size="16" class="me-1">{{ getCountIcon }}</v-icon>
          {{ itemCount }} {{ type === 'quiz' ? 'Questions' : (type === 'summary' ? 'Words' : 'Cards') }}
        </span>
        <span class="text-caption text-medium-emphasis outfit">
          <v-icon size="16" class="me-1">mdi-clock-outline</v-icon>
          {{ lastUpdated }}
        </span>
      </div>

      <!-- Tags -->
      <div class="mt-3 tags-container">
        <div v-if="tags && tags.length">
          <v-chip
            v-for="(tag, i) in tags"
            :key="i"
            :color="tag.color"
            size="x-small"
            class="mr-2 mb-1 text-white outfit outfit-medium tag-chip"
            variant="flat"
            closable
            close-icon="mdi-close-circle"
            :close-label="`Remove ${tag.name} tag`"
            @click:close="$emit('removeTag', { id, tagIndex: i })"
          >
            {{ tag.name }}
          </v-chip>
        </div>
        
        <div v-else class="no-tags-indicator">
          <span class="text-caption text-medium-emphasis outfit fst-italic">No tags</span>
        </div>
        
        <v-btn
          icon="mdi-tag-plus"
          density="compact"
          size="small"
          variant="text"
          color="grey"
          class="ml-1 tag-edit-btn"
          @click="$emit('editTags', id)"
        ></v-btn>
      </div>
    </v-card-text>

    <!-- Card Actions -->
    <v-divider></v-divider>
    <v-card-actions class="pa-3">
      <!-- Delete Button -->
      <v-btn 
        color="error" 
        variant="text" 
        size="small"
        class="action-btn outfit"
        @click.stop="$emit('delete')"
      >
        <v-icon size="16">mdi-delete</v-icon>
      </v-btn>
      
      <v-spacer></v-spacer>
      
      <!-- Edit Button -->
      <v-btn 
        color="grey-darken-1" 
        variant="text" 
        size="small"
        class="action-btn outfit mr-2"
        @click="$emit('edit')"
      >
        <span class="d-flex align-center">
          Edit
          <v-icon class="ms-1" size="16">mdi-pencil</v-icon>
        </span>
      </v-btn>
      
      <!-- Start/View Button -->
      <v-btn 
        :color="getTypeClass" 
        class="action-btn outfit"
        size="small"
        @click="$emit('action')"
      >
        <span class="d-flex align-center">
          {{ type === 'quiz' ? 'Start' : 'View' }}
          <v-icon class="ms-1" size="16">{{ type === 'quiz' ? 'mdi-play' : 'mdi-eye' }}</v-icon>
        </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['flashcard', 'quiz', 'summary'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  itemCount: {
    type: [Number, String],
    default: 0
  },
  lastUpdated: {
    type: String,
    default: 'Just now'
  },
  tags: {
    type: Array,
    default: () => []
  },
  index: {
    type: Number,
    default: 0
  },
  id: {
    type: [Number, String],
    required: true
  }
});

defineEmits(['edit', 'action', 'editTags', 'removeTag', 'delete']);

// Dynamic computed properties based on type
const getTypeClass = computed(() => {
  if (props.type === 'quiz') return 'purple';
  if (props.type === 'summary') return 'teal';
  return 'primary';
});

const getTypeIcon = computed(() => {
  if (props.type === 'quiz') return 'mdi-help-circle-outline';
  if (props.type === 'summary') return 'mdi-file-document-outline';
  return 'mdi-cards-outline';
});

const getCountIcon = computed(() => {
  if (props.type === 'quiz') return 'mdi-format-list-numbered';
  if (props.type === 'summary') return 'mdi-text';
  return 'mdi-card-text-outline';
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.outfit {
  font-family: 'Outfit', sans-serif;
}

.outfit-medium {
  font-weight: 500;
}

.outfit-semibold {
  font-weight: 600;
}

/* Card styling with animation */
.library-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.library-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(0,0,0,0);
}

/* Description container with fixed height */
.description-container {
  height: 60px;
  overflow: hidden;
  position: relative;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3; /* Added standard property for compatibility */
  -webkit-box-orient: vertical;
  box-orient: vertical; /* Added standard property for compatibility */
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

/* Improved card icon with wrapper to fix hover cutoff */
.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  position: relative;
  border-radius: 50%;
  overflow: visible;
  padding: 2px;
  margin-left: 2px; /* Add some margin to prevent cutoff */
}

.card-icon {
  transition: transform 0.4s ease;
  z-index: 2;
  transform-origin: center center; /* Ensure rotation happens from the center */
  overflow: visible;
}

.library-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

/* For the v-avatar to ensure the background isn't cut */
.card-icon-wrapper :deep(.v-avatar) {
  overflow: visible !important; /* Override Vuetify's overflow hidden */
}

/* Add a pseudo-element that expands with the icon */
.card-icon-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  z-index: 1;
  transition: transform 0.4s ease;
  transform: scale(1);
}

.library-card:hover .card-icon-wrapper::after {
  transform: scale(1.1);
}

/* Tags container with proper wrapping */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 24px;
  position: relative;
}

/* Tag chip styling with hover effect for close button */
.tag-chip {
  position: relative;
  transition: all 0.3s ease;
  padding-right: 6px !important; /* Default compact padding */
}

/* Hide the close icon completely by default */
.tag-chip :deep(.v-chip__close) {
  opacity: 0;
  width: 0;
  margin-right: 0;
  margin-left: 0;
  transition: all 0.3s ease;
  transform: scale(0);
  position: absolute;
  right: 4px;
}

/* Show the close icon on hover and expand chip to make space */
.tag-chip:hover {
  padding-right: 24px !important; /* Expanded padding to make space for icon */
}

.tag-chip:hover :deep(.v-chip__close) {
  opacity: 1;
  width: auto;
  margin-right: 0;
  margin-left: 4px;
  transform: scale(1);
  position: absolute;
}

.tag-edit-btn {
  opacity: 0.6;
  transition: all 0.2s ease;
  margin-left: auto;
}

.library-card:hover .tag-edit-btn {
  opacity: 1;
}

.tag-edit-btn:hover {
  transform: scale(1.2);
  color: var(--v-primary-base) !important;
}

.no-tags-indicator {
  display: flex;
  align-items: center;
  opacity: 0.6;
}

/* Button animations */
.action-btn {
  transition: all 0.25s ease;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  text-transform: none;
  min-width: 70px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.action-btn:active {
  transform: translateY(1px);
}

/* Soft background colors for card icons */
.bg-primary-soft {
  background-color: rgba(33, 150, 243, 0.8) !important; /* Softer primary color */
}

.bg-purple-soft {
  background-color: rgba(156, 39, 176, 0.75) !important; /* Softer purple color */
}

.bg-teal-soft {
  background-color: rgba(0, 150, 136, 0.75) !important; /* Softer teal color */
}
</style>
