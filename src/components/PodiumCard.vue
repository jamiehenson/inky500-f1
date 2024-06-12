<template>
  <div class="panel-bg p-5 sm:flex-1 sm:rounded-xl relative text-3xl">
    <div v-if="driver" class="white-outline sm:h-full flex flex-col justify-end">
      <div
        class="bg-black rounded-xl mb-3 sm:h-32 p-4 max-w-full opacity-50 text-xl sm:text-4xl drop-shadow-md shadow-black uppercase"
      >
        {{ driver.team }}
      </div>
      <div class="flex sm:flex-col flex-1">
        <div class="sm:flex-1 flex items-center justify-center mx-3 sm:mx-0 w-32 sm:w-auto">
          <img :src="imageUrl" class="rounded-xl sm:w-4/5 sm:m-3" />
        </div>
        <div class="flex-1 sm:flex-none flex items-center">
          <div>
            <p v-if="splitRacerName(driver)[0].length > 0" class="text-md sm:text-2xl italic px-2">
              {{ splitRacerName(driver)[0] }}
            </p>
            <p class="text-md sm:text-4xl italic mb-4 px-2 uppercase font-bold">
              <span>{{ splitRacerName(driver)[1] }}</span>
            </p>
          </div>
          <a v-if="driver.twitch" :href="`https://www.twitch.tv/${driver.twitch}`" target="_blank">
            <img src="../assets/twitch.png" class="w-8 h-8 sm:w-12 sm:h-12 ml-3 -mt-3" />
          </a>
          <a
            v-if="driver.youtube"
            :href="`https://www.youtube.com/@${driver.youtube}`"
            target="_blank"
          >
            <img src="../assets/youtube.svg" class="w-8 h-8 sm:w-12 sm:h-12 ml-3 -mt-3" />
          </a>
          <div class="flex-1 flex justify-end">
            <img :src="getCarBadge(driver.car)" class="h-10 sm:h-12 w-10 sm:w-12 mr-3 -mt-3" />
          </div>
        </div>
      </div>
      <p class="mt-3 sm:mt-0 text-md sm:text-6xl text-center wide">
        {{ positionWithSuffix(position) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GeneralResult, Racer } from '@/types'
import { splitRacerName, getCarBadge } from '@/utils'

const { position, results } = defineProps<{ position: number; results: GeneralResult[] }>()

const driver = results[position - 1]?.entry as Racer
const teamColor = driver.teamColor ?? 'black'
const imageUrl = new URL(`../assets/discord/${driver.img ?? 'unknown'}.webp`, import.meta.url).href

const positionWithSuffix = (position: number) => {
  switch (position) {
    case 1:
      return position + 'st'
    case 2:
      return position + 'nd'
    case 3:
      return position + 'rd'
    default:
      return position + 'th'
  }
}
</script>

<style scoped>
.panel-bg {
  background: linear-gradient(135deg, v-bind(teamColor) 33%, var(--vt-bg) 33%);
}
</style>
