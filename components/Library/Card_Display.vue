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
          {{ itemCount }} {{ type === 'quiz' ? 'Questions' : 'Cards' }}
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
            class="mr-2 mb-1 text-white outfit outfit-medium"
            variant="flat"
            closable
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
    validator: (value) => ['flashcard', 'quiz'].includes(value)
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

defineEmits(['edit', 'action', 'editTags', 'removeTag']);

// Dynamic computed properties based on type
const getTypeClass = computed(() => {
  return props.type === 'quiz' ? 'purple' : 'primary';
});

const getTypeIcon = computed(() => {
  return props.type === 'quiz' ? 'mdi-help-circle-outline' : 'mdi-cards-outline';
});

const getCountIcon = computed(() => {
  return props.type === 'quiz' ? 'mdi-format-list-numbered' : 'mdi-card-text-outline';
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
}

.card-icon {
  transition: transform 0.4s ease;
  z-index: 2;
}

.library-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

/* Tags container with proper wrapping */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 24px;
  position: relative;
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
</style>
