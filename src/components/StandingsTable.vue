<template>
  <div class="race-results flex w-full h-full relative">
    <FaderComponent />
    <PodiumCard v-if="isRace" :position="1" class="flex-1 hidden sm:block" :results="results" />
    <div class="flex-[2_2_0%] p-3 sm:p-5 flex flex-col standing-bg w-full">
      <div class="flex justify-between">
        <h2 class="text-xl sm:text-2xl font-bold uppercase mb-3">
          Inky 500 Season {{ season.slice(1) }} - {{ trackData[track].name }}
          <span :class="['fi-' + trackData[track].countryCode, 'fi rounded-sm mx-2']"></span>
        </h2>
        <div class="hidden sm:block uppercase text-gray-300 text-right">Powered by Koozies</div>
      </div>
      <h1 class="hidden sm:block text-5xl uppercase font-bold text-gray-300">{{ title }}</h1>
      <div class="flex mb-1">
        <div class="flex-1"></div>
        <div class="flex-1"></div>
        <div
          v-if="isRace"
          class="w-26 sm:w-40 text-center uppercase text-gray-300 font-bold text-sm sm:text-md"
        >
          Time
        </div>
        <div
          class="hidden sm:block w-24 text-center uppercase text-gray-300 font-bold text-sm sm:text-md"
        >
          Points
        </div>
        <div
          class="sm:hidden w-14 sm:w-24 text-center uppercase text-gray-300 font-bold text-sm sm:text-md"
        >
          Pts
        </div>
      </div>
      <div class="flex-1">
        <div
          v-for="(page, pageNumber) in paginatedResults"
          :key="pageNumber"
          :class="[pageNumber === currentPage ? 'h-full' : '']"
        >
          <ul class="grid grid-rows-5 h-full" v-if="pageNumber === currentPage">
            <li
              v-for="(result, index) in page"
              :key="result.racer.name"
              class="px-2 rounded-sm text-lg relative flex"
            >
              <StandingsTableListItem
                :is-race="isRace"
                :index="index"
                :pageNumber="pageNumber"
                :result="result"
                :is-last-race="isLastRace"
              />
              <StandingsTableListItem
                v-if="pageNumber === 0 && index === 0"
                :is-race="isRace"
                :index="index"
                :pageNumber="pageNumber"
                :result="result"
                :is-last-race="isLastRace"
                floating
              />
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="mode === 'race' && fastestLap"
        class="flex items-center fastest-lap py-3 px-4 -m-2 mt-2 sm:mt-0 rounded-md text-xs sm:text-xl"
      >
        <div class="flex-1 flex flex-col sm:flex-row">
          <span class="uppercase text-purple-600 mr-3">Fastest Lap</span>
          <div>
            <span class="text-gray-300">{{ splitRacerName(fastestLap.racer)[0] }}&nbsp;</span
            ><span class="font-bold uppercase"> {{ splitRacerName(fastestLap.racer)[1] }}</span>
          </div>
        </div>
        <div class="flex-1 uppercase">
          {{ fastestLap.racer.team }}
        </div>
        <div class="text-center">
          {{ fastestLap.time }}&nbsp;<span class="italic">(+1 point)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import PodiumCard from './PodiumCard.vue'
import FaderComponent from './FaderComponent.vue'
import { chunkRacers, splitRacerName } from '@/utils'
import { ref, watch } from 'vue'
import StandingsTableListItem from './StandingsTableListItem.vue'
import type { GeneralResult } from '@/types'
import trackData from '../data/tracks.json'

const { results, title, mode } = defineProps<{
  results: GeneralResult[]
  title: string
  isLastRace: boolean
  mode?: 'race' | 'championship'
}>()

const stagesStore = useStagesStore()
const { season, track, fastestLap } = storeToRefs(stagesStore)
const paginatedResults = chunkRacers(results, 5)

const currentPage = ref(0)
const isRace = mode === 'race'

watch(
  currentPage,
  () => {
    setTimeout(() => {
      currentPage.value < paginatedResults.length - 1
        ? currentPage.value++
        : (currentPage.value = 0)
    }, 10000)
  },
  { immediate: true }
)
</script>

<style scoped>
.standing-bg {
  background-image: url(../assets/gghq-tile.png);
  animation: 10s backgroundTile linear infinite;
  box-shadow: inset 0 0 0 1000px rgba(28, 30, 41, 0.9);
}
.fastest-lap {
  background: var(--vt-bg);
}

@keyframes backgroundTile {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 400px 400px;
  }
}
</style>
