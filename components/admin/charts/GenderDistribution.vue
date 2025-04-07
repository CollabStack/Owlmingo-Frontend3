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

function drawPieChart(data) {
  d3.select('#pieChart').selectAll('*').remove();

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = chartContainer.value.offsetWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;

  // Updated gender-specific colors
  const genderColors = {
    'Male': '#2196F3',    // Blue for male
    'Female': '#FF4081',  // Pink for female
    'Other': '#9E9E9E'    // Grey for other
  };

  // Create SVG
  const svg = d3.select('#pieChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  // Create pie layout
  const pie = d3.pie()
    .value(d => d.value)
    .sort(null)
    .padAngle(0.02);

  // Create arc generator
  const arc = d3.arc()
    .innerRadius(radius * 0.4)
    .outerRadius(radius * 0.8);

  // Create arc for labels
  const labelArc = d3.arc()
    .innerRadius(radius * 0.85)
    .outerRadius(radius * 0.85);

  // Add gradient definitions
  const defs = svg.append('defs');
  
  Object.entries(genderColors).forEach(([gender, color]) => {
    const gradient = defs.append('linearGradient')
      .attr('id', `gradient-${gender}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d3.color(color).brighter(0.2))
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d3.color(color).darker(0.2))
      .attr('stop-opacity', 1);
  });

  // Create pie slices with animations
  const slices = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('class', 'slice')
    .attr('fill', d => `url(#gradient-${d.data.label})`)
    .attr('d', arc)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1);

  // Add percentage labels
  const percentageLabels = svg.selectAll('.percentage-label')
    .data(pie(data))
    .enter()
    .append('text')
    .attr('class', 'percentage-label')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .style('fill', 'white')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .style('opacity', 0)
    .text(d => `${Math.round((d.value / d3.sum(data, d => d.value)) * 100)}%`)
    .transition()
    .delay(1000)
    .duration(500)
    .style('opacity', 1);

  // Add legend
  const legend = svg.selectAll('.legend')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(${radius + 30}, ${-radius + 40 + i * 25})`);

  legend.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .attr('rx', 4)
    .style('fill', d => genderColors[d.label]);

  legend.append('text')
    .attr('x', 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('fill', '#333')
    .style('font-size', '14px')
    .text(d => `${d.label} (${d.value})`);

  // Add hover effects
  svg.selectAll('.slice')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('transform', 
          `translate(${arc.centroid(d).map(v => v * 0.1)}) scale(1.05)`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('transform', 'translate(0,0) scale(1)');
    });
}

onMounted(() => {
  if (props.data && chartContainer.value) {
    drawPieChart(props.data);
  }
});

watch(() => props.data, (newData) => {
  if (newData && chartContainer.value) {
    drawPieChart(newData);
  }
}, { immediate: true });
</script>

<template>
  <div id="pieChart" ref="chartContainer" class="chart-container" />
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slice {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.percentage-label {
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.legend text {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#pieChart svg {
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}
</style>