<template>
  <!-- @subscribe="handleSubscription" -->
  <SubscriptionPlans />
</template>

<script setup>
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans.vue';

const handleSubscription = (data) => {
  // Handle subscription logic here
  console.log('Subscription data:', data);
  // You would typically call your subscription API or navigate to a payment page
};

const handleTabChange = (tab) => {
  // Track tab changes if needed
  console.log('Tab changed to:', tab);
};

const navigateToPlansPage = () => {
  // Navigate to the plans comparison page
  console.log('Navigate to plans comparison page');
  // You can replace this with your actual navigation logic
  // e.g., router.push('/plans')
};
</script>