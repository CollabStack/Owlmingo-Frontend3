<template>
  <div>
    <AdminGlobalTable
      :title="'Plans'"
      :items="dessertsData"
      :headers="headers"
      :isLoading="isLoading"
      :showEdit="true"
      :showActivate="true"
      :showDeactivate="true"
    >
    </AdminGlobalTable>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      closable
    >
      {{ error }}
    </v-alert>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { adminPlanStore } from '~/store/adminPlan';

definePageMeta({
  layout: 'admin',
});

const { $AdminPrivateAxios } = useNuxtApp();
const planStore = adminPlanStore();
const isLoading = ref(false);
const error = ref(null);

// Function to get and set auth token
const setupAuthToken = () => {
  // Try both possible token keys
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
  
  if (!token) {
    console.error('No authentication token found');
    return null;
  }

  // Set the auth header
  $AdminPrivateAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return token;
};

const headers = ref([
  { text: "Name", value: "name" },
  { text: "Plan", value: "plan" },
  { text: "Price", value: "price" },
  { text: "Duration", value: "duration" },
]);

onMounted(async () => {
  error.value = null;
  isLoading.value = true;
  
  try {
    const token = setupAuthToken();
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }
    
    await planStore.adminGetPlans();
    console.log('Plans loaded:', planStore.plans); // Debug log
    
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch plans';
    console.error('Error fetching plans:', err);
  } finally {
    isLoading.value = false;
  }
});

const dessertsData = computed(() => planStore.plans || []);

// Debug helper - remove in production
// const debugAuth = () => {
//   console.log('Auth headers:', $AdminPrivateAxios?.defaults?.headers);
//   console.log('Token in localStorage:', localStorage.getItem('admin_token'));
// };

// Call debug helper
debugAuth();
</script>


