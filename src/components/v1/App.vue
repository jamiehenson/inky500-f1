<script setup lang="ts">
import Nav from './NavComponent.vue'
import RaceResults from './RaceResults.vue'
import '../../assets/v1/base.css'
import resultsData from '../../data/results'
import type { ModeName, RacerResults, SeasonName, TrackName } from '../../types'

const { season, track, mode } = defineProps<{
  season: SeasonName
  track: TrackName
  mode: ModeName
}>()
const data = (resultsData[season] as RacerResults)[track]?.data
</script>

<template>
  <header><Nav :season="season" :track="track" :mode="mode" /></header>
  <main>
    <div
      class="app transition-colors mx-auto h-screen overflow-scroll sm:overflow-hidden pt-12 sm:pt-16"
    >
      <RaceResults :season="season" :track="track" :mode="mode" />
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
