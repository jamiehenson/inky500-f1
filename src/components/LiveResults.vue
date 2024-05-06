<template>
  <ResultsWrapper :dataAvailable="entries.length > 0">
    <FaderComponent />
    <div class="flex-[2_2_0%] p-3 sm:p-5 flex flex-col standing-bg w-full relative">
      <div class="flex items-end mb-6">
        <h1 class="hidden sm:block text-5xl uppercase font-bold text-gray-300 mr-3">
          LIVE RESULTS
        </h1>
        <h2 class="text-xl uppercase">{{ sessionName }}</h2>
      </div>
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ResultsWrapper from './ResultsWrapper.vue'
import StandingsTableListItem from './StandingsTableListItem.vue'
import FaderComponent from './FaderComponent.vue'
import { nationalityLookup, carLookup } from '../liveUtils'
import type { LiveDrivers, LiveRace, RacerResult } from '@/types'
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import { msToTime } from '@/utils'

const driverData = ref<LiveDrivers>({})
const liveData = ref<LiveRace>({})
const totalTime = ref(0)
const sessionName = ref('')
const store = useStagesStore()
const { ably } = store
const { ablyConnected } = storeToRefs(store)

onMounted(async () => {
  const channel = ably.channels.get('acc')
  await channel.subscribe('race', (message) => {
    const { live, drivers, time, name } = JSON.parse(message.data)
    liveData.value = live
    driverData.value = drivers
    totalTime.value = time
    sessionName.value = name
  })
})

onUnmounted(async () => {
  ably.connection.close()
  await ably.connection.once('closed', function () {
    console.log('Closed the connection to Ably.')
  })
})

const entries = computed(() => {
  if (
    !ablyConnected.value ||
    Object.keys(driverData.value).length === 0 ||
    Object.keys(liveData.value).length === 0
  ) {
    return []
  }

  const sortedRace = Object.entries(liveData.value).sort((a, b) => a[1].pos - b[1].pos)

  const results: RacerResult[] = sortedRace
    .map((racer, index) => {
      const driver = driverData.value[racer[0]]
      const split =
        index > 0
          ? ((sortedRace[index - 1][1].lap - racer[1].lap) / 1000).toFixed(3)
          : msToTime(totalTime.value)

      return {
        entry: {
          name: driver.driver,
          team: driver.team,
          car: carLookup(driver.model),
          countryCode: nationalityLookup(driver.nationality)
        },
        time: split
      }
    })
    .slice(0, 16)

  return results
})
</script>
