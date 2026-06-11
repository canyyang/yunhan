<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'bar',
  },
  data: {
    type: Array,
    default: () => [],
  },
})

const chartRef = ref()
let chart

const render = () => {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)

  const names = props.data.map((item) => item.name)
  const values = props.data.map((item) => item.value)
  const option =
    props.type === 'pie'
      ? {
          tooltip: { trigger: 'item' },
          legend: { bottom: 0 },
          series: [
            {
              type: 'pie',
              radius: ['45%', '70%'],
              data: props.data,
            },
          ],
        }
      : {
          tooltip: { trigger: 'axis' },
          grid: { left: 32, right: 16, top: 20, bottom: 32 },
          xAxis: { type: 'category', data: names },
          yAxis: { type: 'value' },
          series: [
            {
              type: 'bar',
              data: values,
              itemStyle: { borderRadius: [8, 8, 0, 0] },
            },
          ],
        }

  chart.setOption(option)
}

const resize = () => chart?.resize()

onMounted(() => {
  render()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})

watch(() => props.data, render, { deep: true })
</script>

<template>
  <section class="chart-card admin-card">
    <h3>{{ title }}</h3>
    <div ref="chartRef" class="chart"></div>
  </section>
</template>

<style scoped>
.chart-card {
  padding: 20px;
}

h3 {
  margin: 0 0 14px;
  color: #0f172a;
}

.chart {
  height: 280px;
}

@media (max-width: 768px) {
  .chart-card {
    padding: 14px;
  }

  h3 {
    font-size: 16px;
  }

  .chart {
    height: 220px;
  }
}
</style>
