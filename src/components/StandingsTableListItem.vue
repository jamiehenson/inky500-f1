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
    <div class="flex-1 overflow-hidden flex flex-col sm:flex-row sm:items-center">
      <div class="flex-1">
        <div class="slide-in">
          <div :class="[entryIsRacer(result.entry) ? 'inline-block' : '']">
            <span
              :class="[
                'fi-' + (result.entry.countryCode ?? 'xx'),
                'fi w-4 sm:h-6 h-4 sm:w-6 mr-3 rounded-sm sm:-translate-y-1'
              ]"
            ></span
            ><span
              v-if="entryIsRacer(result.entry)"
              :class="[
                isRace ? 'text-sm sm:text-xl' : 'text-md sm:text-2xl',
                'italic  text-gray-300'
              ]"
              >{{ splitRacerName(result.entry)[0] }}&nbsp;</span
            ><span
              :class="[
                isRace ? 'text-md sm:text-2xl' : 'text-md sm:text-3xl',
                'italic font-bold uppercase'
              ]"
            >
              {{
                entryIsRacer(result.entry) ? splitRacerName(result.entry)[1] : result.entry.name
              }}</span
            >
          </div>
          <span
            v-if="!entryIsRacer(result.entry)"
            :class="['text-sm italic uppercase text-neutral-500']"
          >
            <span
              v-for="driver in teamDrivers"
              :class="[driver[1] ? 'font-bold text-white' : '', 'mr-2']"
              :key="`${driver[0]}`"
            >
              {{ driver[0] }}
            </span>
          </span>
          <a
            v-if="entryIsRacer(result.entry) && result.entry.twitch"
            :href="`https://www.twitch.tv/${result.entry.twitch}`"
            target="_blank"
            class="inline-block ml-3"
          >
            <img src="../assets/twitch.png" class="w-4 h-4 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>
      <div class="flex-1">
        <div class="slide-in flex items-center text-red">
          <img
            :src="getCarBadge(entryIsRacer(result.entry) ? result.entry.car : result.entry.img)"
            class="w-4 sm:h-6 h-4 sm:w-6 mr-3"
          /><span
            v-if="entryIsRacer(result.entry)"
            :class="[
              !isRace ? 'text-sm sm:text-2xl' : 'text-xs sm:text-xl',
              'text-gray-300 uppercase'
            ]"
            >{{ result.entry.team }}</span
          >
        </div>
      </div>
    </div>
    <div v-if="resultIsRace(result)" class="px-2 w-26 sm:w-40 text-center italic overflow-hidden">
      <div class="slide-in">
        <span class="text-gray-300 text-sm sm:text-2xl flex items-center"
          >{{ timePrefix }}{{ result.time
          }}<span
            v-if="penalty"
            className="rounded-sm bg-red-600 text-white text-sm font-bold py-1 px-2 ml-2 not-italic"
            >P</span
          ></span
        >
      </div>
    </div>
    <div
      v-if="resultIsRace(result) && isNotLive()"
      class="px-2 w-10 sm:w-24 text-right font-bold overflow-hidden"
    >
      <div class="slide-in">
        <span class="text-sm sm:text-2xl">{{ index < 10 ? '+' : '' }}{{ points }}</span>
      </div>
    </div>
    <div v-if="resultIsStandings(result) && isNotLive()" class="overflow-hidden">
      <div class="slide-in">
        <span class="text-gray-300 text-md sm:text-4xl">{{ result.points }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStagesStore } from '@/stores/stages'
import { splitRacerName, getCarBadge, entryIsRacer, pointsScheme } from '@/utils'
import type {
  GeneralResult,
  Penalties,
  RacerName,
  RacerResult,
  RacerResults,
  SeasonRacer,
  StandingsResult,
  Track,
  TrackName
} from '@/types'
import trackData from '../data/tracks.json'
import drivers from '../data/drivers.json'
import seasonRacers from '../data/seasonRacers'
import resultsData from '../data/results'
import penaltiesData from '../data/penalties'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const { isRace, index, pageNumber, result, floating } = defineProps<{
  isRace: boolean
  index: number
  pageNumber: number
  result: GeneralResult
  isLastRace: boolean
  floating?: boolean
}>()
const { fastestLap, track, season } = useStagesStore()
const animationDelay = index / 20 + 's'
const route = useRoute()
let points = pointsScheme[season][index + pageNumber * 5]

if (fastestLap?.entry.name === result.entry.name) {
  points++
}

const isNotLive = () => route.path !== '/live'

const resultIsRace = (result: GeneralResult): result is RacerResult => {
  return isRace && (result as RacerResult).time !== undefined
}

const resultIsStandings = (result: GeneralResult): result is StandingsResult => {
  return !isRace && (result as StandingsResult).position !== undefined
}

if ((trackData[track] as Track).noPoints || (resultIsRace(result) && result.time === 'DNF')) {
  points = 0
}

const teamDrivers = computed(() =>
  Object.entries(seasonRacers[season])
    .filter(
      (driver) =>
        ((driver[1] as SeasonRacer).otherCars?.[track] ?? driver[1].car) === result.entry.img
    )
    .map((driver) => {
      const splitName = drivers[driver[0] as RacerName].name.split(' ')

      return [
        `${splitName[0][0]}. ${splitName[splitName.length - 1]} `,
        Object.keys((resultsData[season] as RacerResults)[track as TrackName].results).includes(
          driver[0]
        )
      ]
    })
)

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

const timePrefix =
  resultIsRace(result) &&
  ((index === 0 && pageNumber === 0) || result.time === '-' || result.time === 'DNF')
    ? ''
    : '+'

const penalty =
  resultIsRace(result) && (penaltiesData[season] as Penalties)?.[track]?.[result.entry.id ?? '']
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
