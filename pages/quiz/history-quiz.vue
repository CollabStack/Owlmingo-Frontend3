<template>
  <v-container class="mb-16">
    <!-- Header Section with Animation -->
    <v-row align="center" justify="space-between" class="my-6" v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold outfit mb-2">Quiz History</h1>
        <p class="text-body-1 text-grey-darken-2">Review your past quiz attempts and track your progress</p>
      </v-col>
      <v-col cols="12" sm="4" class="d-flex justify-sm-end">
        <v-btn 
          variant="flat" 
          color="primary" 
          prepend-icon="mdi-plus" 
          class="rounded-xl px-6 pulse-animation" 
          @click="quizPage"
        >
          Create New Quiz
        </v-btn>
      </v-col>
    </v-row>

    <!-- States Management -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" class="mb-6"></v-progress-circular>
      <h2 class="text-h6 outfit">Loading your quiz history...</h2>
    </div>
    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h5 outfit mb-2">{{ error }}</h2>
      <v-btn color="primary" class="mt-6 rounded-xl" @click="fetchQuizHistory">Try Again</v-btn>
    </div>
    <div v-else-if="quizzes.length === 0" class="text-center py-16">
      <v-img 
        src="/images/empty-quiz.png" 
        alt="No quizzes" 
        width="200" 
        class="mx-auto mb-6"
        contain
      ></v-img>
      <h2 class="text-h5 outfit mb-2">No Quiz History Found</h2>
      <p class="text-body-1 text-grey-darken-1 mb-6">You haven't completed any quizzes yet</p>
      <v-btn 
        color="primary" 
        class="rounded-xl px-6" 
        prepend-icon="mdi-book-open-variant" 
        @click="quizPage"
      >
        Create Your First Quiz
      </v-btn>
    </div>

    <!-- Quiz History List -->
    <template v-else>
      <!-- Filter and Search Bar with Animation -->
      <v-card class="mb-6 pa-4 rounded-lg filter-card" flat color="grey-lighten-5" v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
        <div class="d-flex flex-wrap align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-filter-variant</v-icon>
            <span class="text-body-1 outfit">{{ quizzes.length }} Quizzes</span>
          </div>
          <div class="d-flex align-items-center">
            <v-select
              v-model="sortOption"
              :items="sortOptions"
              label="Sort by"
              density="compact"
              variant="outlined"
              hide-details
              class="mr-3 sort-select"
              style="width: 150px"
            ></v-select>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search quizzes"
              hide-details
              variant="outlined"
              density="compact"
              class="rounded-lg search-field"
              style="max-width: 200px"
            ></v-text-field>
          </div>
        </div>
      </v-card>

      <!-- Quiz List with Animation -->
      <div class="quiz-list">
        <v-card 
          v-for="(quiz, index) in sortedAndFilteredQuizzes" 
          :key="quiz.quizId" 
          class="mb-4 rounded-lg quiz-card" 
          elevation="2"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 * index } }"
        >
          <v-row no-gutters>
            <v-col cols="12" md="8" class="pa-4">
              <div class="d-flex align-start">
                <v-avatar :color="getAvatarColor(quiz.title)" class="mr-4" size="48">
                  <v-icon color="white" size="24">mdi-file-document-outline</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h6 outfit mb-1">{{ quiz.title || 'Untitled Quiz' }}</h3>
                  <div class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    <span class="text-body-2 text-grey-darken-1">
                      {{ formatDate(quiz.completedAt || quiz.createdAt) }}
                    </span>
                  </div>
                  <div class="d-flex align-center flex-wrap">
                    <v-chip
                      :color="getScoreColor(calculatePercentage(quiz.correctAnswers, quiz.totalQuestions))" 
                      size="small" 
                      class="mr-2 mb-2"
                      variant="elevated"
                    >
                      {{ calculatePercentage(quiz.correctAnswers, quiz.totalQuestions) }}%
                    </v-chip>
                    <span class="text-body-2 mb-2">
                      {{ quiz.correctAnswers || 0 }}/{{ quiz.totalQuestions || 0 }} correct
                    </span>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4" class="pa-4 d-flex align-center justify-md-end">
              <v-btn
                variant="flat"
                color="primary"
                class="rounded-xl action-btn"
                prepend-icon="mdi-eye"
                @click="viewQuizResults(quiz.quizId)"
              >
                View Results
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="grey"
                class="ml-2 action-btn-icon"
                @click="retakeQuiz(quiz.quizId)"
              >
                <v-icon>mdi-refresh</v-icon>
                <v-tooltip activator="parent" location="top">Retake Quiz</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="quiz.tags && quiz.tags.length > 0"></v-divider>
          <v-card-text v-if="quiz.tags && quiz.tags.length > 0" class="pt-2 pb-2">
            <v-chip-group>
              <v-chip v-for="tag in quiz.tags" :key="tag" size="small" variant="outlined" class="mr-2">{{ tag }}</v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </div>
      
      <!-- Pagination for larger lists -->
      <div class="d-flex justify-center mt-6" v-if="quizzes.length > itemsPerPage">
        <v-pagination
          v-model="currentPage"
          :length="Math.ceil(filteredQuizzes.length / itemsPerPage)"
          :total-visible="5"
          rounded="circle"
        ></v-pagination>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import { useQuizStore } from '~/store/quizStore';

interface Quiz {
    quizId: string;
    title: string;
    createdAt: string;
    completedAt?: string;
    correctAnswers: number;
    totalQuestions: number;
    status: string;
}

const router = useRouter();
const authStore = userAuth();
const quizStore = useQuizStore();
const quizzes = ref<Quiz[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Calculate percentage score
const calculatePercentage = (correct: number, total: number): number => {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
};

// Enhanced date formatting for better readability
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    return 'Today, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Fetch quiz history from API and local store
const fetchQuizHistory = async () => {
    loading.value = true;
    error.value = null;

    try {
        console.log('Fetching quiz history...');
        
        const isValid = await authStore.checkTokenExpired();
        if (!isValid) {
            console.log('Token expired, redirecting to auth');
            router.push('/auth');
            return;
        }

        // Load history from store first
        quizStore.loadHistory();
        
        // If we have local history, use it immediately
        if (quizStore.quizzes.length > 0) {
            console.log('Using local history from store:', quizStore.quizzes);
            quizzes.value = quizStore.quizzes.map(quiz => ({
                quizId: quiz.quizId,
                title: quiz.title || 'Untitled Quiz',
                createdAt: quiz.createdAt,
                completedAt: quiz.completedAt,
                correctAnswers: quiz.correctAnswers || 0,
                totalQuestions: quiz.totalQuestions || 0,
                status: quiz.status || 'completed'
            }));
        }

        // Continue with API call to get the latest history
        const token = authStore.getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const apiUrl = 'http://api.owlmingo.space/api/v1/user/auth/quiz/sessions';
        console.log('Making request to:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 401) {
                console.log('Unauthorized, logging out');
                authStore.logout();
                router.push('/auth');
                return;
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error(errorData.message || 'Failed to fetch quiz history');
            } else {
                const errorText = await response.text();
                console.error('Error text:', errorText);
                throw new Error(`Server returned error (${response.status})`);
            }
        }

        const data = await response.json();
        console.log('Quiz history data received:', data);
        
        // Fix: Handle the correct response structure with sessions array
        if (data && data.sessions && Array.isArray(data.sessions)) {
            console.log('Processing quiz array of length:', data.sessions.length);
            quizzes.value = data.sessions.map((quiz: any) => {
                console.log('Processing quiz item:', quiz);
                return {
                    quizId: quiz.quizId || quiz._id,
                    title: quiz.title || quiz.quizTitle || 'Untitled Quiz',
                    createdAt: quiz.createdAt,
                    completedAt: quiz.completedAt,
                    correctAnswers: quiz.correctAnswers || quiz.score?.correct || 0,
                    totalQuestions: quiz.totalQuestions || quiz.score?.total || 0,
                    status: quiz.status || 'completed'
                };
            });
        } else if (data && data.data && Array.isArray(data.data)) {
            // Fallback to previous structure
            console.log('Processing quiz data array of length:', data.data.length);
            quizzes.value = data.data.map((quiz: any) => ({
                quizId: quiz.quizId || quiz._id,
                title: quiz.title || quiz.quizTitle || 'Untitled Quiz',
                createdAt: quiz.createdAt,
                completedAt: quiz.completedAt,
                correctAnswers: quiz.correctAnswers || quiz.score?.correct || 0,
                totalQuestions: quiz.totalQuestions || quiz.score?.total || 0,
                status: quiz.status || 'completed'
            }));
        } else if (data && Array.isArray(data)) {
            // Alternative format where data is directly an array
            console.log('Processing direct quiz array of length:', data.length);
            quizzes.value = data.map((quiz: any) => ({
                quizId: quiz.quizId || quiz._id,
                title: quiz.title || quiz.quizTitle || 'Untitled Quiz',
                createdAt: quiz.createdAt,
                completedAt: quiz.completedAt,
                correctAnswers: quiz.correctAnswers || quiz.score?.correct || 0,
                totalQuestions: quiz.totalQuestions || quiz.score?.total || 0,
                status: quiz.status || 'completed'
            }));
        } else {
            console.log('No quiz data found or invalid format');
            quizzes.value = [];
        }
        
        console.log('Processed quizzes:', quizzes.value);
    } catch (err) {
        console.error('Error in fetchQuizHistory:', err);
        // If API fails but we have local history, don't show error
        if (quizStore.quizzes.length === 0) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch quiz history';
        }
    } finally {
        loading.value = false;
    }
};

// Navigate to quiz page
const quizPage = () => {
    router.push('/quiz');
};

// Navigate to results quiz page with specific quiz ID
const viewQuizResults = (quizId: string) => {
    router.push(`/quiz/results-quiz?id=${quizId}`);
};

const search = ref('');
const sortOption = ref('newest');
const currentPage = ref(1);
const itemsPerPage = 5;

const sortOptions = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'Highest Score', value: 'score-high' },
  { title: 'Lowest Score', value: 'score-low' },
  { title: 'A-Z', value: 'alpha' }
];

const filteredQuizzes = computed(() => {
  if (!search.value) return quizzes.value;
  const searchTerm = search.value.toLowerCase();
  return quizzes.value.filter(quiz => quiz.title.toLowerCase().includes(searchTerm));
});

// Reset pagination when filter changes
watch(search, () => {
  currentPage.value = 1;
});

// Sort quizzes based on selected option
const sortedAndFilteredQuizzes = computed(() => {
  let result = [...filteredQuizzes.value];
  
  // Apply sorting
  switch (sortOption.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.completedAt || a.createdAt).getTime() - new Date(b.completedAt || b.createdAt).getTime());
      break;
    case 'score-high':
      result.sort((a, b) => calculatePercentage(b.correctAnswers, b.totalQuestions) - calculatePercentage(a.correctAnswers, a.totalQuestions));
      break;
    case 'score-low':
      result.sort((a, b) => calculatePercentage(a.correctAnswers, a.totalQuestions) - calculatePercentage(b.correctAnswers, b.totalQuestions));
      break;
    case 'alpha':
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      break;
  }
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return result.slice(start, end);
});

// Generate consistent avatar colors based on quiz title
const getAvatarColor = (title: string): string => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'purple', 'indigo', 'deep-purple'];
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
};

const retakeQuiz = (quizId: string) => {
  router.push(`/quiz/do-quiz?id=${quizId}`);
};

// Fetch quiz history on component mount
onMounted(() => {
    fetchQuizHistory();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
}

.quiz-card {
  transition: all 0.3s ease;
  overflow: hidden;
  border-left: 4px solid transparent;
}

.quiz-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
  border-left-color: var(--v-primary-base, #1976d2);
}

.quiz-list {
  max-height: 75vh;
  overflow-y: auto;
  padding-right: 4px;
  scroll-behavior: smooth;
}

.filter-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1;
}

.action-btn {
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn-icon {
  transition: all 0.3s ease;
}

.action-btn-icon:hover {
  transform: rotate(180deg);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
}

.sort-select, .search-field {
  transition: all 0.3s ease;
}

.sort-select:hover, .search-field:hover {
  transform: translateY(-2px);
}

/* Enhanced scrollbar styling */
.quiz-list::-webkit-scrollbar {
  width: 8px;
}

.quiz-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

.quiz-list::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #c1c1c1, #9d7bfc);
  border-radius: 8px;
}

.quiz-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #9d7bfc, #7b65f8);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .filter-card .d-flex {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-card .d-flex > div {
    margin-top: 16px;
    width: 100%;
  }
  
  .sort-select, .search-field {
    width: 100% !important;
    max-width: unset;
  }
}
</style>
