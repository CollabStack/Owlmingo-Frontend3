<template>
  <div>
    <h2 class="text-h5 mb-4 text-primary">Subscription</h2>

    <!-- Skeleton Loader -->
    <div v-if="loading">
      <v-skeleton-loader type="heading" class="mb-2" />
      <v-skeleton-loader type="text" class="mb-1" />
      <v-skeleton-loader type="text" class="mb-1" />
      <v-skeleton-loader type="button" width="180px" />
    </div>

    <!-- Subscription Plan Info -->
    <div v-else-if="currentPlan">
      <p>
        You are currently on the <strong>{{ currentPlan.plan }}</strong>
        plan.
      </p>
      <p>
        <strong>Price:</strong> {{ currentPlan.total_price }} USD /
        {{ currentPlan.is_annual ? 'Year' : 'Month' }}
      </p>
      <p v-if="expiration">
        <strong>Expires on:</strong> {{ expiration }}
      </p>

      <!-- ✅ Show upgrade only if suggested -->
      <v-btn
        v-if="suggestedPlans.length > 0"
        color="success"
        class="mt-3"
        @click="goToUpgrade"
      >
        Upgrade Plan
      </v-btn>
    </div>

    <!-- Free Plan Fallback -->
    <div v-else>
      <p>You are currently on the <strong>Free Plan</strong>.</p>
      <v-btn color="success" class="mt-3" @click="goToUpgrade">
        Upgrade Plan
      </v-btn>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userAuth } from '~/store/userAuth';
import { useRouter } from 'vue-router';

const userStore = userAuth();
const router = useRouter();

const currentPlan = ref<any>(null);
const suggestedPlans = ref<any[]>([]);
const expiration = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await userStore.getCurrentPlan();
    currentPlan.value = data?.data?.currentPlan || null;
    suggestedPlans.value = data?.data?.suggestedPlans || [];

    if (data?.data?.payment?.expiration) {
      expiration.value = new Date(data.data.payment.expiration).toLocaleDateString();
    }
  } catch (error) {
    console.error('Failed to fetch current plan:', error);
  } finally {
    loading.value = false;
  }
});

function goToUpgrade() {
  router.push('/pricing');
}
</script>
