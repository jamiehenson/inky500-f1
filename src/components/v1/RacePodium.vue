<template>
  <div class="race-results-podium flex w-full h-full relative flex-col sm:flex-row">
    <FaderComponent />
    <PodiumCard
      v-for="podiumPlace in [1, 2, 3]"
      :key="podiumPlace"
      :position="podiumPlace"
      :results="results"
    />
  </div>
</template>

<script setup lang="ts">
import type { RacerResult } from '../../types'
import FaderComponent from './FaderComponent.vue'
import PodiumCard from './PodiumCard.vue'

const { results } = defineProps<{ results: RacerResult[] }>()
</script>

<style>
.race-results-podium > div:nth-of-type(2) {
  order: 1;
}
.race-results-podium > div:nth-of-type(3) {
  order: 2;
}
.race-results-podium > div:nth-of-type(4) {
  order: 3;
}

@media screen and (min-width: 640px) {
  .race-results-podium > div:nth-of-type(2) {
    order: 2;
  }
  .race-results-podium > div:nth-of-type(3) {
    order: 1;
  }
}
</style>
