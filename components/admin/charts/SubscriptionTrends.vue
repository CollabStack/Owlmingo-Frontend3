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

function drawSparkline(data) {
  d3.select('#sparkline').selectAll('*').remove();

  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const width = chartContainer.value.offsetWidth - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select('#sparkline')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales with padding
  const x = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data) * 1.1]) // Add 10% padding to top
    .range([height, 0]);

  // Add gradient definition
  const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "area-gradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#2196F3")
    .attr("stop-opacity", 0.3);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#2196F3")
    .attr("stop-opacity", 0.05);

  // Create area generator
  const area = d3.area()
    .x((d, i) => x(i))
    .y0(height)
    .y1(d => y(d))
    .curve(d3.curveMonotoneX);

  // Add the area
  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
    .attr("fill", "url(#area-gradient)")
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1);

  // Create line with transition (move this after area)
  const line = d3.line()
    .x((d, i) => x(i))
    .y(d => y(d))
    .curve(d3.curveMonotoneX);

  const path = svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', '#2196F3')
    .attr('stroke-width', 2);

  // Animate the line
  const length = path.node().getTotalLength();
  path.attr('stroke-dasharray', length + ' ' + length)
    .attr('stroke-dashoffset', length)
    .attr('d', line)
    .transition()
    .duration(1000)
    .attr('stroke-dashoffset', 0);

  // Add dots with transitions
  svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', (d, i) => x(i))
    .attr('cy', d => y(d))
    .attr('r', 0)
    .attr('fill', '#2196F3')
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr('r', 4);

  // Add X axis with label
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(data.length))
    .call(g => g.select('.domain').attr('stroke-width', 2));

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
    .call(g => g.select('.domain').attr('stroke-width', 2));

  svg.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -45)
    .style("font-size", "16px")
    .style("font-weight", "400")
    .text('Subscription Count');

  // Add hover effects
  const tooltip = svg.append('g')
    .attr('class', 'tooltip')
    .style('display', 'none');

  tooltip.append('circle')
    .attr('r', 6)
    .style('fill', '#1976D2');

  tooltip.append('text')
    .attr('class', 'value-label')
    .attr('x', 9)
    .attr('dy', '0.35em')
    .style('font-size', '12px')
    .style('font-weight', 'bold');

  svg.selectAll('.dot')
    .on('mouseover', function(event, d) {
      const [x, y] = d3.pointer(event);
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 6)
        .attr('fill', '#1976D2');

      tooltip.attr('transform', `translate(${x},${y})`);
      tooltip.select('text').text(d);
      tooltip.style('display', null);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 4)
        .attr('fill', '#2196F3');
      tooltip.style('display', 'none');
    });
}

onMounted(() => {
  if (props.data && chartContainer.value) {
    drawSparkline(props.data);
  }
});

watch(() => props.data, (newData) => {
  if (newData && chartContainer.value) {
    drawSparkline(newData);
  }
}, { immediate: true });
</script>

<template>
  <div id="sparkline" ref="chartContainer" class="chart-container" />
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  padding: 16px;
}

.dot {
  transition: all 0.2s ease;
}

.line {
  transition: stroke-width 0.2s ease;
}

.area {
  transition: opacity 0.2s ease;
}

.axis-label {
  fill: #666;
  font-size: 14px;
  font-weight: 500;
}

.value-label {
  fill: #333;
}
</style>