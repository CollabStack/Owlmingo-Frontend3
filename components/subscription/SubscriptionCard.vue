<template>
    <v-card class="pa-6 text-left rounded-lg plan-card" elevation="2">
      <p class="text-h4 font-weight-bold mb-1 outfit outfit-bold" :class="plan.colorClass">
        {{ plan.name }}
      </p>
  
      <!-- Price & Billing Info -->
      <div class="price-container">
        <p class="text-h4 font-weight-bold mb-1 outfit outfit-bold animated-price">
          <template v-if="selectedTab === 'school'">
            {{ plan.price }} <span class="text-h6">/month</span>
          </template>
          <template v-else>
            {{ selectedTypes[plan.name] === 'month' ? plan.monthlyPrice : plan.annualPrice }}
            <span class="text-h6">/month</span>
          </template>
        </p>
        <p class="text-h7 text-grey-darken-1 mb-1 outfit outfit-regular">
          {{ selectedTab === 'school' ? plan.billing : selectedTypes[plan.name] === 'month' ? plan.monthlyBilling : plan.annualBilling }}
        </p>
      </div>
  
      <!-- Features List -->
      <v-list class="text-left feature-list">
        <v-list-item
          v-for="(feature, i) in plan.features"
          :key="i"
          class="align-start feature-item"
          v-motion
          :initial="{ opacity: 0, x: -10 }"
          :enter="{ opacity: 1, x: 0, transition: { delay: 400 + (i * 100), duration: 500 } }"
        >
          <template #prepend>
            <div class="checkmark-container">
              <v-icon :color="plan.iconColor" class="checkmark-icon">mdi-check-circle</v-icon>
            </div>
          </template>
          <v-list-item-content>
            <v-list-item-title class="outfit outfit-regular">{{ feature }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  
      <!-- Subscribe Button -->
      <v-btn
        block
        :color="plan.buttonColor"
        class="mt-4 rounded-lg animated-btn outfit outfit-medium"
        rounded
        :variant="getButtonVariant(plan.name)"
        @click="$emit('subscribe', { plan, type: selectedTab, billing: selectedTab === 'work' ? selectedTypes[plan.name] : plan.name.toLowerCase() })"
      >
        <span class="d-flex align-center">
          {{ buttonText }}
          <v-icon class="ms-2 btn-icon">mdi-check-circle</v-icon>
        </span>
      </v-btn>
    </v-card>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    plan: Object,
    selectedTab: String,
    selectedTypes: Object,
    buttonText: String,
    getButtonVariant: Function,
  });
  
  const emit = defineEmits(["subscribe"]);
  </script>
  
  <style scoped>
  /* Add the necessary styles or import them from the parent component */
  .plan-card {
    border-radius: 20px !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom: 3px solid transparent;
    height: 100%;
    overflow: hidden;
  }
  
  .plan-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
    border-bottom: 3px solid var(--v-primary);
  }
  
  /* Additional styles for price, feature list, etc. */
  </style>
  