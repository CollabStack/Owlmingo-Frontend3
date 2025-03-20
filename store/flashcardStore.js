import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { userAuth } from './userAuth';

export const useFlashcardStore = defineStore('flashcardStore', {
  state: () => ({
    isGenerating: false,
    currentDeck: null,
    decks: [],
    error: null
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
        let formData = new FormData();
        let endpoint = '/flashcards/generate';
        
        // Prepare request based on type
        switch (type) {
          case 'document':
            if (data instanceof Blob) {
              formData.append('file', data, 'document.pdf');
            } else {
              formData.append('file', data);
            }
            endpoint = '/flashcards/generate-from-file';
            break;
          case 'image':
            formData.append('file', data);
            endpoint = '/flashcards/generate-from-image';
            break;
          case 'video':
            formData.append('file', data);
            endpoint = '/flashcards/generate-from-video';
            break;
          case 'text':
            // For text-based input we use JSON instead of FormData
            break;
          case 'link':
            endpoint = '/flashcards/generate-from-url';
            break;
        }
        
        const response = await $UserPrivateAxios.post(endpoint, 
          type === 'text' || type === 'link' ? { content: data } : formData,
          { 
            headers: { 
              'Content-Type': type === 'text' || type === 'link' ? 'application/json' : 'multipart/form-data' 
            } 
          }
        );
        
        this.currentDeck = response.data.data;
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error('Flashcard generation error:', error);
        this.error = error.response?.data?.message || 'Failed to generate flashcards';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.isGenerating = false;
      }
    },
    
    /**
     * Get all flashcard decks for the current user
     */
    async getDecks() {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      try {
        const response = await $UserPrivateAxios.get('/flashcards');
        this.decks = response.data.data;
        return { authenticated: true, success: true, data: this.decks };
      } catch (error) {
        console.error('Error fetching flashcard decks:', error);
        this.error = error.response?.data?.message || 'Failed to fetch flashcard decks';
        return { authenticated: true, success: false, error: this.error };
      }
    }
  }
});