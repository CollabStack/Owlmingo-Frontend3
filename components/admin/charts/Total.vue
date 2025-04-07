<script setup>
import { ref, watch } from 'vue'; // Add watch import

const props = defineProps({ // Store props in variable
  revenue: {
    type: Number,
    required: true
  },
  users: {
    type: Number, 
    required: true
  }
});

const totalRevenue = ref(props.revenue); // Initialize with prop value
const totalUsers = ref(props.users);

// Update watch to use props variable
watch(() => props.revenue, (newValue) => {
  totalRevenue.value = newValue;
});

watch(() => props.users, (newValue) => {
  totalUsers.value = newValue;
});
</script>

<template>
  <div class="summary">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="totalRevenue"
          label="Total Revenue"
          prefix="$"
          readonly
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-currency-usd"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="totalUsers"
          label="Total Users"
          readonly
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-account"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.summary {
  padding: 16px;
}
</style>