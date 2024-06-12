<script setup lang="ts">
import Nav from './components/NavComponent.vue'
import './assets/base.css'
import { useStagesStore } from './stores/stages'
import { storeToRefs } from 'pinia'
import resultsData from './data/results'
import type { RacerResults } from './types'

const { bgColor, season, track } = storeToRefs(useStagesStore())
const data = (resultsData[season.value] as RacerResults)[track.value]?.data
</script>

<template>
  <header><Nav /></header>
  <main>
    <div
      class="app transition-colors mx-auto h-screen overflow-scroll sm:overflow-hidden pt-12 sm:pt-16"
    >
      <RouterView :key="$route.fullPath" />
      <div v-if="data" class="absolute bottom-0 w-full flex justify-center">
        <a
          class="w-full sm:w-64 bg-green-700 hover:bg-green-800 transition-colors cursor-pointer rounded-t-md py-1 px-3 font-bold text-xs text-center select-none"
          :href="data"
          target="_blank"
        >
          Detailed breakdown 🔎
        </a>
      </div>
    </div>
  </main>
</template>

<style>
.app {
  background: v-bind(bgColor);
}
</style>
