<template>
  <ResultsWrapper :dataAvailable="entries.length > 0">
    <FaderComponent />
    <div class="p-3 sm:p-5 flex flex-col standing-bg w-full h-full relative">
      <div class="flex items-end sm:mb-6">
        <h1 class="hidden sm:block text-5xl uppercase font-bold text-gray-300 mr-3">
          LIVE RESULTS
        </h1>
        <h2 class="text-xl uppercase">{{ sessionName }}</h2>
      </div>
      <div class="h-[900px] flex flex-col relative">
        <div
          v-for="(result, index) in entries"
          :key="result.entry.name"
          class="absolute w-full transition-all flex-1 duration-500"
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
import type { LiveDrivers, LiveRace, LiveRaceEntries, RacerResult } from '@/types'
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import { msToTime } from '@/utils'

const driverData = ref<LiveDrivers>({})
const liveData = ref<LiveRace>({})
const totalTime = ref(0)
const trackLength = ref(0)
const sessionName = ref('')
const store = useStagesStore()
const { ably } = store
const { ablyConnected } = storeToRefs(store)

onMounted(async () => {
  const channel = ably.channels.get('acc')
  await channel.subscribe('race', (message) => {
    const { live, drivers, time, name, track } = JSON.parse(message.data)
    liveData.value = live
    driverData.value = drivers
    totalTime.value = time
    sessionName.value = name
    trackLength.value = track
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

  let lapObj = Object.entries(liveData.value).reduce(
    (obj: Record<number, LiveRaceEntries[]>, item) => {
      return (obj[item[1].lap] = [...(obj[item[1].lap] ?? []), item]), obj
    },
    {}
  )

  const laps = Object.values(lapObj)
    .reverse()
    .flatMap((set) => set.sort((a, b) => b[1].spline - a[1].spline))

  const results: RacerResult[] = laps
    .map((racer, index) => {
      const driver = driverData.value[racer[0]]
      let split = msToTime(totalTime.value)

      if (index > 0) {
        const ahead = laps[index - 1][1]
        const current = racer[1]

        const distanceInM = (ahead.spline - current.spline) * trackLength.value
        const avgSpeedInMS = (((ahead.kmh + current.kmh) / 2) * 1000) / 3600
        const diff = distanceInM / avgSpeedInMS
        const lapDiff = ahead.lap - current.lap

        if (lapDiff > 0) {
          split = `+${lapDiff} lap${lapDiff === 1 ? '' : 's'}`
        } else {
          split = `+${diff.toFixed(3)}`
        }
      }

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
    .slice(0, 20)

  return results
})
</script>
