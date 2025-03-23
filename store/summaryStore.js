import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { userAuth } from './userAuth';

export const useSummaryStore = defineStore('summaryStore', {
  state: () => ({
    isGenerating: false,
    currentSummary: null,
    summaries: [],
    error: null,
    isLoading: false
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
    },
    
    /**
     * Fetch all summaries for the current user
     * @returns {Promise<Array>} - List of user summaries
     */
    async fetchSummaries() {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      // Check authentication first
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $UserPrivateAxios.get('/summaries');
        
        if (response.data && response.data.status === 'success') {
          this.summaries = response.data.data.map(summary => ({
            id: summary.id,
            title: summary.title,
            subtitle: summary.fileInfo?.fileName || 'Text Summary',
            description: summary.content.substring(0, 100) + (summary.content.length > 100 ? '...' : ''),
            wordCount: summary.content.split(/\s+/).filter(Boolean).length,
            lastUpdated: new Date(summary.updatedAt).toLocaleDateString(),
            tags: [], // Tags would need to be associated in your backend or handled separately
            content: summary.content,
            originalText: summary.originalText
          }));
          
          return { success: true, data: this.summaries };
        } else {
          throw new Error(response.data?.message || 'Failed to fetch summaries');
        }
      } catch (error) {
        console.error('Error fetching summaries:', error);
        this.error = error.message || 'Failed to fetch summaries';
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Fetch a single summary by ID
     * @param {string} id - The ID of the summary to fetch
     */
    async fetchSummaryById(id) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.isLoading = true;
      
      try {
        const response = await $UserPrivateAxios.get(`/summaries/${id}`);
        
        if (response.data && response.data.status === 'success') {
          this.currentSummary = response.data.data;
          return { success: true, data: this.currentSummary };
        } else {
          throw new Error(response.data?.message || 'Failed to fetch summary');
        }
      } catch (error) {
        console.error(`Error fetching summary ${id}:`, error);
        return { success: false, error: error.message };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Delete a summary by ID
     * @param {string} id - The ID of the summary to delete
     * @returns {Promise<Object>} - Result of the deletion
     */
    async deleteSummary(id) {
      const authStore = userAuth();
      const { $UserPrivateAxios } = useNuxtApp();
      
      if (!authStore.isLoggedIn) {
        return { authenticated: false };
      }
      
      this.isLoading = true;
      
      try {
        // Using 'id' parameter instead of 'globalId'
        const response = await $UserPrivateAxios.delete(`/summaries/${id}`);
        
        if (response.data && response.data.status === 'success') {
          // Remove the deleted summary from the local state
          this.summaries = this.summaries.filter(summary => summary.id !== id);
          
          return { success: true };
        } else {
          throw new Error(response.data?.message || 'Failed to delete summary');
        }
      } catch (error) {
        console.error(`Error deleting summary ${id}:`, error);
        return { 
          success: false, 
          error: error.response?.data?.message || error.message || 'Failed to delete summary' 
        };
      } finally {
        this.isLoading = false;
      }
    }
  }
});