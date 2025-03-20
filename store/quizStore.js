import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { userAuth } from './userAuth';

export const useQuizStore = defineStore('quizStore', {
  state: () => ({
    isGenerating: false,
    currentQuiz: null,
    quizzes: [],
    error: null
  }),
  
  actions: {
    /**
     * Generate a quiz using the auth-protected API
     * @param {Object} data - The data to generate the quiz from (text, file, etc)
     * @param {String} type - The type of input (document, text, image, video, link)
     */
    async generateQuiz(data, type) {
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
        let endpoint = '/quiz/generate';
        
        // Prepare request based on type
        switch (type) {
          case 'document':
            if (data instanceof Blob) {
              formData.append('file', data, 'document.pdf');
            } else {
              formData.append('file', data);
            }
            endpoint = '/quiz/generate-from-file';
            break;
          case 'image':
            formData.append('file', data);
            endpoint = '/quiz/generate-from-image';
            break;
          case 'video':
            formData.append('file', data);
            endpoint = '/quiz/generate-from-video';
            break;
          case 'text':
            // For text-based input we use JSON instead of FormData
            break;
          case 'link':
            endpoint = '/quiz/generate-from-url';
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
        
        this.currentQuiz = response.data.data;
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error('Quiz generation error:', error);
        this.error = error.response?.data?.message || 'Failed to generate quiz';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.isGenerating = false;
      }
    }
  }
});