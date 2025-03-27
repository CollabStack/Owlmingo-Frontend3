<template>
  <v-dialog v-model="localModelValue" max-width="500" class="share-dialog rounded-lg">
    <v-card class="pa-4" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 outfit outfit-semibold">Share Flashcards</span>
        <v-btn icon variant="text" @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-divider class="my-3"></v-divider>
      
      <v-card-text>
        <p class="text-body-2 outfit mb-4">
          Share this flashcard deck with friends or colleagues. They'll be able to study with it, but won't be able to edit it.
        </p>
        
        <v-sheet 
          color="grey-lighten-4" 
          class="pa-3 rounded-lg mb-4 d-flex align-center justify-space-between"
        >
          <span class="text-body-2 outfit text-truncate mr-2">{{ shareLink }}</span>
          <v-btn 
            color="primary"
            variant="text"
            class="share-action-btn"
            @click="$emit('copy-link')"
            min-width="80"
          >
            <v-icon v-if="linkCopied" color="success" class="mr-1">mdi-check</v-icon>
            <template v-else>
              <v-icon class="mr-1">mdi-content-copy</v-icon>
            </template>
            {{ linkCopied ? 'Copied!' : 'Copy' }}
          </v-btn>
        </v-sheet>
        
        <div class="d-flex flex-wrap mt-6">
          <v-btn
            class="share-btn mr-3 mb-2"
            variant="flat"
            :href="`https://wa.me/?text=${encodeURIComponent(`Study with me using this flashcard deck: ${shareLink}`)}`"
            target="_blank"
            color="green"
            prepend-icon="mdi-whatsapp"
          >
            WhatsApp
          </v-btn>
          
          <v-btn
            class="share-btn mr-3 mb-2"
            variant="flat"
            :href="`mailto:?subject=${encodeURIComponent('Check out this flashcard deck')}&body=${encodeURIComponent(`I thought you might find this flashcard deck useful for studying: ${shareLink}`)}`"
            color="blue"
            prepend-icon="mdi-email"
          >
            Email
          </v-btn>
          
          <v-btn
            class="share-btn mb-2"
            variant="flat"
            :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Studying with this flashcard deck: ${shareLink}`)}`"
            target="_blank"
            color="blue-lighten-1"
            prepend-icon="mdi-twitter"
          >
            Twitter
          </v-btn>
        </div>
      </v-card-text>
      
      <v-card-actions class="justify-end pt-2">
        <v-btn 
          variant="outlined" 
          color="primary" 
          class="outfit"
          @click="$emit('close')"
        >
          Done
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  shareLink: {
    type: String,
    required: true
  },
  linkCopied: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'copy-link', 'close']);

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-semibold {
  font-weight: 600;
}

.share-dialog {
  backdrop-filter: blur(5px);
}

.share-action-btn {
  transition: all 0.3s ease;
}

.share-action-btn:hover {
  transform: translateY(-2px);
}

.share-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  font-family: "Outfit", sans-serif;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
