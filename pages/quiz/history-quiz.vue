<template>
    <v-container class="mb-16">
        <v-row align="center" justify="space-between" class="mt-4">
            <!-- Title and Subtitle -->
            <v-col cols="3">
                <p class="text-h5 font-weight-bold outfit">Completed</p>
                <p class="text-body-2 text-grey-darken-2">The quizzes completed by you</p>
            </v-col>

            <!-- Buttons -->
            <v-col cols="auto">
                <v-btn variant="outlined" color="blue" class="rounded-xl" @click="quizPage">Generate Quiz</v-btn>
            </v-col>
        </v-row>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="text-h6 mt-6">Loading your quiz history...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
            <v-icon color="error" size="64">mdi-alert-circle</v-icon>
            <h2 class="text-h5 mt-4">{{ error }}</h2>
            <v-btn color="primary" class="mt-6" @click="fetchQuizHistory">Try Again</v-btn>
        </div>

        <!-- No Quizzes State -->
        <div v-else-if="quizzes.length === 0" class="text-center py-16">
            <v-icon color="info" size="64">mdi-information-outline</v-icon>
            <h2 class="text-h5 mt-4">No Quiz History Found</h2>
            <p class="text-body-1 mt-2">You haven't completed any quizzes yet</p>
            <v-btn color="primary" class="mt-6" @click="quizPage">Create Your First Quiz</v-btn>
        </div>

        <template v-else>
            <!-- Table Header -->
            <v-card class="mt-4 rounded-lg pa-4" elevation="0" color="grey-lighten-4">
                <v-row no-gutters class="px-4">
                    <v-col cols="3">
                        <h2 class="text-body-1 font-weight-medium text-grey-darken-2">Lessons</h2>
                    </v-col>
                    <v-col cols="3">
                        <h2 class="text-body-1 font-weight-medium text-grey-darken-2 ml-14">Date</h2>
                    </v-col>
                    <v-col cols="3">
                        <h2 class="text-body-1 font-weight-medium text-grey-darken-2 text-right mr-2">Score</h2>
                    </v-col>
                    <v-col cols="3" class="text-right">
                        <h2 class="text-body-1 font-weight-medium text-grey-darken-2 mr-3">Actions</h2>
                    </v-col>
                </v-row>
            </v-card>

            <!-- Table Content -->
            <v-card 
                v-for="quiz in quizzes" 
                :key="quiz.quizId" 
                class="mt-2 rounded-lg pa-4" 
                elevation="0" 
                color="grey-lighten-4"
            >
                <v-row no-gutters class="px-4 align-center">
                    <v-col cols="3">
                        <p class="text-body-2 font-weight-medium">{{ quiz.title || 'Untitled Quiz' }}</p>
                    </v-col>
                    <v-col cols="3">
                        <p class="text-body-2 text-grey-darken-2">{{ formatDate(quiz.completedAt || quiz.createdAt) }}</p>
                    </v-col>
                    <v-col cols="3">
                        <p class="text-body-2 font-weight-medium text-right">
                            {{ quiz.correctAnswers || 0 }}/{{ quiz.totalQuestions || 0 }} 
                            ({{ calculatePercentage(quiz.correctAnswers, quiz.totalQuestions) }}%)
                        </p>
                    </v-col>
                    <v-col cols="3" class="text-right">
                        <v-btn variant="outlined" color="blue" class="rounded-lg" @click="viewQuizResults(quiz.quizId)">View</v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </template>
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

// Format date to readable string
const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Calculate percentage score
const calculatePercentage = (correct: number, total: number): number => {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
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
</style>
