<template>
  <div class="nav flex fixed left-0 top-0 w-full z-10 drop-shadow-lg" style="height: 60px">
    <div class="flex-1 flex items-center p-2">
      <a :href="withBase()" class="font-bold ml-1">
        <img src="../assets/gghq-tile.png" alt="GGHQ" class="h-12" />
      </a>
      <div class="relative">
        <button
          class="ml-3 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-1 rounded-xl uppercase"
          @click="toggleSeasonState"
        >
          {{ season }} ▼
        </button>
        <div v-if="seasonDropdownState" class="nav absolute p-3">
          <div v-for="season in seasons" :key="season">
            <a
              :class="[
                seasonDisabled(season)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-800 transition-colors',
                'bg-blue-900  px-3 py-1 rounded-xl whitespace-nowrap w-full my-1 flex justify-between items-center uppercase'
              ]"
              :href="
                withBase(
                  `${season}/${trackDisabled(track, season) ? getLastValidTrack(season) : track}/${mode === 'demo' ? '' : `${mode}/`}`
                )
              "
            >
              {{ season }}
            </a>
          </div>
        </div>
      </div>
      <div class="relative">
        <button
          class="ml-3 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-1 rounded-xl"
          @click="toggleTrackState"
        >
          {{ currentTrack.name
          }}<span :class="['fi-' + currentTrack.countryCode, 'fi rounded-sm mx-2']"></span> ▼
        </button>
        <div v-if="trackDropdownState" class="nav absolute p-3">
          <div v-for="track in tracks" :key="trackData[track as TrackName].name">
            <a
              :class="[
                trackDisabled(track as TrackName, season)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-800 transition-colors',
                'bg-blue-900 px-3 py-1 rounded-xl whitespace-nowrap w-full my-1 flex justify-between items-center'
              ]"
              :href="withBase(`${season}/${track}/${mode === 'demo' ? '' : `${mode}/`}`)"
            >
              {{ trackData[track as TrackName].name
              }}<span
                :class="['fi-' + trackData[track as TrackName].countryCode, 'fi rounded-sm ml-2']"
              ></span>
            </a>
          </div>
        </div>
      </div>

      <div class="relative">
        <button
          class="ml-3 bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-1 rounded-xl capitalize"
          @click="toggleModeState"
        >
          {{ mode }} ▼
        </button>
        <div v-if="modeDropdownState" class="nav absolute p-3">
          <div v-for="mode in modes" :key="mode">
            <a
              class="bg-blue-900 hover:bg-blue-800 transition-colors px-3 py-1 flex rounded-xl whitespace-nowrap w-full my-1 capitalize"
              :href="withBase(`${season}/${track}/${mode === 'demo' ? '' : `${mode}/`}`)"
            >
              {{ mode }}
            </a>
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <!-- Background changer for green screen needs -->
    <!-- <div class="flex items-center p-2 border-l-2 border-gray-600">
      <button
        class="rounded-full navy-toggle w-10 h-10 mr-3 border"
        @click="updateBgColor('blue')"
      ></button>
      <button
        class="rounded-full green-toggle w-10 h-10 border"
        @click="updateBgColor('green')"
      ></button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useStagesStore } from '@/stores/stages'
import trackData from '../data/tracks.json'
import resultsData from '../data/results'
import type { TrackName } from '@/types'
import { seasons, modes } from '@/types'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { trackDisabled, seasonDisabled, getLastValidTrack, withBase } from '@/utils'

const stagesStore = useStagesStore()
const { track, season, mode } = storeToRefs(stagesStore)

const seasonDropdownState = ref(false)
const trackDropdownState = ref(false)
const modeDropdownState = ref(false)

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

const tracks = computed(() => Object.keys(resultsData[season.value]))
const currentTrack = computed(() => trackData[track.value])
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
