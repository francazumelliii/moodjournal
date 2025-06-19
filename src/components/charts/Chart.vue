<script setup>
import { computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  chartType: {
    type: String,
    default: 'line'
  },
  chartData: {
    type: Array,
    default: () => []
  },
  chartHeight: {
    type: [Number, String],
    default: 350
  },
  chartTitle: {
    type: String,
    default: ''
  },
  chartLabels: {
    type: Array,
    default: () => []
  }
});

const chartOptions = computed(() => ({
  chart: {
    type: props.chartType,
    height: typeof props.chartHeight === 'string' ? parseInt(props.chartHeight) : props.chartHeight,
    zoom: { enabled: true }
  },
  labels: props.chartLabels,
  colors: [
    '#6FCF97', // Ansia – verde menta
    '#F67280', // Rabbia – rosso corallo
    '#9B59B6', // Paura – viola ametista
    '#F9E79F', // Gioia – giallo tenue caldo
    '#5DADE2'  // Tristezza – azzurro cielo
  ]
,

  stroke: {
    curve: 'smooth',
    width: 2
  },
  dataLabels: { enabled: false },
  markers: { size: 4 },
  xaxis: {
    type: 'datetime',
    labels: { format: 'dd MMM' },
    tooltip: { enabled: true }
  },
  yaxis: {
    min: 0,
    max: 100,
    title: { text: 'Level' }
  },
  tooltip: {
    x: { format: 'dd MMM yyyy' }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center'
  }
}));
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h3 v-if="chartTitle" class="dark:text-gray-100 text-center mb-4">{{ chartTitle }}</h3>
    <VueApexCharts
        :type="chartType"
        :height="typeof chartHeight === 'string' ? parseInt(chartHeight) : chartHeight"
        :options="chartOptions"
        :series="chartData"
    />
  </div>
</template>
