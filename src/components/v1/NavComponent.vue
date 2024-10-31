<template>
  <div class="nav flex fixed left-0 top-0 w-full z-10 drop-shadow-lg h-12">
    <div class="flex-1 flex items-center p-2">
      <div class="font-bold ml-1 flex items-center flex-1 sm:flex-none">
        <a :href="withBase()" class="flex items-center">
          <img src="/src/assets/gghq-tile.png" alt="GGHQ" class="h-12 mr-2" />
          <span class="font-bold mr-3 sm:mr-2">Inky 500</span>
        </a>
        <span class="sm:hidden text-xs"
          >{{ season.toUpperCase() }} / {{ trackData[track as TrackName].name }}</span
        >
      </div>
      <div>
        <div class="flex-1 sm:flex-none"></div>
        <div
          :class="[
            !menuDropdownState ? 'hidden' : '',
            'nav fixed h-screen sm:h-auto sm:static inset-0 top-12 overflow-y-scroll sm:overflow-y-visible flex-1 sm:flex pt-2 sm:pt-0'
          ]"
        >
          <div class="nav relative px-3 sm:pr-0">
            <button
              class="w-full sm:mt-0 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-3 sm:py-1 rounded-sm uppercase text-sm sm:text-md"
              @click="toggleSeasonState"
            >
              {{ season }} ▼
            </button>
            <div v-if="seasonDropdownState" class="nav sm:absolute p-2 rounded-sm bg-blue-700">
              <div v-for="season in seasons" :key="season">
                <a
                  :class="[
                    seasonDisabled(season) || constructorsDisabled(season, mode)
                      ? 'opacity-50 cursor-not-allowed pointer-events-none select-none'
                      : 'hover:bg-blue-800 transition-colors',
                    'bg-blue-900 px-3 py-1 rounded-sm whitespace-nowrap w-full my-1 flex justify-between items-center uppercase'
                  ]"
                  :href="
                    withBase(
                      `${season}/${trackDisabled(track, season) ? getLastValidTrack(season) : track}/${mode === 'all' ? '' : `${mode}/`}`
                    )
                  "
                >
                  {{ season }}
                </a>
              </div>
            </div>
          </div>
          <div class="nav relative px-3 sm:pr-0">
            <button
              class="w-full mt-3 sm:mt-0 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-3 sm:py-1 rounded-sm text-sm sm:text-md"
              @click="toggleTrackState"
            >
              {{ currentTrack.name
              }}<span :class="['fi-' + currentTrack.countryCode, 'fi rounded-sm mx-2']"></span> ▼
            </button>
            <div v-if="trackDropdownState" class="nav sm:absolute p-2 rounded-sm bg-blue-700">
              <div v-for="track in tracks" :key="trackData[track as TrackName].name">
                <a
                  :class="[
                    trackDisabled(track as TrackName, season)
                      ? 'opacity-50 cursor-not-allowed pointer-events-none select-none'
                      : 'hover:bg-blue-800 transition-colors',
                    'bg-blue-900 px-3 py-1 rounded-sm whitespace-nowrap w-full my-1 flex justify-between items-center'
                  ]"
                  :href="withBase(`${season}/${track}/${mode === 'all' ? '' : `${mode}/`}`)"
                >
                  {{ trackData[track as TrackName].name
                  }}<span
                    :class="[
                      'fi-' + trackData[track as TrackName].countryCode,
                      'fi rounded-sm ml-2'
                    ]"
                  ></span>
                </a>
              </div>
            </div>
          </div>
          <div class="nav relative px-3 sm:pr-0">
            <button
              class="w-full mt-3 sm:mt-0 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-3 sm:py-1 rounded-sm capitalize text-sm sm:text-md"
              @click="toggleModeState"
            >
              {{ mode }}&nbsp;&nbsp;{{ modeEmoji(mode) }}&nbsp; ▼
            </button>
            <div v-if="modeDropdownState" class="nav sm:absolute p-2 rounded-sm bg-blue-700">
              <div v-for="mode in modes" :key="mode">
                <a
                  :class="[
                    constructorsDisabled(season, mode)
                      ? 'opacity-50 cursor-not-allowed pointer-events-none select-none'
                      : 'hover:bg-blue-800 transition-colors',
                    'bg-blue-900 px-3 py-1 flex rounded-sm whitespace-nowrap w-full my-1 capitalize'
                  ]"
                  :href="withBase(`${season}/${track}/${mode === 'all' ? '' : `${mode}/`}`)"
                >
                  <div class="w-full flex justify-between">
                    <span>{{ mode }}</span>
                    <span class="ml-3">{{ modeEmoji(mode) }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="nav relative px-3 sm:pr-0">
            <a
              class="block w-full mt-3 sm:mt-0 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-3 sm:py-1 rounded-sm capitalize text-sm sm:text-md"
              :href="withBase(`${season}/progression`)"
            >
              📈
            </a>
          </div>
        </div>
        <button
          class="sm:hidden mr-2 bg-blue-900 hover:bg-blue-800 p-2 rounded-md cursor-pointer"
          @click="toggleMenuState"
        >
          <img src="../../assets/v1/burger.svg" class="h-6 invert" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStagesStore } from '../../stores/stages'
import trackData from '../../data/tracks.json'
import resultsData from '../../data/results'
import type { ModeName, SeasonName, TrackName } from '../../types'
import { seasons, modes } from '../../types'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { trackDisabled, seasonDisabled, getLastValidTrack, withBase } from '../../utils'

const stagesStore = useStagesStore()
const { track, season, mode } = storeToRefs(stagesStore)

const seasonDropdownState = ref(false)
const trackDropdownState = ref(false)
const modeDropdownState = ref(false)
const menuDropdownState = ref(false)

const toggleSeasonState = () => {
  seasonDropdownState.value = !seasonDropdownState.value
  trackDropdownState.value = false
  modeDropdownState.value = false
}

const toggleTrackState = () => {
  seasonDropdownState.value = false
  trackDropdownState.value = !trackDropdownState.value
  modeDropdownState.value = false
}

const toggleModeState = () => {
  seasonDropdownState.value = false
  trackDropdownState.value = false
  modeDropdownState.value = !modeDropdownState.value
}

const toggleMenuState = () => {
  menuDropdownState.value = !menuDropdownState.value
}

const tracks = computed(() => Object.keys(resultsData[season.value]))
const currentTrack = computed(() => trackData[track.value])
const constructorsDisabled = (season: SeasonName, mode: ModeName) =>
  mode === 'constructors' && season !== 's4'

const modeEmoji = (mode: ModeName) => {
  switch (mode) {
    case 'all':
      return '🍿'
    case 'podium':
      return '🍾'
    case 'race':
      return '🏎️'
    case 'drivers':
    case 'constructors':
      return '🏆'
    default:
      ''
  }
}
</script>

<style>
.nav {
  background: var(--vt-bg-light);
}

.navy-toggle {
  background: var(--vt-bg);
}

.green-toggle {
  background: var(--vt-green-screen);
}
</style>
