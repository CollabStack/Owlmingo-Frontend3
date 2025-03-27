<template>
  <section class="mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 outfit outfit-semibold">My Quizzes</h2>
      
      <div class="d-flex align-center">
        <v-tooltip v-if="lastRefreshed" location="bottom">
          <template v-slot:activator="{ props }">
            <span class="text-caption text-grey me-3" v-bind="props">
              <v-icon size="small" class="me-1">mdi-clock-outline</v-icon>
              {{ formatRefreshTime(lastRefreshed) }}
            </span>
          </template>
          <span>Last updated: {{ formatFullDateTime(lastRefreshed) }}</span>
        </v-tooltip>
        
        <v-btn
          icon
          variant="text"
          color="grey"
          class="me-2"
          @click="$emit('refresh-quizzes')"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        
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
    </div>

    <div>
      <v-skeleton-loader
        v-if="loading"
        type="card, card, card"
        class="mb-4"
      ></v-skeleton-loader>

      <v-row v-else-if="quizzes.length > 0">
        <v-col cols="12" sm="6" md="4" v-for="(quiz, index) in quizzes" :key="quiz.quizId || quiz.id || index">
          <Card_Display
            type="quiz"
            :title="quiz.title || 'Untitled Quiz'"
            :description="getQuizDescription(quiz)"
            :subtitle="getQuizStatus(quiz)"
            :item-count="quiz.totalQuestions || 0"
            :last-updated="formatDate(quiz.completedAt || quiz.createdAt)"
            :tags="quiz.tags || []"
            :index="index"
            :id="quiz.quizId || quiz.id" 
            @edit="$emit('edit-quiz', quiz.quizId || quiz.id)"
            @action="$emit('start-quiz', quiz.quizId || quiz.id)"
            @editTags="$emit('open-tags-dialog', 'quiz', quiz.quizId || quiz.id)"
            @removeTag="$emit('remove-tag-from-item', $event)"
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

const props = defineProps({
  quizzes: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  lastRefreshed: {
    type: Date,
    default: null
  }
});

defineEmits([
  'edit-quiz',
  'start-quiz',
  'open-quiz-dialog',
  'open-tags-dialog',
  'remove-tag-from-item',
  'refresh-quizzes'
]);

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  // Show relative time for recent quizzes
  if (diffMinutes < 5) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  // Use formatted date for older quizzes
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatRefreshTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
};

const formatFullDateTime = (date) => {
  if (!date) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getQuizDescription = (quiz) => {
  if (quiz.description) return quiz.description;
  
  // Calculate score percentage for consistency with history-quiz.vue
  const scorePercentage = quiz.score || (quiz.totalQuestions > 0 
    ? Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100) 
    : 0);
  
  let description = `Quiz with ${quiz.totalQuestions || 0} questions`;
  if (quiz.status === 'completed') {
    description += `, Score: ${scorePercentage}%`;
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
