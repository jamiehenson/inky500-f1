<template>
  <div
    :class="[
      floating
        ? `floating first ${isLastRace && !isRace ? 'winner' : ''} rounded-md px-2`
        : 'py-2 sm:p-0',
      'flex w-full items-center flex-1'
    ]"
  >
    <div class="w-10 sm:w-12 overflow-hidden">
      <div class="slide-in">
        <span class="italic text-gray-300">{{
          resultIsRace(result) ? index + pageNumber * 5 + 1 : result.position
        }}</span>
      </div>
    </div>
    <div v-if="resultIsStandings(result)" class="w-10 mr-5 sm:mr-8 overflow-hidden">
      <div class="slide-in flex items-center justify-between">
        <div :class="[deltaClass(), 'text-2xl sm:text-4xl']">
          {{ result.delta !== 0 ? '›' : '-' }}
        </div>
        <span>{{ Math.abs(result.delta) }}</span>
      </div>
    </div>
    <div class="flex-1 overflow-hidden flex flex-col sm:flex-row items-center">
      <div class="flex-1">
        <div class="slide-in">
          <span
            :class="[
              'fi-' + (result.racer.countryCode ?? 'gb'),
              'fi w-4 sm:h-6 h-4 sm:w-6 mr-3 rounded-sm sm:-translate-y-1'
            ]"
          ></span
          ><span
            :class="[
              isRace ? 'text-sm sm:text-xl' : 'text-md sm:text-2xl',
              'italic  text-gray-300'
            ]"
            >{{ splitRacerName(result.racer)[0] }}&nbsp;</span
          ><span
            :class="[
              isRace ? 'text-md sm:text-2xl' : 'text-md sm:text-3xl',
              'italic font-bold uppercase'
            ]"
          >
            {{ splitRacerName(result.racer)[1] }}</span
          >
          <a
            v-if="result.racer.twitch"
            :href="`https://www.twitch.tv/${result.racer.twitch}`"
            target="_blank"
            class="inline-block ml-3"
          >
            <img src="../assets/twitch.png" class="w-4 h-4 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>
      <div class="flex-1">
        <div class="slide-in flex items-center text-red">
          <img :src="getCarBadge(result.racer)" class="w-4 sm:h-6 h-4 sm:w-6 mr-3" /><span
            :class="[
              !isRace ? 'text-sm sm:text-2xl' : 'text-xs sm:text-xl',
              'text-gray-300 uppercase'
            ]"
            >{{ result.racer.team }}</span
          >
        </div>
      </div>
    </div>
    <div v-if="resultIsRace(result)" class="px-2 w-26 sm:w-40 text-center italic overflow-hidden">
      <div class="slide-in">
        <span class="text-gray-300 text-sm sm:text-2xl">{{ timePrefix }}{{ result.time }}</span>
      </div>
    </div>
    <div v-if="resultIsRace(result)" class="px-2 w-10 sm:w-24 text-right font-bold overflow-hidden">
      <div class="slide-in">
        <span class="text-sm sm:text-2xl">{{ index < 10 ? '+' : '' }}{{ points }}</span>
      </div>
    </div>
    <div v-if="resultIsStandings(result)" class="overflow-hidden">
      <div class="slide-in">
        <span class="text-gray-300 text-md sm:text-4xl">{{ result.points }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStagesStore } from '@/stores/stages'
import { splitRacerName, getCarBadge } from '@/utils'
import type { GeneralResult, RacerResult, StandingsResult } from '@/types'
const { isRace, index, pageNumber, result, floating } = defineProps<{
  isRace: boolean
  index: number
  pageNumber: number
  result: GeneralResult
  isLastRace: boolean
  floating?: boolean
}>()
const { fastestLap } = useStagesStore()
const animationDelay = index / 20 + 's'
let points = Math.max(10 - (index + pageNumber * 5), 0)

if (fastestLap?.racer.name === result.racer.name) {
  points++
}

const deltaClass = () => {
  if (resultIsStandings(result)) {
    return result.delta > 0
      ? '-rotate-90 text-green-700'
      : result.delta < 0
        ? 'rotate-90 text-red-500'
        : ''
  } else {
    return ''
  }
}

const resultIsRace = (result: GeneralResult): result is RacerResult => {
  return isRace && (result as RacerResult).time !== undefined
}

const resultIsStandings = (result: GeneralResult): result is StandingsResult => {
  return !isRace && (result as StandingsResult).position !== undefined
}

const timePrefix =
  resultIsRace(result) &&
  ((index === 0 && pageNumber === 0) || result.time === '-' || result.time === 'DNF')
    ? ''
    : '+'
</script>

<style>
.floating {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating span {
  color: var(--vt-bg);
}

.first {
  background: white;
  color: var(--vt-bg);
  animation: 1s slideWhite 1s ease forwards;
  clip-path: inset(0 100% 0 0);
}

.first.winner {
  background: goldenrod;
}

.slide-in {
  transform: translateX(-100%);
  animation: slideIn 1s ease v-bind(animationDelay) forwards;
}

@keyframes slideWhite {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0%);
  }
}
</style>
