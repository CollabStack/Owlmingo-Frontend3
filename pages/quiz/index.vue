<template>
  <QuizeUpload />
  <div class="mt-8 mx-16 mb-8">
    <SectionDivider />
  </div>  
  <SubscriptionPlans 
    @subscribe="handleSubscription"
    @tabChange="handleTabChange"
    @linkClick="navigateToPlansPage"
  />
</template>

<script setup>
import Footer from '~/components/Footer.vue';
import QuizeUpload from '~/components/quiz/QuizeUpload.vue';
import SectionDivider from '~/components/SectionDivider.vue';


</script>