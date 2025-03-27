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

    <div>
      <v-skeleton-loader
        v-if="loading"
        type="card, card, card"
        class="mb-4"
      ></v-skeleton-loader>

      <v-row v-else-if="quizzes.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(quiz, index) in quizzes" :key="index">
          <Card_Display
            type="quiz"
            :title="quiz.title || 'Untitled Quiz'"
            :description="getQuizDescription(quiz)"
            :subtitle="getQuizStatus(quiz)"
            :item-count="quiz.totalQuestions || 0"
            :last-updated="formatDate(quiz.createdAt || quiz.startedAt)"
            :tags="quiz.tags || []"
            :index="index"
            :id="quiz.quizId || quiz.id" 
            @edit="$emit('edit-quiz', quiz.quizId || quiz.id)"
            @action="$emit('start-quiz', quiz.quizId || quiz.id)"
            @editTags="$emit('open-tags-dialog', 'quiz', quiz.quizId || quiz.id)"
            @removeTag="$emit('remove-tag-from-item', $event)"
            @delete="$emit('delete-quiz', quiz.quizId || quiz.id)"
          />
        </v-col>
      </v-row>

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
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits([
  'edit-quiz',
  'start-quiz',
  'open-quiz-dialog',
  'open-tags-dialog',
  'remove-tag-from-item',
  'delete-quiz'
]);

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const getQuizDescription = (quiz) => {
  if (quiz.description) return quiz.description;
  let description = `Quiz with ${quiz.totalQuestions || 0} questions`;
  if (quiz.status === 'completed') {
    description += `, Score: ${quiz.score || 0}%`;
  }
  return description;
};

const getQuizStatus = (quiz) => {
  switch(quiz.status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'In Progress';
    case 'not_started': return 'Not Started';
    default: return quiz.subtitle || 'Quiz';
  }
};
</script>
