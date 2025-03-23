<template>
  <section class="mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 outfit outfit-semibold">My Tags</h2>
      <v-btn 
        color="secondary" 
        class="rounded-lg action-btn outfit outfit-medium"
        prepend-icon="mdi-plus"
        @click="$emit('open-tag-dialog')"
        size="small"
      >
        Create Tag
      </v-btn>
    </div>

    <!-- Tag List -->
    <div class="tags-container">
      <v-row v-if="tags.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(tag, index) in tags" :key="index">
          <v-card class="tag-card d-flex align-center px-4 py-3 mx-2 mb-3" elevation="1">
            <!-- Color Indicator -->
            <div 
              :style="{ backgroundColor: tag.color }" 
              class="tag-color"
            ></div>

            <!-- Tag Name -->
            <p class="mx-3 mb-0 outfit text-truncate">{{ tag.name }}</p>

            <!-- Spacer -->
            <v-spacer></v-spacer>

            <!-- Action Buttons -->
            <v-btn icon="mdi-pencil" size="small" variant="text" color="grey-darken-1" @click="$emit('edit-tag', index)" class="mr-1"></v-btn>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="$emit('confirm-delete', index)"></v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State for Tags -->
      <v-card v-else class="pa-8 text-center rounded-lg empty-state">
        <v-icon size="64" color="secondary" class="mb-4">mdi-tag-multiple</v-icon>
        <h3 class="text-h5 outfit outfit-semibold mb-3">No tags yet</h3>
        <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create tags to organize your flashcards and quizzes</p>
        
        <v-btn 
          color="secondary" 
          class="action-btn outfit"
          prepend-icon="mdi-plus"
          @click="$emit('open-tag-dialog')"
        >
          Create First Tag
        </v-btn>
      </v-card>
    </div>
  </section>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    required: true
  }
});

defineEmits(['open-tag-dialog', 'edit-tag', 'confirm-delete']);
</script>

<style scoped>
/* Tag styling */
.tag-color {
  min-width: 24px; 
  width: 24px;
  height: 24px; 
  border-radius: 4px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.tag-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.05);
  overflow: hidden;
}

.tag-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06) !important;
  border-color: rgba(0,0,0,0);
}

.tag-card:hover .tag-color {
  transform: scale(1.1);
}
</style>
