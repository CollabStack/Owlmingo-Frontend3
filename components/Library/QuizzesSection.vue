<template>
  <section class="mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 outfit outfit-semibold">My Quizzes</h2>
      <v-btn 
        color="purple" 
        class="rounded-lg action-btn outfit outfit-medium"
        prepend-icon="mdi-plus"
        @click="$emit('open-quiz-dialog')"
        size="small"
      >
        Create
      </v-btn>
    </div>

    <!-- Quiz Content -->
    <div>
      <v-row v-if="quizzes.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(quiz, index) in quizzes" :key="index">
          <Card_Display
            type="quiz"
            :title="quiz.title"
            :description="quiz.description"
            :subtitle="quiz.subtitle"
            :item-count="quiz.questionCount"
            :last-updated="quiz.lastUpdated"
            :tags="quiz.tags"
            :index="index"
            :id="quiz.id"
            @edit="$emit('edit-quiz', quiz.id)"
            @action="$emit('start-quiz', quiz.id)"
            @editTags="$emit('open-tags-dialog', 'quiz', quiz.id)"
            @removeTag="$emit('remove-tag-from-item', $event)"
          />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-card v-else class="pa-8 text-center rounded-lg empty-state">
        <v-icon size="64" color="purple" class="mb-4">mdi-help-circle-outline</v-icon>
        <h3 class="text-h5 outfit outfit-semibold mb-3">No quizzes yet</h3>
        <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create your first quiz to test your knowledge</p>
        
        <div class="d-flex justify-center" style="gap: 16px;">
          <nuxt-link to="/quiz" style="text-decoration: none;">
            <v-btn 
              color="purple" 
              class="action-btn outfit"
              variant="flat"
              prepend-icon="mdi-robot"
            >
              Generate with AI
            </v-btn>
          </nuxt-link>
          <nuxt-link to="/quiz/review-quiz" style="text-decoration: none;">
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
  quizzes: {
    type: Array,
    required: true
  }
});

defineEmits([
  'edit-quiz',
  'start-quiz',
  'open-quiz-dialog',
  'open-tags-dialog',
  'remove-tag-from-item'
]);
</script>
