<template>
  <div class="summary-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <SummaryUpload />
          <SectionDivider />
          <SubscriptionPlan />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import SummaryUpload from '~/components/summary/SummaryUpload.vue';
import SubscriptionPlan from '~/components/subscription/SubscriptionPlans.vue';
import SectionDivider from '~/components/SectionDivider.vue'; 
// Remove the auth middleware to prevent automatic redirects
// definePageMeta({
//   middleware: ['auth']
// });
</script>

<style scoped>
.summary-container {
  padding: 24px;
}
</style>
