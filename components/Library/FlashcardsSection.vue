<template>
  <section class="mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 outfit outfit-semibold">My Flashcards</h2>
      <v-btn 
        color="primary" 
        class="rounded-lg action-btn outfit outfit-medium"
        prepend-icon="mdi-plus"
        @click="$emit('open-flashcard-dialog')"
        size="small"
      >
        Create
      </v-btn>
    </div>

    <!-- Flashcard Content -->
    <div>
      <v-row v-if="flashcards.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(card, index) in flashcards" :key="index">
          <Card_Display
            type="flashcard"
            :title="card.title"
            :description="card.description"
            :subtitle="card.subtitle"
            :item-count="card.cardCount"
            :last-updated="card.lastUpdated"
            :tags="card.tags"
            :index="index"
            :id="card.id"
            @edit="$emit('edit-flashcard', card.id)"
            @action="$emit('view-flashcard', card.id)"
            @editTags="$emit('open-tags-dialog', 'flashcard', card.id)"
            @removeTag="$emit('remove-tag-from-item', $event)"
          />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card v-else class="pa-8 text-center rounded-lg empty-state">
        <v-icon size="64" color="primary" class="mb-4">mdi-cards-outline</v-icon>
        <h3 class="text-h5 outfit outfit-semibold mb-3">No flashcards yet</h3>
        <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create your first flashcard deck to start studying effectively</p>
        
        <div class="d-flex justify-center" style="gap: 16px;">
          <nuxt-link to="/flashcard" style="text-decoration: none;">
            <v-btn 
              color="primary" 
              class="action-btn outfit"
              variant="flat"
              prepend-icon="mdi-robot"
            >
              Generate with AI
            </v-btn>
          </nuxt-link>
          <nuxt-link to="/flashcard/flashcards" style="text-decoration: none;">
            <v-btn 
              color="grey-darken-1" 
              variant="outlined"
              class="action-btn outfit"
              prepend-icon="mdi-pencil"
            >
              Create Manually
            </v-btn>
          </nuxt-link>
        </div>
      </v-card>
    </div>
  </section>
</template>

<script setup>
import Card_Display from './Card_Display.vue';

defineProps({
  flashcards: {
    type: Array,
    required: true
  }
});

defineEmits([
  'edit-flashcard',
  'view-flashcard',
  'open-flashcard-dialog',
  'open-tags-dialog',
  'remove-tag-from-item'
]);
</script>
