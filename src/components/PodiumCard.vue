<template>
  <div class="panel-bg p-5 flex-1 rounded-xl relative text-3xl">
    <div v-if="racer" class="white-outline h-full flex flex-col justify-end">
      <div class="p-4 h-32 w-32 opacity-50 text-4xl drop-shadow-md shadow-black uppercase">
        {{ racer.team }}
      </div>
      <div class="flex-1 flex items-center justify-center">
        <img :src="imageUrl" class="rounded-xl w-4/5 m-3" />
      </div>
      <p v-if="splitRacerName(racer)[0].length > 0" class="text-2xl italic px-2">
        {{ splitRacerName(racer)[0] }}
      </p>
      <p class="text-4xl italic mb-4 px-2 uppercase font-bold">{{ splitRacerName(racer)[1] }}</p>
      <p class="text-6xl text-center wide">{{ positionWithSuffix(position) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import { splitRacerName } from '@/utils'

const { position } = defineProps<{ position: number }>()

const { results } = storeToRefs(useStagesStore())

const racer = results.value[position - 1]?.racer
const teamColor = racer.teamColor
const imageUrl = new URL(`../assets/discord/${racer.img ?? 'unknown'}.webp`, import.meta.url).href

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
