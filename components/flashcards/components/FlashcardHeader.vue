<template>
  <div>
    <v-container class="py-6" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-4">
        <h1 class="text-h4 outfit outfit-bold gradient-text mb-4 mb-md-0">
          {{ headerTitle }}
        </h1>
        <!-- Save button only shown in edit/create mode -->
        <v-btn 
          v-if="mode === 'edit'"
          color="primary" 
          variant="elevated" 
          class="animated-btn outfit outfit-medium"
          prepend-icon="mdi-check"
          rounded="xl"
          elevation="1"
          :loading="saving"
          @click="$emit('save')"
        >
          Save Deck
        </v-btn>
      </div>
    </v-container>
    <!-- Deck name input field only shown in edit/create mode -->
    <v-container v-if="mode === 'edit'" class="mb-6" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
      <v-card class="pa-4 rounded-xl content-card" elevation="2">
        <v-card-title class="text-h5 outfit outfit-semibold mb-2">Deck Name</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="deckNameModel"
            label="Enter a name for your deck"
            variant="outlined"
            placeholder="e.g., Biology Terms, Spanish Vocabulary"
            density="comfortable"
            class="clean-input mb-2"
            bg-color="white"
            hide-details
            clearable
            :disabled="disabled"
            @update:model-value="$emit('update:deckName', $event)"
          ></v-text-field>
          <p class="text-caption text-grey-darken-2 outfit outfit-regular mt-2 d-flex align-center">
            <v-icon size="small" color="grey-darken-1" class="me-1">mdi-information-outline</v-icon>
            Card content is saved automatically. Click "Save Deck" to save new cards and deck name.
          </p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  deckName: {
    type: String,
    default: ''
  },
  deckTitle: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  // Add a mode prop to control header display based on context
  mode: {
    type: String,
    default: 'edit', // Possible values: 'edit', 'view', 'exam'
    validator: (value) => ['edit', 'view', 'exam'].includes(value)
  }
});

defineEmits(['update:deckName', 'save', 'back']);

// Computed property to determine header title based on mode
const headerTitle = computed(() => {
  if (props.mode === 'edit') {
    return props.isEditing ? 'Edit Flashcard Deck' : 'Create Flashcard Deck';
  } else if (props.mode === 'view') {
    return props.deckTitle || 'Flashcard Deck';
  } else if (props.mode === 'exam') {
    return props.deckTitle || 'Exam Mode';
  }
  return 'Flashcard Deck';
});

// Use computed property for two-way binding
const deckNameModel = computed({
  get: () => props.deckName,
  set: (value) => null // Handled by @update:model-value
});
</script>

<style scoped>
/* Outfit font classes */
.outfit { font-family: "Outfit", sans-serif; }

/* Animation for button */
.animated-btn {
  transition: all 0.3s ease;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(45deg, #7b83e0, #9D7BFC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
