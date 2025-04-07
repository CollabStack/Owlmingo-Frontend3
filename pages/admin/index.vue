<script setup>
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';

definePageMeta({
  layout: 'admin',
});

// State management
const selectedPeriod = ref('Today');
const startDate = ref('');
const endDate = ref('');
const searchActive = ref(false);
const totalPrice = ref(250);
const userCount = ref(15);
const currentView = ref('daily');

// Sample data organized by periods
const dataPeriods = {
  Today: {
    pieData: [
      { label: 'Male', value: 25 },
      { label: 'Female', value: 20 },
      { label: 'Other', value: 5 }
    ],
    barData: [15, 20, 25, 30, 10, 35, 40],
    subscriptionData: [5, 7, 6, 8, 7, 9, 10],
    revenue: 250,
    users: 15
  },
  Monthly: {
    pieData: [
      { label: 'Male', value: 150 },
      { label: 'Female', value: 130 },
      { label: 'Other', value: 45 }
    ],
    barData: [45, 60, 75, 90, 40, 85, 95],
    subscriptionData: [120, 135, 110, 150, 170, 145, 160],
    revenue: 1500,
    users: 45
  },
  Yearly: {
    pieData: [
      { label: 'Male', value: 450 },
      { label: 'Female', value: 400 },
      { label: 'Other', value: 150 }
    ],
    barData: [250, 300, 450, 600, 200, 650, 750],
    subscriptionData: [1000, 1200, 1400, 1300, 1500, 1600, 1700],
    revenue: 15000,
    users: 150
  }
};

// Chart drawing functions
function drawPieChart(data) {
  d3.select("#pieChart").selectAll("*").remove();

  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  const svg = d3.select("#pieChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(["#4e79a7", "#f28e2b", "#e15759"]);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().outerRadius(radius).innerRadius(0);
  const arcs = pie(data);

  svg.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.label))
    .attr('stroke', '#fff')
    .style('stroke-width', '2px');

  svg.selectAll('text')
    .data(arcs)
    .enter()
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .style('font-size', '13px')
    .style('fill', '#fff')
    .text(d => `${d.data.label}: ${d.data.value}`);
}

function drawBarChart(data) {
  d3.select("#barChart").selectAll("*").remove();

  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleBand()
    .domain(data.map((d, i) => i))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d))
    .attr("height", d => y(0) - y(d))
    .attr("width", x.bandwidth())
    .attr("fill", "steelblue");

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(i => `#${i + 1}`));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));
}

function drawSparkline(data) {
  d3.select("#sparkline").selectAll("*").remove();

  const width = 400;
  const height = 150;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const x = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
    .x((d, i) => x(i))
    .y(d => y(d))
    .curve(d3.curveMonotoneX);

  const svg = d3.select("#sparkline")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(data.length));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#4e79a7")
    .attr("stroke-width", 2)
    .attr("d", line);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => x(i))
    .attr("cy", d => y(d))
    .attr("r", 3)
    .attr("fill", "#4e79a7");
}

// Update functions
function updateCharts(period) {
  const data = dataPeriods[period];
  if (data) {
    drawPieChart(data.pieData);
    drawBarChart(data.barData);
    drawSparkline(data.subscriptionData);
    totalPrice.value = data.revenue;
    userCount.value = data.users;
  }
}

function handleSearch() {
  if (!startDate.value || !endDate.value) return;
  
  searchActive.value = true;
  // In a real application, you would fetch data for the date range
  // For demo, we'll show monthly data when searching
  updateCharts('Monthly');
}

function resetData() {
  totalPrice.value = 0;
  userCount.value = 0;
  startDate.value = '';
  endDate.value = '';
  searchActive.value = false;
  selectedPeriod.value = 'Today';
  updateCharts('Today');
}

// Watchers and lifecycle hooks
watch(selectedPeriod, (newPeriod) => {
  if (!searchActive.value) {
    updateCharts(newPeriod);
  }
});

onMounted(() => {
  updateCharts('Today');
});
</script>

<template>
  <div class="admin-dashboard">
    <v-container class="pa-6">
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
          <v-card elevation="2" class="chart-card">
            <v-card-title class="d-flex align-center">
              <v-icon left class="me-2">mdi-chart-pie</v-icon>
              Gender Distribution
            </v-card-title>
            <v-card-text>
              <div id="pieChart" class="chart-container"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2" class="chart-card">
            <v-card-title class="d-flex align-center">
              <v-icon left class="me-2">mdi-chart-line</v-icon>
              Subscription Trends
            </v-card-title>
            <v-card-text>
              <div id="sparkline" class="chart-container"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2" class="chart-card">
            <v-card-title class="d-flex align-center">
              <v-icon left class="me-2">mdi-chart-bar</v-icon>
              Weekly Activity
            </v-card-title>
            <v-card-text>
              <div id="barChart" class="chart-container"></div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2" class="chart-card">
            <v-card-title class="d-flex align-center">
              <v-icon left class="me-2">mdi-information</v-icon>
              Summary
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="totalPrice"
                    label="Total Revenue"
                    prefix="$"
                    readonly
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-currency-usd"
                    class="summary-field"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="userCount"
                    label="Total Users"
                    readonly
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-group"
                    class="summary-field"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                color="primary"
                prepend-icon="mdi-refresh"
                variant="text"
                @click="resetData"
              >
                Reset Data
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.admin-dashboard {
  background-color: #f5f5f7;
  min-height: 100vh;
}

.period-selector {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.chart-card {
  border-radius: 16px;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.chart-container {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.v-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-field {
  transition: all 0.3s ease;
}

.summary-field:hover {
  transform: translateY(-2px);
}

.gap-4 {
  gap: 16px;
}

.date-input {
  max-width: 160px;
}

.date-input :deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
}

@media (max-width: 600px) {
  .v-container {
    padding: 12px;
  }
  
  .chart-container {
    min-height: 250px;
  }
  
  .period-selector .v-card-text {
    padding: 12px;
  }
}
</style>