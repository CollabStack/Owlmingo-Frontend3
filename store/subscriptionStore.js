import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

export const subscriptionStore = defineStore('subscriptionStore',{
  id: 'mySubscriptionStore',
  state: () => ({ }),
  actions: {
    async checkSubscription(planId) {
      const { $UserPrivateAxios } = useNuxtApp();
      try {
        console.log("======================================");
        console.log("Checking subscription for plan ID:", planId);
        console.log("===================== Subscription ======================");
        const response = await $UserPrivateAxios.post('check-subscription', {planId});
                        //  await $UserPrivateAxios.post('check-subscription', { planId: planId });

        console.log('Subscription check response:', response);
        return response;
      } catch (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }
    }
  }
})
