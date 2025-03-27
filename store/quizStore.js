import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { userAuth } from './userAuth';

export const useQuizStore = defineStore('quizStore', {
  state: () => ({
    isGenerating: false,
    currentQuiz: null,
    quizzes: [],
    error: null,
    isLoading: false,
    activeQuestionIndex: 0, // Track the current question being displayed
    answers: {}, // Store user answers: { questionIndex: optionId }
    apiBaseUrl: 'https://owlmingo-16f448c07f1f.herokuapp.com/api/v1'
  }),
  
  getters: {
    // Get the current question
    currentQuestion(state) {
      if (!state.currentQuiz?.questions) return null;
      return state.currentQuiz.questions[state.activeQuestionIndex] || null;
    },
    
    // Get the user's selected option for the current question
    selectedOption(state) {
      return state.answers[state.activeQuestionIndex];
    },
    
    // Check if all questions have been answered
    isQuizComplete(state) {
      if (!state.currentQuiz?.questions) return false;
      const answeredCount = Object.keys(state.answers).length;
      return answeredCount === state.currentQuiz.questions.length;
    },
    
    // Calculate the score
    score(state) {
      if (!state.currentQuiz?.progress) return 0;
      return state.currentQuiz.progress.score;
    },
    
    // Get total questions
    totalQuestions(state) {
      if (!state.currentQuiz?.questions) return 0;
      return state.currentQuiz.questions.length;
    }
  },
  
  actions: {
    /**
     * Generate a quiz using the auth-protected API
     * @param {string} fileId - The ID of the processed file
     */
    async generateQuiz(fileId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      // Check authentication first
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.isGenerating = true;
      this.error = null;
      
      try {
        const endpoint = 'http://api.owlmingo.space/api/v1/user/auth/quiz/generate';
        const payload = { fileOcrId: fileId };

        const response = await $UserPrivateAxios.post(endpoint, payload, {
          headers: { 'Content-Type': 'application/json' }
        });

        this.currentQuiz = response.data;
        return { authenticated: true, success: true, data: this.currentQuiz };
      } catch (error) {
        console.error('Quiz generation error:', error);
        this.error = error.response?.data?.message || 'Failed to generate quiz';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.isGenerating = false;
      }
    },

    /**
     * Fetch a quiz by ID
     * @param {string} quizId - The ID of the quiz to fetch
     */
    async fetchQuiz(quizId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const endpoint = `${this.apiBaseUrl}/user/auth/quiz/${quizId}/review`;
        
        const response = await $UserPrivateAxios.get(endpoint);
        
        this.currentQuiz = response.data;
        this.activeQuestionIndex = 0;
        this.answers = {};
        
        return { authenticated: true, success: true, data: this.currentQuiz };
      } catch (error) {
        console.error('Quiz fetch error:', error);
        this.error = error.response?.data?.message || 'Failed to fetch quiz';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Submit an answer for a question
     * @param {string} optionId - The ID of the selected option
     */
    async submitAnswer(optionId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn || !this.currentQuiz) {
        return { authenticated: false };
      }
      
      try {
        const questionIndex = this.activeQuestionIndex;
        const quizId = this.currentQuiz.quizId;
        
        // Store the answer locally (this ensures UI still works even if API fails)
        this.answers[questionIndex] = optionId;
        
        console.log(`Submitting answer for quiz ${quizId}, question ${questionIndex}, option ${optionId}`);
        
        // Check if the current question already has the isAnswered flag
        // If yes, we can skip the API call as the answer was likely already submitted
        const currentQuestion = this.currentQuiz.questions[questionIndex];
        if (currentQuestion.isAnswered) {
          console.log('Question already marked as answered, skipping API call');
          return { success: true, isCorrect: currentQuestion.isCorrect };
        }
        
        // Try with RESTful API pattern (assumes your API follows REST conventions)
        const endpoint = `${this.apiBaseUrl}/quizzes/${quizId}/questions/${questionIndex}/answer`;
        console.log(`Trying submission with new endpoint: ${endpoint}`);
        
        // Simple payload with just the answer ID
        const payload = { optionId };
        
        try {
          const response = await $UserPrivateAxios.post(endpoint, payload);
          console.log('Answer submission response:', response.data);
          
          // Update question status on success
          this.updateQuestionStatus(questionIndex, optionId, response.data);
          
          return { success: true, isCorrect: response.data.isCorrect };
        } catch (apiError) {
          console.error('API call failed, marking answer locally:', apiError);
          
          // If API call fails, we still want to update the UI to show an answer was selected
          // We'll determine correctness based on the option metadata if available
          this.updateQuestionStatusLocally(questionIndex, optionId);
          
          // Re-throw to be caught by outer try-catch
          throw apiError;
        }
      } catch (error) {
        console.error('Answer submission error:', error);
        
        // Add more detailed error information for debugging
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          
          // Log the actual error message from the server if available
          if (error.response.data && error.response.data.message) {
            console.error('Server error message:', error.response.data.message);
          }
        }
        
        // Even though API failed, we'll return partial success to show the user their selection
        return { 
          success: true, // Treating as "UI success" even though API failed
          isCorrect: this.currentQuiz.questions[this.activeQuestionIndex]?.isCorrect || false,
          apiError: true, 
          error: error.response?.data?.message || 'Failed to submit answer',
          statusCode: error.response?.status 
        };
      }
    },

    /**
     * Helper method to update question status based on API response
     */
    updateQuestionStatus(questionIndex, optionId, responseData) {
      if (this.currentQuiz.questions[questionIndex]) {
        const question = this.currentQuiz.questions[questionIndex];
        question.isAnswered = true;
        question.isCorrect = responseData.isCorrect;
        
        // Update progress if available in response
        if (responseData.progress) {
          this.currentQuiz.progress = responseData.progress;
        }
      }
    },

    /**
     * Helper method to update question status locally when API fails
     */
    updateQuestionStatusLocally(questionIndex, optionId) {
      if (this.currentQuiz.questions[questionIndex]) {
        const question = this.currentQuiz.questions[questionIndex];
        question.isAnswered = true;
        
        // Try to determine if answer is correct based on option metadata
        const selectedOption = question.options.find(opt => opt.id === optionId);
        if (selectedOption) {
          question.isCorrect = selectedOption.isCorrect === true;
        } else {
          question.isCorrect = false; // Default to incorrect if we can't determine
        }
        
        // Update progress estimate
        this.updateProgressEstimate();
      }
    },

    /**
     * Helper method to estimate progress when API calls fail
     */
    updateProgressEstimate() {
      const questions = this.currentQuiz.questions || [];
      const answeredQuestions = questions.filter(q => q.isAnswered);
      const correctAnswers = questions.filter(q => q.isAnswered && q.isCorrect);
      
      if (!this.currentQuiz.progress) {
        this.currentQuiz.progress = {};
      }
      
      this.currentQuiz.progress.answeredQuestions = answeredQuestions.length;
      this.currentQuiz.progress.correctAnswers = correctAnswers.length;
      this.currentQuiz.progress.score = questions.length > 0 
        ? Math.round((correctAnswers.length / questions.length) * 100)
        : 0;
      this.currentQuiz.progress.status = answeredQuestions.length === questions.length 
        ? 'completed' 
        : 'in_progress';
    },
    
    // Move to the next question
    nextQuestion() {
      if (this.activeQuestionIndex < this.totalQuestions - 1) {
        this.activeQuestionIndex++;
        return true;
      }
      return false;
    },
    
    // Move to the previous question
    previousQuestion() {
      if (this.activeQuestionIndex > 0) {
        this.activeQuestionIndex--;
        return true;
      }
      return false;
    },
    
    // Reset the current quiz state
    resetQuiz() {
      this.currentQuiz = null;
      this.activeQuestionIndex = 0;
      this.answers = {};
      this.error = null;
    },

    /**
     * Save quiz to history after completion
     */
    saveToHistory() {
      if (!this.currentQuiz) return;
      
      console.log('Saving quiz to history with answers:', this.answers);
      
      // Make sure each question has its selectedOptionId stored directly
      const questionsWithAnswers = this.currentQuiz.questions?.map((question, index) => {
        const selectedOptionId = this.answers[index];
        let selectedOption = null;
        
        // Find the selected option object
        if (selectedOptionId) {
          selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        }
        
        // Return enhanced question with selection info
        return {
          ...question,
          selectedOptionId, // Store the ID of the selected option
          selectedOption,   // Store a reference to the selected option
          selectedIndex: index // Store the index for easier lookup
        };
      }) || [];
      
      // Log for debugging
      console.log('Questions with answers:', questionsWithAnswers.map(q => ({
        question: q.question.substring(0, 30),
        selectedOptionId: q.selectedOptionId,
        isCorrect: q.isCorrect
      })));
      
      // Create a summary object with quiz details
      const quizSummary = {
        quizId: this.currentQuiz.quizId || this.currentQuiz._id,
        title: this.currentQuiz.title || 'Quiz',
        completedAt: new Date().toISOString(),
        createdAt: this.currentQuiz.createdAt || new Date().toISOString(),
        correctAnswers: this.currentQuiz.progress?.correctAnswers || 0,
        totalQuestions: this.currentQuiz.questions?.length || 0,
        score: this.currentQuiz.progress?.score || 0,
        status: 'completed',
        questions: questionsWithAnswers,
        answers: { ...this.answers } // Store a copy of the answers object
      };
      
      // Check if quiz is already in history
      const existingIndex = this.quizzes.findIndex(q => q.quizId === quizSummary.quizId);
      
      if (existingIndex >= 0) {
        // Update existing quiz in history
        this.quizzes[existingIndex] = {
          ...this.quizzes[existingIndex],
          ...quizSummary
        };
      } else {
        // Add new quiz to history
        this.quizzes.unshift(quizSummary);
      }
      
      // Also save to localStorage for persistence
      try {
        localStorage.setItem('quizHistory', JSON.stringify(this.quizzes));
      } catch (error) {
        console.error('Error saving quiz history to localStorage:', error);
      }
    },
    
    /**
     * Fetch quiz sessions from the API and update history
     * @param {boolean} force - Force refresh even if data exists
     * @param {Object} options - Query options
     * @param {string} [options.status] - Filter by status ("not_started", "in_progress", "completed")  
     * @param {string} [options.sort] - Sort field and direction (default is "-startedAt") 
     */
    async fetchQuizSessions(force = false, options = {}) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      // Return cached data if not forcing refresh and we have data
      if (!force && this.quizzes.length > 0) {
        return { authenticated: true, success: true, data: this.quizzes };
      }
      
      this.isLoading = true;
      
      try {
        // Build endpoint URL with query parameters
        let endpoint = 'http://api.owlmingo.space/api/v1/user/auth/quiz/sessions';
        
        // Add query parameters if provided
        const queryParams = new URLSearchParams();
        if (options.status) queryParams.append('status', options.status);
        if (options.sort) queryParams.append('sort', options.sort);
        
        // Append query string if there are parameters
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
        
        const response = await $UserPrivateAxios.get(endpoint);
        
        // Process response data
        if (response.data && response.data.sessions) {
          const apiSessions = response.data.sessions.map(session => ({
            quizId: session._id,
            id: session._id, // For compatibility with existing code
            title: session.source?.fileName || 'Untitled Quiz',
            createdAt: session.startedAt || session.createdAt,
            completedAt: session.status === 'completed' ? session.updatedAt : null,
            correctAnswers: session.quiz?.correctCount || 0,
            totalQuestions: session.quiz?.totalQuestions || 0,
            score: session.quiz?.score || 0,
            status: session.status || 'not_started',
            source: session.source,
            timeSpent: session.timeSpent
          }));
          
          // Merge with existing quizzes, preserving local data like tags
          const localQuizzes = [...this.quizzes];
          apiSessions.forEach(apiSession => {
            const existingIndex = localQuizzes.findIndex(q => q.quizId === apiSession.quizId);
            if (existingIndex >= 0) {
              // Preserve local data like tags
              const existingTags = localQuizzes[existingIndex].tags || [];
              localQuizzes[existingIndex] = {
                ...localQuizzes[existingIndex],
                ...apiSession,
                tags: existingTags
              };
            } else {
              localQuizzes.unshift(apiSession);
            }
          });
          
          this.quizzes = localQuizzes;
          this.saveHistoryToLocalStorage();
          
          return { 
            authenticated: true, 
            success: true, 
            data: this.quizzes, 
            count: response.data.count || apiSessions.length 
          };
        }
        
        return { authenticated: true, success: true, data: this.quizzes };
      } catch (error) {
        console.error('Error fetching quiz sessions:', error);
        return { 
          authenticated: true, 
          success: false, 
          error: error.response?.data?.message || 'Failed to fetch quiz sessions'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Helper function to save quiz history to localStorage
     */
    saveHistoryToLocalStorage() {
      try {
        localStorage.setItem('quizHistory', JSON.stringify(this.quizzes));
      } catch (error) {
        console.error('Error saving quiz history to localStorage:', error);
      }
    },

    /**
     * Load quiz history from both localStorage and API
     */
    async loadHistory() {
      try {
        const savedHistory = localStorage.getItem('quizHistory');
        if (savedHistory) {
          this.quizzes = JSON.parse(savedHistory);
        }
        await this.fetchQuizSessions();
      } catch (error) {
        console.error('Error loading quiz history:', error);
      }
    },

    /**
     * Update a quiz question
     * @param {string} quizId - The ID of the quiz
     * @param {number} questionIndex - Index of the question to update
     * @param {object} questionData - New question data
     */
    async updateQuestion(quizId, questionIndex, questionData) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const endpoint = `${this.apiBaseUrl}/user/auth/quiz/${quizId}/questions/${questionIndex}`;
        
        const response = await $UserPrivateAxios.put(endpoint, questionData);
        
        // If the current quiz is loaded and matches the one we're updating
        if (this.currentQuiz && this.currentQuiz.quizId === quizId) {
          // Update the question in the current quiz
          if (this.currentQuiz.questions && this.currentQuiz.questions.length > questionIndex) {
            this.currentQuiz.questions[questionIndex] = {
              ...this.currentQuiz.questions[questionIndex],
              ...response.data.question
            };
          }
        }
        
        return { authenticated: true, success: true, data: response.data };
      } catch (error) {
        console.error('Question update error:', error);
        this.error = error.response?.data?.message || 'Failed to update question';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    }
  }
});