import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { userAuth } from './userAuth';

export const useFlashcardStore = defineStore('flashcardStore', {
  state: () => ({
    isGenerating: false,
    currentDeck: null,
    decks: [],
    error: null,
    loading: false,
    currentCard: null,
    sessions: [],
  }),
  
  actions: {
    /**
     * Generate flashcards using the auth-protected API
     * @param {Object} data - The data to generate the flashcards from (text, file, etc)
     * @param {String} type - The type of input (document, text, image, video, link)
     */
    async generateFlashcards(data, type) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      // Check authentication first
      if (!authStore.isLoggedIn) {
        // Return false to indicate authentication required
        return { authenticated: false };
      }
      
      this.isGenerating = true;
      this.error = null;
      
      try {
        let requestData = {};
        
        // Prepare request based on type
        switch (type) {
          case 'document':
          case 'image':
          case 'video':
            // For file uploads, handle the OCR ID properly
            if (typeof data === 'string') {
              // Directly use the id as fileOcrId
              requestData = { fileOcrId: data };
              console.log('Sending fileOcrId in request:', data);
            } else {
              // Assume it's raw text if not a file ID
              requestData = { text: data };
              console.log('Sending text in request (length):', data.length);
            }
            break;
          case 'text':
          case 'link':
            // For text and links, send as text
            requestData = { text: data };
            console.log('Sending text in request (length):', data.length);
            break;
          case 'custom':
            // For manually created flashcards
            requestData = {
              flashcards: data,
              flash_card_title: "Custom Flashcards"
            };
            console.log('Sending custom flashcards:', data.length, 'cards');
            break;
        }
        
        // Validate request data to prevent 400 errors
        if (!requestData.text && !requestData.fileOcrId && !requestData.flashcards) {
          throw new Error('Either text or fileOcrId is required');
        }
        
        // Add logging to see what is being sent
        console.log('Final request data:', JSON.stringify(requestData));
        
        // Fixed API endpoint - removing duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.post('/flashcards/generate', requestData);
        
        this.currentDeck = response.data.data;
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error('Flashcard generation error:', error);
        // Enhanced error message to include more details
        let errorMessage = 'Failed to generate flashcards';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.error = errorMessage;
        return { authenticated: true, success: false, error: errorMessage };
      } finally {
        this.isGenerating = false;
      }
    },
    
    /**
     * Get all flashcard decks for the current user
     * @param {Object} params - Query parameters for filtering, sorting, etc.
     */
    async getDecks(params = {}) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.get('/flashcards', { params });
        this.decks = response.data.data.flashCards;
        return { 
          authenticated: true, 
          success: true, 
          data: this.decks, 
          count: response.data.data.count 
        };
      } catch (error) {
        console.error('Error fetching flashcard decks:', error);
        this.error = error.response?.data?.message || 'Failed to fetch flashcard decks';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Get a single flashcard deck by its global ID
     * @param {String} globalId - The global ID of the flashcard deck
     */
    async getDeck(globalId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.get(`/flashcards/${globalId}`);
        this.currentDeck = response.data.data;
        return { authenticated: true, success: true, data: this.currentDeck };
      } catch (error) {
        console.error(`Error fetching flashcard deck ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to fetch flashcard deck';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Update a flashcard deck or a specific card within the deck
     * @param {String} globalId - The global ID of the flashcard deck
     * @param {Object} data - The data to update
     */
    async updateDeck(globalId, data) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.put(`/flashcards/${globalId}`, data);
        
        // Update local state if this is the current deck
        if (this.currentDeck && this.currentDeck.globalId === globalId) {
          this.currentDeck = response.data.data;
        }
        
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error updating flashcard deck ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to update flashcard deck';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Delete a flashcard deck
     * @param {String} globalId - The global ID of the flashcard deck
     */
    async deleteDeck(globalId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        await $UserPrivateAxios.delete(`/flashcards/${globalId}`);
        
        // Update local state by removing the deleted deck
        this.decks = this.decks.filter(deck => deck.globalId !== globalId);
        
        // Clear current deck if it was the one deleted
        if (this.currentDeck && this.currentDeck.globalId === globalId) {
          this.currentDeck = null;
        }
        
        return { authenticated: true, success: true };
      } catch (error) {
        console.error(`Error deleting flashcard deck ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to delete flashcard deck';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Add a card to a flashcard deck
     * @param {String} flashCardId - The ID of the flashcard deck
     * @param {Object} cardData - The data for the new card
     */
    async addCard(flashCardId, cardData) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.post(`/flashcards/${flashCardId}/cards`, cardData);
        
        // Update current deck if applicable
        if (this.currentDeck && this.currentDeck._id === flashCardId) {
          this.currentDeck = response.data.data;
        }
        
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error adding card to deck ${flashCardId}:`, error);
        this.error = error.response?.data?.message || 'Failed to add card to deck';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Get a specific card from a flashcard deck
     * @param {String} flashCardId - The ID of the flashcard deck
     * @param {String} cardId - The ID of the card
     */
    async getCard(flashCardId, cardId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.get(`/flashcards/${flashCardId}/cards/${cardId}`);
        this.currentCard = response.data.data;
        return { authenticated: true, success: true, data: this.currentCard };
      } catch (error) {
        console.error(`Error fetching card ${cardId} from deck ${flashCardId}:`, error);
        this.error = error.response?.data?.message || 'Failed to fetch card';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Delete a specific card from a flashcard deck
     * @param {String} globalId - The global ID of the flashcard deck
     * @param {String} cardId - The ID of the card
     */
    async deleteCard(globalId, cardId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.delete(`/flashcards/${globalId}/cards/${cardId}`);
        
        // Update current deck if applicable
        if (this.currentDeck && this.currentDeck.globalId === globalId) {
          this.currentDeck = response.data.data;
        }
        
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error deleting card ${cardId} from deck ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to delete card';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Evaluate an answer for a specific card
     * @param {String} globalId - The global ID of the flashcard deck
     * @param {String} cardId - The ID of the card
     * @param {String} userAnswer - The user's answer to evaluate
     */
    async evaluateAnswer(globalId, cardId, userAnswer) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Log the API endpoint being called
        console.log(`Calling exam API: /flashcards/${globalId}/cards/${cardId}/exam with answer:`, userAnswer.substring(0, 20) + (userAnswer.length > 20 ? '...' : ''));
        
        // Make API call to evaluation endpoint
        const response = await $UserPrivateAxios.post(`/flashcards/${globalId}/cards/${cardId}/exam`, {
          userAnswer
        });
        
        // Log successful response
        console.log("Exam API response:", response.data);
        
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error evaluating answer for card ${cardId}:`, error);
        this.error = error.response?.data?.message || 'Failed to evaluate answer';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Upload an image for a card (front or back)
     * @param {String} globalId - The global ID of the flashcard deck
     * @param {String} cardId - The ID of the card
     * @param {File} imageFile - The image file to upload
     * @param {String} side - Either 'front' or 'back'
     */
    async uploadCardImage(globalId, cardId, imageFile, side) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      if (side !== 'front' && side !== 'back') {
        return { 
          authenticated: true, 
          success: false, 
          error: 'Side must be either "front" or "back"' 
        };
      }
      
      this.loading = true;
      
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.post(
          `/flashcards/${globalId}/cards/${cardId}/images/${side}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        // Update current deck if applicable
        if (this.currentDeck && this.currentDeck.globalId === globalId) {
          this.currentDeck = response.data.data;
        }
        
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error uploading ${side} image for card ${cardId}:`, error);
        this.error = error.response?.data?.message || `Failed to upload ${side} image`;
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Get all flashcard sessions
     */
    async getSessions() {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.get('/flashcards/sessions');
        this.sessions = response.data.data.sessions;
        return { 
          authenticated: true, 
          success: true, 
          data: this.sessions,
          count: response.data.data.count
        };
      } catch (error) {
        console.error('Error fetching flashcard sessions:', error);
        this.error = error.response?.data?.message || 'Failed to fetch flashcard sessions';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Get a specific flashcard session
     * @param {String} globalId - The global ID of the session
     */
    async getSession(globalId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.get(`/flashcards/sessions/${globalId}`);
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error fetching flashcard session ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to fetch flashcard session';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Update a card review in a session
     * @param {String} sessionId - The ID of the session
     * @param {String} cardId - The ID of the card
     * @param {Object} reviewData - The review data
     */
    async updateCardReview(sessionId, cardId, reviewData) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.post(
          `/flashcards/sessions/${sessionId}/cards/${cardId}/review`,
          reviewData
        );
        
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error updating card review for card ${cardId} in session ${sessionId}:`, error);
        this.error = error.response?.data?.message || 'Failed to update card review';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Get all sessions for a specific flashcard
     * @param {String} flashCardId - The ID of the flashcard
     */
    async getSessionsForFlashcard(flashCardId) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.get(`/flashcards/${flashCardId}/sessions`);
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error fetching sessions for flashcard ${flashCardId}:`, error);
        this.error = error.response?.data?.message || 'Failed to fetch sessions';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Toggle sharing status for a flashcard
     * @param {String} globalId - The global ID of the flashcard
     * @param {Boolean} isPublic - Whether the flashcard should be public
     */
    async toggleSharing(globalId, isPublic) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.loading = true;
      
      try {
        // Remove duplicate 'auth/' from URL path
        const response = await $UserPrivateAxios.put(`/flashcards/${globalId}/share`, { isPublic });
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error toggling sharing for flashcard ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to toggle sharing';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Get a shared flashcard (public route)
     * @param {String} globalId - The global ID of the shared flashcard
     */
    async getSharedFlashcard(globalId) {
      const { $UserPublicAxios } = useNuxtApp();
      
      try {
        const response = await $UserPublicAxios.get(`/shared/flashcards/${globalId}`);
        return { success: true, data: response.data.data };
      } catch (error) {
        console.error(`Error fetching shared flashcard ${globalId}:`, error);
        this.error = error.response?.data?.message || 'Failed to fetch shared flashcard';
        return { success: false, error: this.error };
      }
    },
    
    clearCurrentDeck() {
      this.currentDeck = null;
    },
    
    clearError() {
      this.error = null;
    }
  }
});