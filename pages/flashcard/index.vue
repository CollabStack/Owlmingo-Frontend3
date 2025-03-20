<template>

  <FlashUpload />
  <SectionDivider />
  <SubscriptionPlan />
  </template>
  <script setup>
  import { ref } from 'vue';
import FlashUpload from '~/components/flashcards/FlashUpload.vue';
import SubscriptionPlan from '~/components/subscription/SubscriptionPlans.vue';
import SectionDivider from '~/components/SectionDivider.vue';
  const selectedTab = ref('document');
  </script>

  

  <style scoped>
    
  </style>
