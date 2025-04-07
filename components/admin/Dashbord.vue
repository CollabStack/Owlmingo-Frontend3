<script setup>
import { ref, onMounted } from 'vue';
import GenderDistribution from './charts/GenderDistribution.vue';
import SubscriptionTrends from './charts/SubscriptionTrends.vue';
import WeeklyActivity from './charts/WeeklyActivity.vue';
import Total from './charts/Total.vue';
const selectedPeriod = ref('Today');
const startDate = ref('');
const endDate = ref('');
const searchActive = ref(false);
const totalPrice = ref(250);
const userCount = ref(15);

// Sample data periods
const dataPeriods = {
  Today: {
    pieData: [
      { label: 'Male', value: 45 },
      { label: 'Female', value: 35 },
      { label: 'Other', value: 20 }
    ],
    barData: [
      { day: 'Mon', value: 10 },
      { day: 'Tue', value: 15 },
      { day: 'Wed', value: 20 },
      { day: 'Thu', value: 25 },
      { day: 'Fri', value: 22 },
      { day: 'Sat', value: 30 },
      { day: 'Sun', value: 28 }
    ],
    sparklineData: [4, 8, 15, 16, 23, 42, 38]
  },
  Monthly: {
    pieData: [
      { label: 'Male', value: 120 },
      { label: 'Female', value: 150 },
      { label: 'Other', value: 80 }
    ],
    barData: [
      { day: 'Week 1', value: 45 },
      { day: 'Week 2', value: 52 },
      { day: 'Week 3', value: 65 },
      { day: 'Week 4', value: 78 }
    ],
    sparklineData: [20, 40, 45, 60, 55, 75, 80]
  },
  Yearly: {
    pieData: [
      { label: 'Male', value: 1200 },
      { label: 'Female', value: 1500 },
      { label: 'Other', value: 800 }
    ],
    barData: [
      { day: 'Q1', value: 250 },
      { day: 'Q2', value: 320 },
      { day: 'Q3', value: 380 },
      { day: 'Q4', value: 420 }
    ],
    sparklineData: [100, 150, 200, 180, 250, 300, 280]
  }
};

function handleSearch() {
  // Implement search functionality
}
</script>

<template>
  <div class="admin-dashboard py-6 px-4">
    <!-- Period Selection -->
    <v-card class="mb-6 period-selector" elevation="2">
      <v-card-text>
        <div class="d-flex flex-wrap justify-center gap-4">
          <v-btn-group variant="outlined" rounded="pill">
            <v-btn 
              v-for="period in ['Today', 'Monthly', 'Yearly']" 
              :key="period"
              :color="selectedPeriod === period ? 'primary' : undefined"
              @click="selectedPeriod = period; searchActive = false"
              class="px-6"
            >
              {{ period }}
            </v-btn>
          </v-btn-group>

          <v-btn-group variant="outlined" rounded="pill">
            <v-text-field
              v-model="startDate"
              type="date"
              prepend-icon="mdi-calendar-start"
              hide-details
              density="comfortable"
              class="date-input"
            />
            <v-text-field
              v-model="endDate"
              type="date"
              prepend-icon="mdi-calendar-end"
              hide-details
              density="comfortable"
              class="date-input"
            />
          </v-btn-group>

          <v-btn 
            color="primary" 
            prepend-icon="mdi-magnify"
            rounded="pill"
            @click="handleSearch"
            :disabled="!startDate || !endDate"
          >
            Search
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Charts Grid -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon left class="me-2">mdi-chart-pie</v-icon>
            Gender Distribution
          </v-card-title>
          <v-card-text>
            <GenderDistribution :data="dataPeriods[selectedPeriod].pieData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon left class="me-2">mdi-chart-line</v-icon>
            Subscription Trends
          </v-card-title>
          <v-card-text>
            <SubscriptionTrends :data="dataPeriods[selectedPeriod].sparklineData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon left class="me-2">mdi-chart-bar</v-icon>
            Weekly Activity
          </v-card-title>
          <v-card-text>
            <WeeklyActivity :data="dataPeriods[selectedPeriod].barData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon left class="me-2">mdi-information</v-icon>
            Total
          </v-card-title>
          <v-card-text>
            <Total 
              :revenue="totalPrice"
              :users="userCount"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
.chart-container {
  min-height: 500px;
  position: relative;
  padding: 16px;
  margin: 0; /* Remove margin-bottom */
}

.v-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%; /* Make cards equal height */
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
}

.v-card-title {
  padding: 20px 24px; /* Increase padding */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 1.25rem !important; /* Make title bigger */
  font-weight: 600 !important; /* Make title bolder */
  letter-spacing: 0.5px;
  color: #1a237e; /* Darker blue for better contrast */
}

.v-card-title .v-icon {
  font-size: 1.5rem !important; /* Make icons bigger */
  margin-right: 12px !important; /* More space between icon and text */
  color: #1976D2; /* Match your theme color */
}

.v-card-title.d-flex.align-center {
  background: linear-gradient(145deg, #f8f9ff, #ffffff);
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Period selector adjustments */
.period-selector {
  background: linear-gradient(145deg, #ffffff, #f8f9ff);
  margin-bottom: 24px; /* Consistent spacing */
}

/* Grid spacing adjustments */
.v-row {
  margin: 0 -12px;
}

.v-col {
  padding: 12px;
}

.mb-6 {
  margin-bottom: 24px !important; /* Consistent spacing */
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .chart-container {
    min-height: 400px;
  }
  
  .date-input {
    min-width: 120px;
  }

  .v-card-title {
    padding: 16px 20px;
    font-size: 1.1rem !important;
  }
  
  .v-card-title .v-icon {
    font-size: 1.3rem !important;
  }
}

@media (max-width: 600px) {
  .chart-container {
    min-height: 300px;
  }
  
  .v-card-title {
    padding: 12px 16px;
  }
  
  .v-card-text {
    padding: 12px;
  }
}

/* Chart specific styles */
.bar:hover {
  opacity: 0.8;
}

.dot:hover {
  r: 8;
  transition: r 0.2s ease;
}

.area {
  pointer-events: none;
}

.axis-label {
  fill: #2c3e50; /* Darker color for better contrast */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
/* Add specific styles for pie chart container */
#pieChart {
  display: flex;
  justify-content: center;
  align-items: center;
}

#pieChart svg {
  max-width: 100%;
  height: auto;
}

/* Update chart container for pie chart */
.v-card:has(#pieChart) .chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
</style>


