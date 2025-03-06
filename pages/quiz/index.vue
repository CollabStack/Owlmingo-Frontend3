<template>

    <Quiz-QuizeGenerator />
    <SectionDivider />
    <SubscriptionPlans 
    @subscribe="handleSubscription"
    @tabChange="handleTabChange"
    @linkClick="navigateToPlansPage"
  />
   
    <Footer />


</template>

<script setup>
import Footer from '~/components/Footer.vue';
import SectionDivider from '~/components/SectionDivider.vue';


</script>