import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const adminPlanStore = defineStore('adminPlanStore', {
  state: () => ({
    plans: [], // Store the fetched plans
  }),

  actions: {
    // Fetch the plans from the API
    async adminGetPlans() {
      const { $AdminPrivateAxios } = useNuxtApp();
      try {
        // Fetch the plans data from your backend
        const response = await $AdminPrivateAxios.get('/plans');
        this.plans = response.data.data || [];  // Store the plans in the state
        console.log("=========================== Plans =========================");
        console.log("Response:", this.plans);
        console.log("=========================== Plans =========================");

        return this.plans;  // Return the plans to the page
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        this.plans = [];  // Reset the plans if an error occurs
        throw error;  // Propagate the error
      }
    },
  }
});