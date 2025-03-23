<template>
  <v-container>
    <div v-if="loading" class="d-flex justify-center mt-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    
    <div v-else-if="summary" class="summary-edit-container">
      <div class="d-flex align-center mb-5">
        <v-btn 
          icon 
          variant="outlined"
          color="primary"
          @click="goBack" 
          class="mr-3 back-btn elevation-1"
          size="small"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="text-h4 font-weight-bold mb-0 outfit outfit-bold gradient-text">
          Edit Summary
        </h1>
      </div>
      
      <v-card class="mb-6 pa-4">
        <v-form @submit.prevent="saveSummary">
          <v-text-field
            v-model="editedSummary.title"
            label="Title"
            variant="outlined"
            class="mb-4"
            required
          ></v-text-field>
          
          <v-textarea
            v-model="editedSummary.content"
            label="Content"
            variant="outlined"
            rows="12"
            auto-grow
            required
          ></v-textarea>
          
          <div class="d-flex justify-end mt-4">
            <v-btn
              variant="text"
              class="mr-2"
              @click="goBack"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              :loading="saving"
            >
              Save Changes
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
    
    <div v-else class="text-center mt-10">
      <h3>Summary not found</h3>
      <v-btn color="primary" class="mt-4" @click="goBack">Go Back</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSummaryStore } from '~/store/summaryStore';
import { useNuxtApp } from '#app';

const route = useRoute();
const router = useRouter();
const { $UserPrivateAxios } = useNuxtApp();
const summaryStore = useSummaryStore();
const summary = ref(null);
const loading = ref(true);
const saving = ref(false);
const editedSummary = reactive({
  title: '',
  content: ''
});

onMounted(async () => {
  const id = route.params.id;
  try {
    const result = await summaryStore.fetchSummaryById(id);
    if (result.success) {
      summary.value = result.data;
      editedSummary.title = summary.value.title;
      editedSummary.content = summary.value.content;
    }
  } catch (error) {
    console.error('Error loading summary:', error);
  } finally {
    loading.value = false;
  }
});

const saveSummary = async () => {
  const id = route.params.id;
  saving.value = true;
  
  try {
    const response = await $UserPrivateAxios.put(`/summaries/${id}`, {
      title: editedSummary.title,
      content: editedSummary.content
    });
    
    if (response.data && response.data.status === 'success') {
      // Refresh summaries in store
      await summaryStore.fetchSummaries();
      router.push('/library');
    }
  } catch (error) {
    console.error('Error saving summary:', error);
    alert('Failed to save summary. Please try again.');
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  router.push('/library');
};
</script>

<style scoped>
.summary-edit-container {
  max-width: 900px;
  margin: 0 auto;
}

.gradient-text {
  background: linear-gradient(90deg, #7b83e0, #9D7BFC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.back-btn {
  transition: transform 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-3px);
}
</style>
