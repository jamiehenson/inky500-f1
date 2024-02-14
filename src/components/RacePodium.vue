<template>
  <div class="race-results-podium flex w-full h-full relative">
    <FaderComponent />
    <PodiumCard
      v-for="podiumPlace in [2, 1, 3]"
      :key="podiumPlace"
      :position="podiumPlace"
      :results="results"
    />
  </div>
</template>

<script setup lang="ts">
import FaderComponent from './FaderComponent.vue'
import PodiumCard from './PodiumCard.vue'

const { results } = defineProps<{ results: any }>()
</script>
