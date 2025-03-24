<template>
    <v-container fluid>
      <!-- Stat Cards -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-4 d-flex flex-column align-center text-center rounded-lg">
            <v-icon color="yellow" size="32">mdi-chart-line</v-icon>
            <h2 class="font-weight-bold mt-2">3450</h2>
            <p class="text-caption">Clients</p>
            <v-chip color="green" class="mt-2">
              <v-icon small left>mdi-arrow-up</v-icon> 25%
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4 d-flex flex-column align-center text-center rounded-lg">
            <v-icon color="blue" size="32">mdi-finance</v-icon>
            <h2 class="font-weight-bold mt-2">35,256</h2>
            <p class="text-caption">Subscribe</p>
            <v-chip color="green" class="mt-2">
              <v-icon small left>mdi-arrow-up</v-icon> 15%
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4 d-flex flex-column align-center text-center rounded-lg">
            <v-icon color="green" size="32">mdi-cash</v-icon>
            <h2 class="font-weight-bold mt-2">$35.256</h2>
            <p class="text-caption">Average Price</p>
            <v-chip color="red" class="mt-2">
              <v-icon small left>mdi-arrow-down</v-icon> 15%
            </v-chip>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Subscribe Analytics -->
      <v-row >
        <v-col cols="12">
          <v-card class="pa-4 rounded-lg">
            <h3 class="font-weight-bold mb-4">Subscribe Analytics</h3>
            <apexchart type="line" height="330" :options="chartOptions" :series="series"></apexchart>
            <img src="" alt="">
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const series = ref([
    {
      name: 'Subscribers',
      data: [120, 150, 180, 200, 230, 280, 310, 370, 400, 450, 500, 550]
    }
  ])
  
  const chartOptions = ref({
    chart: { type: 'line', height: 350 },
    stroke: { curve: 'smooth' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    colors: ['#4F46E5'],
  })
  
  // Simulate live updates
  onMounted(() => {
    setInterval(() => {
      const newSubscribers = Math.floor(Math.random() * 50) + 50
      series.value[0].data.push(newSubscribers)
      series.value[0].data.shift()
    }, 5000)
  })
  </script>
  