<template>
    <p>SDKLfjal;sdkjf;lkaksjdfl;jkasdlfjkasdl;f</p>
    <!-- <AdminGlobalTable></AdminGlobalTable> -->

</template>
<script setup>
definePageMeta({
    layout: 'admin',
});

import { planStore } from '~/store/plan';


const usePlanStore = planStore();
const plans = [];

onMounted(async () => {
    console.log('Plan mounted');
    const response =  await usePlanStore.adminGetPlans();
    console.log('Plan response:', response);
});

</script>