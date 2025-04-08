<template>
  <div class="ma-2">
    <!-- Global Table for Plans -->
    <AdminGlobalTable
      :title="'Plans'"
      :items="plans"
      :headers="headers"
      :isLoading="isLoading"
      :showEdit="true"
      :showActivate="true"
      :showDeactivate="true"
      @edit-click="onEditClick"
      @activatePlan="activatePlan"
      @deactivatePlan="deactivatePlan"
    />

    <!-- Error Alert if any -->
    <v-alert v-if="error" type="error" variant="tonal" closable>
      {{ error }}
    </v-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminPlanStore } from '~/store/adminPlan';

definePageMeta({
  layout: 'admin',
});

const userAdminPlanStore = adminPlanStore();

// State variables
const plans = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Headers for the table
const headers = [
  { text: 'Plan Name', value: 'plan' },
  { text: 'Price', value: 'price' },
  { text: 'Total Price', value: 'total_price' },
  { text: 'Duration', value: 'duration' },
  { text: 'Is Annual', value: 'is_annual' },
  { text: 'Description', value: 'description' },
  { text: 'Is Active', value: 'is_active' },
];

// Fetch plans when the component is mounted
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await userAdminPlanStore.adminGetPlans();

    // Log the fetched data for debugging
    console.log("Plans response:", response);

    // Assuming `response` is an array, ensure you're directly using it
    plans.value = Array.isArray(response) ? response : Object.values(response);

    // Log to ensure correct data
    console.log("plans.value", plans.value);
  } catch (err) {
    error.value = err.message || 'Error fetching plans.';
  } finally {
    isLoading.value = false;
  }
});

// Handle editing a plan
const onEditClick = (planId) => {
  console.log('Edit plan with ID:', planId);  // You should now be able to get the plan ID
  // Implement the logic to edit a plan
};

// Handle activating a plan
const activatePlan = (planId) => {
  console.log('Activate plan with ID:', planId);
  // Implement the logic to activate the plan
};

// Handle deactivating a plan
const deactivatePlan = (planId) => {
  console.log('Deactivate plan with ID:', planId);
  // Implement the logic to deactivate the plan
};
</script>
