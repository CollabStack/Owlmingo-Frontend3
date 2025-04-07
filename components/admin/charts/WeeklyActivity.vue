<script setup>
import { onMounted, watch, ref } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const chartContainer = ref(null);

function drawBarChart(data) {
  d3.select('#barChart').selectAll('*').remove();

  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = chartContainer.value.offsetWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#barChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales with padding
  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .range([height, 0]);

  x.domain(data.map(d => d.day));
  y.domain([0, d3.max(data, d => d.value) * 1.1]); // Add 10% padding to top

  // Add bars with transitions
  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.day))
    .attr('width', x.bandwidth())
    .attr('y', height)
    .attr('height', 0)
    .attr('fill', '#2196F3')
    .transition()
    .duration(800)
    .attr('y', d => y(d.value))
    .attr('height', d => height - y(d.value));

  // Add X axis with label
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .call(g => g.select('.domain').attr('stroke-width', 2))
    .selectAll('text')
    .style('font-size', '12px');

  svg.append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', height + 45)
    .style("font-size", "16px")
    .style("font-weight", "400")
    .text('Time Period');

  // Add Y axis with label
  svg.append('g')
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').attr('stroke-width', 2))
    .selectAll('text')
    .style('font-size', '12px');

  svg.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -45)
    .style("font-size", "16px")
    .style("font-weight", "400")
    .text('Activity Count');

  // Add hover effects
  svg.selectAll('.bar')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', '#1976D2');

      svg.append('text')
        .attr('class', 'value-label')
        .attr('x', x(d.day) + x.bandwidth() / 2)
        .attr('y', y(d.value) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d.value);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', '#2196F3');
      
      svg.selectAll('.value-label').remove();
    });
}

onMounted(() => {
  if (props.data && chartContainer.value) {
    drawBarChart(props.data);
  }
});

watch(() => props.data, (newData) => {
  if (newData && chartContainer.value) {
    drawBarChart(newData);
  }
}, { immediate: true });
</script>

<template>
  <div id="barChart" ref="chartContainer" class="chart-container" />
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  padding: 16px;
}

.bar {
  transition: fill 0.2s ease;
}

.bar:hover {
  opacity: 1;
}

.axis-label {
  fill: #666;
  font-size: 14px;
  font-weight: 500;
}
</style>