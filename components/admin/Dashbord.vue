<script setup>
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';


// State management
const selectedPeriod = ref('Today');
const startDate = ref('');
const endDate = ref('');
const searchActive = ref(false);
const totalPrice = ref(250);
const userCount = ref(15);
const currentView = ref('daily');
const loading = ref(false);

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

// Add helper function to update charts
function updateCharts(period) {
  const data = dataPeriods[period];
  if (!data) return;
  
  drawPieChart(data.pieData);
  drawBarChart(data.barData);
  drawSparkline(data.sparklineData);
  
  // Update summary statistics
  totalPrice.value = calculateTotalRevenue(data);
  userCount.value = calculateTotalUsers(data);
}

function calculateTotalRevenue(data) {
  return data.barData.reduce((sum, item) => sum + item.value, 0) * 10;
}

function calculateTotalUsers(data) {
  return data.pieData.reduce((sum, item) => sum + item.value, 0);
}

// Add watcher for period changes
watch(selectedPeriod, (newPeriod) => {
  if (!searchActive.value) {
    updateCharts(newPeriod);
  }
});

// Initialize charts on mount
onMounted(() => {
  updateCharts('Today');
  
  window.addEventListener('resize', () => {
    if (!searchActive.value) {
      updateCharts(selectedPeriod.value);
    }
  });
});

function drawPieChart(data) {
  loading.value = true;
  d3.select("#pieChart").selectAll("*").remove();

  const width = 500;  // Increased size
  const height = 500; // Increased size
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
  const arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4)
    .padAngle(0.02);

  const outerArc = d3.arc()
    .outerRadius(radius * 0.9)
    .innerRadius(radius * 0.9);

  const arcs = pie(data);

  // Add transitions
  const path = svg.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.label))
    .attr('stroke', '#fff')
    .style('stroke-width', '3px')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1);

  // Add labels with animations
  const text = svg.selectAll('text')
    .data(arcs)
    .enter()
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', '500')
    .style('fill', '#fff')
    .style('opacity', 0)
    .text(d => `${d.data.label}: ${d.data.value}`)
    .transition()
    .delay(800)
    .duration(500)
    .style('opacity', 1);

  loading.value = false;
}

function drawBarChart(data) {
  d3.select("#barChart").selectAll("*").remove();

  // Get the container dimensions
  const container = document.getElementById("barChart");
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  const svg = d3.select("#barChart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .range([height, 0]);

  x.domain(data.map(d => d.day));
  y.domain([0, d3.max(data, d => d.value) * 1.2]);

  // Add bars with animation
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.day))
    .attr("width", x.bandwidth())
    .attr("y", height)
    .attr("height", 0)
    .style("fill", "#4e79a7")
    .transition()
    .duration(1000)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));

  // Add value labels
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.day) + x.bandwidth() / 2)
    .attr("y", d => y(d.value) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("opacity", 0)
    .text(d => d.value)
    .transition()
    .delay(1000)
    .duration(500)
    .style("opacity", 1);

  // Add axes with styling
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "12px");

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px");

  // Add X axis label with larger font
  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5) // Adjusted position
    .style("font-size", "16px") // Increased from 14px
    .style("font-weight", "400") // Added bold weight
    .text("Time Period");

  // Add Y axis label with larger font
  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${-margin.left + 20}, ${height/2}) rotate(-90)`) // Adjusted position
    .style("font-size", "16px") // Increased from 14px
    .style("font-weight", "400") // Added bold weight
    .text("Number of Activities");
}

function drawSparkline(data) {
  d3.select("#sparkline").selectAll("*").remove();

  // Get the container dimensions
  const container = document.getElementById("sparkline");
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  const svg = d3.select("#sparkline")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) * 1.2])
    .range([height, 0]);

  const line = d3.line()
    .x((d, i) => x(i))
    .y(d => y(d))
    .curve(d3.curveCatmullRom);

  // Add gradient
  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", y(0))
    .attr("x2", 0)
    .attr("y2", y(d3.max(data)));

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#4e79a7")
    .attr("stop-opacity", 0.2);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#4e79a7")
    .attr("stop-opacity", 1);

  // Add area
  const area = d3.area()
    .x((d, i) => x(i))
    .y0(height)
    .y1(d => y(d))
    .curve(d3.curveCatmullRom);

  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
    .style("fill", "url(#line-gradient)")
    .style("opacity", 0)
    .transition()
    .duration(1000)
    .style("opacity", 0.3);

  // Add line with animation
  const path = svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#4e79a7")
    .attr("stroke-width", 3)
    .attr("d", line);

  const pathLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", pathLength)
    .attr("stroke-dashoffset", pathLength)
    .transition()
    .duration(2000)
    .attr("stroke-dashoffset", 0);

  // Add dots
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d, i) => x(i))
    .attr("cy", d => y(d))
    .attr("r", 5)
    .style("fill", "#fff")
    .style("stroke", "#4e79a7")
    .style("stroke-width", 2)
    .style("opacity", 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .style("opacity", 1);

  // Add axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "12px");

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px");

  // Add X axis label with larger font
  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5) // Adjusted position
    .style("font-size", "16px") // Increased from 14px
    .style("font-weight", "400") // Added bold weight
    .text("Time Points");

  // Add Y axis label with larger font
  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${-margin.left + 20}, ${height/2}) rotate(-90)`) // Adjusted position
    .style("font-size", "16px") // Increased from 14px
    .style("font-weight", "400") // Added bold weight
    .text("Subscription Count");
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
            <div id="pieChart" class="chart-container" />
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
            <div id="sparkline" class="chart-container" />
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
            <div id="barChart" class="chart-container" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
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
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="userCount"
                  label="Total Users"
                  readonly
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>
            </v-row>
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
}

/* Adjust card spacing */
.v-card-title {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-card-text {
  padding: 16px;
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


