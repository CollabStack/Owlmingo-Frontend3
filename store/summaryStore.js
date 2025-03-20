import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { userAuth } from './userAuth';

export const useSummaryStore = defineStore('summaryStore', {
  state: () => ({
    isGenerating: false,
    currentSummary: null,
    summaries: [],
    error: null
  }),
  
  actions: {
    /**
     * Generate a summary using the auth-protected API
     * @param {Object} data - The data to generate the summary from (text, file, etc)
     * @param {String} type - The type of input (document, text, image, video, link)
     */
    async generateSummary(data, type) {
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
        let endpoint = '/summary/generate';
        
        // Prepare request based on type
        switch (type) {
          case 'document':
            if (data instanceof Blob) {
              formData.append('file', data, 'document.pdf');
            } else {
              formData.append('file', data);
            }
            endpoint = '/summary/generate-from-file';
            break;
          case 'image':
            formData.append('file', data);
            endpoint = '/summary/generate-from-image';
            break;
          case 'video':
            formData.append('file', data);
            endpoint = '/summary/generate-from-video';
            break;
          case 'text':
            // formData.append('content', data);
            break;
          case 'link':
            // formData.append('url', data);
            endpoint = '/summary/generate-from-url';
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
        
        this.currentSummary = response.data.data;
        return { authenticated: true, success: true, data: response.data.data };
      } catch (error) {
        console.error('Summary generation error:', error);
        this.error = error.response?.data?.message || 'Failed to generate summary';
        return { authenticated: true, success: false, error: this.error };
      } finally {
        this.isGenerating = false;
      }
    }
  }
});