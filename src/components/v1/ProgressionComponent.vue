<template>
  <ResultsWrapper :data-available="true">
    <div class="w-full h-full overflow-scroll flex flex-col gap-4 p-3">
      <div>
        <h2 class="text-xl uppercase mb-8 font-bold">Drivers' progression</h2>
        <div class="h-[600px] sm:h-[500px]">
          <Line :options="chartOptions" :data="standingsChartData" />
        </div>
      </div>
      <div>
        <h2 class="text-xl uppercase mb-8 font-bold">Constructors' progression</h2>
        <div class="h-[600px] sm:h-[500px]">
          <Line :options="chartOptions" :data="constructorsChartData" />
        </div>
      </div>
    </div>
  </ResultsWrapper>
</template>

<script setup lang="ts">
// vue-chartjs is naffed for TS
// @ts-nocheck
import { storeToRefs } from 'pinia'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useStagesStore } from '../../stores/stages'
import ResultsWrapper from './ResultsWrapper.vue'
import { getChartData } from '../../utils'

const stagesStore = useStagesStore()
const { season } = storeToRefs(stagesStore)

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
)

ChartJS.defaults.font.family = 'Formula1, sans'
ChartJS.defaults.font.size = 12
ChartJS.defaults.color = '#ddd'

const { labels, standingsDataset, constructorsDataset } = getChartData(season.value)

const standingsChartData = {
  labels,
  datasets: standingsDataset
}

const constructorsChartData = {
  labels,
  datasets: constructorsDataset
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  layout: {
    padding: 20
  },
  scales: {
    y: {
      ticks: {
        callback: function (value: string) {
          return '  ' + value
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
```
