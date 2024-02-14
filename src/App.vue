<script setup lang="ts">
import Nav from './components/NavComponent.vue'
import RaceResults from './components/RaceResults.vue'
import './assets/base.css'
import resultsData from './standings/results.json'
import { useStagesStore } from './stores/stages'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { RacerResults } from './types'

const { bgColor } = storeToRefs(useStagesStore())
const { season, track } = storeToRefs(useStagesStore())

const dataAvailable = computed(() => (resultsData[season.value] as RacerResults)[track.value])
</script>

<template>
  <RouterView :key="$route.fullPath">
    <header><Nav /></header>
    <main>
      <div class="app transition-colors mx-auto h-screen pt-16 lg:pt-20">
        <RaceResults v-if="dataAvailable" />
        <div v-else>No data</div>
      </div>
    </main>
  </RouterView>
</template>

<style>
.app {
  background: v-bind(bgColor);
}
</style>
