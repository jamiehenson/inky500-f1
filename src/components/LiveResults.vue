<template>
  <ResultsWrapper :dataAvailable="entries.length > 0">
    <FaderComponent />
    <div class="flex-[2_2_0%] p-3 sm:p-5 flex flex-col standing-bg w-full relative">
      <h1 class="hidden sm:block text-5xl uppercase font-bold text-gray-300 mb-6">LIVE RESULTS</h1>
      <div class="h-[900px] sm:h-[768px] relative">
        <div
          v-for="(result, index) in entries"
          :key="result.entry.name"
          class="absolute h-[48px] w-full transition-all"
          :style="`top: ${index * 48}px`"
        >
          <StandingsTableListItem
            :isRace="true"
            :index="index"
            :pageNumber="0"
            :result="result"
            :isLastRace="false"
          ></StandingsTableListItem>
        </div>
      </div>
    </div>
  </ResultsWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import * as Ably from 'ably'
import ResultsWrapper from './ResultsWrapper.vue'
import StandingsTableListItem from './StandingsTableListItem.vue'
import FaderComponent from './FaderComponent.vue'
import { sampleRace, sampleDrivers, nationalityLookup, carLookup } from '../liveUtils'
import type { RacerResult } from '@/types'

const drivers = ref(sampleDrivers)
const race = ref(sampleRace)
const connected = ref(false)

onMounted(async () => {
  // const ably = new Ably.Realtime('lTQPrA.-iRpAQ:aLBd5k5RozpsMLTn2mgk1MwPBE3yn6hP8H5Y5ZR65wk')
  // ably.connection.once('connected', () => {
  //   connected.value = true
  //   console.log('Connected to Ably!')
  // })
  // const channel = ably.channels.get('acc')
  // await channel.subscribe('drivers', (message) => {
  //   console.log('Message received: ' + message.data)
  // })
  // await channel.subscribe('race', (message) => {
  //   console.log('Message received: ' + message.data)
  // })
})

const entries = computed(() => {
  if (
    (connected.value && Object.keys(drivers.value).length === 0) ||
    Object.keys(race.value).length === 0
  ) {
    return []
  }

  const sortedRace = Object.entries(race.value).sort((a, b) => a[1].pos - b[1].pos)

  const results: RacerResult[] = sortedRace
    .map((r) => {
      const driver = drivers.value[r[0]]

      return {
        entry: {
          name: driver.driver,
          team: driver.team,
          car: carLookup(driver.model),
          countryCode: nationalityLookup(driver.nationality)
        },
        time: r[1].lap.toString()
      }
    })
    .slice(0, 16)

  return results
})
</script>
