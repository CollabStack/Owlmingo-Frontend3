<!-- <template>
  <v-card class="dashboard-card" rounded="lg" elevation="3">

    <v-card-title class="d-flex align-center mb-2">
      <v-icon :icon="icon" size="28" class="mr-2" color="primary" />
      <span class="font-weight-medium text-h6">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="([key, value], index) in Object.entries(data)"
          :key="index"
        >
          <div class="card-stat">
            <div class="title">{{ formatLabel(key) }}</div>
            <div class="value">{{ value }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: 'Summary',
  },
  icon: {
    type: String,
    default: 'mdi-chart-bar',
  },
});

// Format camelCase to readable title
function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}
</script>

<style scoped>
.dashboard-card {
  padding: 16px;
}

.card-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f3f6fa;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  height: 100%;
  transition: box-shadow 0.2s ease;
}

.card-stat:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.card-stat .title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.card-stat .value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #111;
}
</style> -->


<template>
  <v-card class="dashboard-card" rounded="lg" elevation="3">
    <!-- Card Header -->
    <v-card-title class="d-flex align-center mb-2">
      <v-icon :icon="icon" size="28" class="mr-2" color="primary" />
      <span class="font-weight-medium text-h6">{{ title }}</span>
    </v-card-title>

    <!-- Card Stats -->
    <v-card-text>
      <v-row>
        <v-col
          :cols="12"
          :sm="statCount === 1 ? 12 : 6"
          :md="statCount === 1 ? 12 : 4"
          v-for="([key, value], index) in Object.entries(data)"
          :key="index"
          class="h-100"
        >
          <div class="card-stat">
            <div class="title">{{ formatLabel(key) }}</div>
            <div class="value">{{ value }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: 'Summary',
  },
  icon: {
    type: String,
    default: 'mdi-chart-bar',
  },
});

// Computed stat count for layout
const statCount = computed(() => Object.keys(props.data).length);

// Format key to readable title
function formatLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}
</script>

<style scoped>
.dashboard-card {
  padding: 16px;
}

.card-stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f3f6fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  width: 100%;
  height: 100%;
  transition: box-shadow 0.2s ease;
}

.card-stat:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.card-stat .title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.card-stat .value {
  font-size: 2rem;
  font-weight: bold;
  color: #111;
}
</style>
