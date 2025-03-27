<template>
    <v-container class="py-8">
        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
            <v-row align="center" justify="space-between" class="mb-6">
                <!-- Title and Subtitle -->
                <v-col cols="12" md="7">
                    <h1 class="text-h4 outfit outfit-bold text-primary mb-2">Quiz History</h1>
                    <p class="text-subtitle-1 outfit outfit-regular text-grey-darken-1">
                        Review all quizzes you've completed to track your progress
                    </p>
                </v-col>

                <!-- Action Button -->
                <v-col cols="12" md="5" class="d-flex justify-md-end mt-4 mt-md-0">
                    <v-btn 
                        color="primary" 
                        variant="flat" 
                        class="rounded-xl animated-btn outfit outfit-medium"
                        prepend-icon="mdi-plus" 
                        @click="quizPage"
                    >
                        Create New Quiz
                    </v-btn>
                </v-col>
            </v-row>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="text-h6 mt-6 outfit outfit-medium">Loading your quiz history...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
            <v-icon color="error" size="64">mdi-alert-circle</v-icon>
            <h2 class="text-h5 mt-4 outfit outfit-medium">{{ error }}</h2>
            <v-btn color="primary" class="mt-6 rounded-xl animated-btn" @click="fetchQuizHistory">Try Again</v-btn>
        </div>

        <!-- No Quizzes State -->
        <div v-else-if="quizzes.length === 0" class="text-center py-16" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
            <v-img src="/images/empty-history.png" alt="No Quiz History" max-height="200" class="mb-6 mx-auto" contain></v-img>
            <h2 class="text-h5 outfit outfit-semibold mb-3">No Quiz History Found</h2>
            <p class="text-body-1 text-grey-darken-1 mb-6 max-w-md mx-auto">
                You haven't completed any quizzes yet. Create your first quiz to start tracking your progress.
            </p>
            <v-btn color="primary" variant="flat" class="rounded-xl animated-btn outfit outfit-medium" prepend-icon="mdi-plus" @click="quizPage">
                Create Your First Quiz
            </v-btn>
        </div>

        <div v-else v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }">
            <!-- Search and Filter (Optional) -->
            <div class="d-flex flex-wrap align-center mb-4">
                <div class="text-body-1 outfit outfit-medium text-grey-darken-2">
                    {{ quizzes.length }} {{ quizzes.length === 1 ? 'Quiz' : 'Quizzes' }} Completed
                </div>
                <v-spacer></v-spacer>
            </div>

            <!-- Quiz History Cards -->
            <div class="history-list">
                <v-card
                    v-for="(quiz, index) in quizzes"
                    :key="quiz.quizId"
                    class="history-card mb-4 rounded-xl"
                    elevation="0"
                    variant="outlined"
                    v-motion
                    :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 100 * index, duration: 500 } }"
                >
                    <div class="d-flex flex-column flex-md-row align-center pa-4">
                        <!-- Quiz Info -->
                        <div class="flex-grow-1">
                            <div class="d-flex align-center">
                                <v-icon color="primary" size="24" class="mr-2">mdi-file-document-outline</v-icon>
                                <h3 class="text-h6 outfit outfit-medium text-truncate">{{ quiz.title || 'Untitled Quiz' }}</h3>
                            </div>
                            <p class="text-body-2 text-grey-darken-2 mt-1">
                                Completed {{ formatDate(quiz.completedAt || quiz.createdAt) }}
                            </p>
                        </div>

                        <!-- Quiz Score -->
                        <div class="d-flex align-center mt-4 mt-md-0 ml-md-4">
                            <div class="score-chip mr-4" :class="getScoreColorClass(calculatePercentage(quiz.correctAnswers, quiz.totalQuestions))">
                                <span class="text-h6 outfit outfit-bold">{{ calculatePercentage(quiz.correctAnswers, quiz.totalQuestions) }}%</span>
                            </div>
                            <div class="mr-4 text-right">
                                <div class="text-body-2 outfit outfit-medium">Score</div>
                                <div class="text-body-2">{{ quiz.correctAnswers || 0 }}/{{ quiz.totalQuestions || 0 }}</div>
                            </div>
                            <v-btn
                                variant="outlined"
                                color="primary"
                                class="rounded-xl animated-btn outfit outfit-medium ml-auto"
                                @click="viewQuizResults(quiz.quizId)"
                            >
                                View Results
                            </v-btn>
                            <v-btn 
                                color="secondary"
                                variant="outlined"
                                class="rounded-xl animated-btn outfit outfit-medium mr-2"
                                prepend-icon="mdi-pencil"
                                @click="reviewQuiz"
                            >
                                Review Quiz
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

// Enhanced date formatter with more readable relative times
const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
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

// Calculate percentage score
const calculatePercentage = (correct: number, total: number): number => {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
};

// Helper to get appropriate color class based on score
const getScoreColorClass = (score: number): string => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-needs-work';
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

const reviewQuiz = () => {
    const lastQuizId = localStorage.getItem('lastQuizId');
    if (lastQuizId) {
        router.push({
            path: '/library/review-quiz',
            query: { id: lastQuizId }
        });
    } else {
        router.push('/library/review-quiz');
    }
};

// Fetch quiz history on component mount
onMounted(() => {
    fetchQuizHistory();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Outfit font classes */
.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-regular {
  font-weight: 400;
}

.outfit-medium {
  font-weight: 500;
}

.outfit-semibold {
  font-weight: 600;
}

.outfit-bold {
  font-weight: 700;
}

/* Card styling */
.history-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.history-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08) !important;
  border-color: #9D7BFC50;
}

/* Score chip styling */
.score-chip {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-excellent {
  background-color: #4CAF50;
  box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
}

.score-good {
  background-color: #8BC34A;
  box-shadow: 0 3px 8px rgba(139, 195, 74, 0.3);
}

.score-average {
  background-color: #FFC107;
  box-shadow: 0 3px 8px rgba(255, 193, 7, 0.3);
}

.score-needs-work {
  background-color: #F44336;
  box-shadow: 0 3px 8px rgba(244, 67, 54, 0.3);
}

/* Animated button */
.animated-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Limit width for better readability */
.max-w-md {
  max-width: 500px;
}
</style>
