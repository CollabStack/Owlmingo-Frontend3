<template>
  <v-container>
    <div v-if="loading" class="d-flex justify-center mt-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    
    <div v-else-if="summary" class="position-relative">
      <!-- Delete button in top corner -->
      <div class="delete-btn-container">
        <v-btn 
          icon 
          variant="flat" 
          color="error" 
          size="small"
          @click="confirmDelete"
          class="delete-btn"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      
      <SummaryDisplay 
        :summary-data="summary" 
        @back="goBack" 
      />
    </div>
    
    <div v-else class="text-center mt-10">
      <h3>Summary not found</h3>
      <v-btn color="primary" class="mt-4" @click="goBack">Go Back</v-btn>
    </div>
    
    <!-- Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Delete Summary</v-card-title>
        <v-card-text>
          Are you sure you want to delete this summary? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteSummary" :loading="deleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const showDeleteDialog = ref(false);
const deleting = ref(false);

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

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const deleteSummary = async () => {
  if (!summary.value) return;
  
  deleting.value = true;
  try {
    // Make sure summaryStore is defined and has the deleteSummary method
    if (!summaryStore || typeof summaryStore.deleteSummary !== 'function') {
      console.error('summaryStore.deleteSummary is not available', summaryStore);
      throw new Error('Delete functionality is not available');
    }
    
    // Using `id` parameter consistently
    const result = await summaryStore.deleteSummary(summary.value.id);
    
    if (result.success) {
      // Close dialog and navigate back to library
      showDeleteDialog.value = false;
      router.push('/library');
    } else {
      alert(result.error || 'Failed to delete summary');
    }
  } catch (error) {
    console.error('Error during deletion:', error);
    alert('An error occurred while deleting the summary');
  } finally {
    deleting.value = false;
  }
};
</script>

<style scoped>
.position-relative {
  position: relative;
}

.delete-btn-container {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}

.delete-btn {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}
</style>
