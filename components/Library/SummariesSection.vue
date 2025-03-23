<template>
  <section class="mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 outfit outfit-semibold">My Summaries</h2>
      <v-btn 
        color="teal" 
        class="rounded-lg action-btn outfit outfit-medium"
        prepend-icon="mdi-plus"
        @click="$emit('open-summary-dialog')"
        size="small"
      >
        Create
      </v-btn>
    </div>

    <!-- Summary Content -->
    <div>
      <v-row v-if="summaries.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(summary, index) in summaries" :key="index">
          <Card_Display
            type="summary"
            :title="summary.title"
            :description="summary.description"
            :subtitle="summary.subtitle"
            :item-count="summary.wordCount"
            :last-updated="summary.lastUpdated"
            :tags="summary.tags"
            :index="index"
            :id="summary.id"
            @edit="$emit('edit-summary', summary.id)"
            @action="$emit('view-summary', summary.id)"
            @editTags="$emit('open-tags-dialog', 'summary', summary.id)"
            @removeTag="$emit('remove-tag-from-item', $event)"
          />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card v-else class="pa-8 text-center rounded-lg empty-state">
        <v-icon size="64" color="teal" class="mb-4">mdi-file-document-outline</v-icon>
        <h3 class="text-h5 outfit outfit-semibold mb-3">No summaries yet</h3>
        <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create your first summary to condense important information</p>
        
        <div class="d-flex justify-center" style="gap: 16px;">
          <nuxt-link to="/summary" style="text-decoration: none;">
            <v-btn 
              color="teal" 
              class="action-btn outfit"
              variant="flat"
              prepend-icon="mdi-robot"
            >
              Generate with AI
            </v-btn>
          </nuxt-link>
          <nuxt-link to="/summary/create" style="text-decoration: none;">
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
  summaries: {
    type: Array,
    required: true
  }
});

defineEmits([
  'edit-summary',
  'view-summary',
  'open-summary-dialog',
  'open-tags-dialog',
  'remove-tag-from-item'
]);
</script>
