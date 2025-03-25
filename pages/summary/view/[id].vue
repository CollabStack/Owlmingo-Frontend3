<template>
  <v-container>
    <div v-if="loading" class="d-flex justify-center mt-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    
    <div v-else-if="summary" class="position-relative">
      <!-- Delete button removed -->
      <SummaryDisplay 
        :summary-data="summary" 
        :disable-animation="true"
        @back="goBack" 
      />
    </div>
    
    <div v-else class="text-center mt-10">
      <h3>Summary not found</h3>
      <v-btn color="primary" class="mt-4" @click="goBack">Go Back</v-btn>
    </div>
    
    <!-- Confirmation Dialog removed -->
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSummaryStore } from '~/store/summaryStore';
import SummaryDisplay from '~/components/summary/SummaryDisplay.vue';

const route = useRoute();
const router = useRouter();
const summaryStore = useSummaryStore();
const summary = ref(null);
const loading = ref(true);
// Delete-related refs removed

onMounted(async () => {
  const id = route.params.id;
  try {
    const result = await summaryStore.fetchSummaryById(id);
    if (result.success) {
      summary.value = result.data;
    }
  } catch (error) {
    console.error('Error loading summary:', error);
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push('/library');
};

// Delete-related functions removed
</script>

<style scoped>
.position-relative {
  position: relative;
}

/* Delete button styles removed */
</style>
