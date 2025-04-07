import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const adminPlanStore = defineStore('adminPlanStore', {
  state: () => ({
    plans: [],
  }),

  actions: {
    async adminGetPlans() {
      const { $AdminPrivateAxios } = useNuxtApp();
      try {
        // Using the correct API endpoint path
        const response = await $AdminPrivateAxios.get('/plans');
        this.plans = response.data.data || [];
        return this.plans;
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        this.plans = [];
        throw error;
      }
    }
  }
});