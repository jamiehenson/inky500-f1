<template>
  <div class="aspect-video h-full m-10 flex items-center object-contain">
    <div
      :class="[
        'outer-wrapper h-full w-full white-outline select-none pointer-events-none overflow-hidden flex items-center bg-red-400',
        animationClass
      ]"
    >
      <SectionIntro v-if="stage === 'raceResultsIn'" heading="Race" sub-heading="Result" />
      <RacePodium v-else-if="stage === 'raceResultsPodium'" :results="raceResults" />
      <StandingsTable
        v-else-if="stage === 'raceResultsClassification' || stage === 'raceResultsOut'"
        title="Classification"
        mode="race"
        :results="raceResults"
      />
      <SectionIntro
        v-else-if="stage === 'standingsIn'"
        heading="Drivers'"
        sub-heading="Championship"
      />
      <StandingsTable
        v-else-if="stage === 'standings' || stage === 'standingsOut'"
        title="Drivers' Championship"
        mode="championship"
        :results="standings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, onBeforeMount } from 'vue'
import racersData from '../standings/racers.json'
import resultsData from '../standings/results.json'
import standingsData from '../standings/standings.json'
import type { NumberObject, RacerName, TrackName } from '@/types'
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import SectionIntro from './SectionIntro.vue'
import RacePodium from './RacePodium.vue'
import StandingsTable from './StandingsTable.vue'

const stagesStore = useStagesStore()
const { stage, season, track, results, fastestLap } = storeToRefs(stagesStore)

const raceResults = computed(() =>
  Object.entries(resultsData[season.value][track.value].results).map((entry) => ({
    racer: racersData[season.value][entry[0] as RacerName],
    time: entry[1]
  }))
)

const sortAndFormatStandings = (data: NumberObject) => {
  let previousPoints = 0
  let tieCount = 0

  return Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map((entry, index) => {
      if (entry[1] === previousPoints) {
        tieCount++
      } else {
        previousPoints = entry[1]
        tieCount = 0
      }

      const position = index > 0 ? index + 1 - tieCount : 1

      return {
        racer: racersData[season.value][entry[0] as RacerName],
        points: entry[1],
        position
      }
    })
}

const standings = computed(() => {
  const raceKeys = Object.keys(standingsData[season.value])
  const firstRace = raceKeys.indexOf(track.value) === 0

  const currentStandings = sortAndFormatStandings(standingsData[season.value][track.value])
  const previousStandings = firstRace
    ? currentStandings
    : sortAndFormatStandings(
        standingsData[season.value][raceKeys[raceKeys.indexOf(track.value) - 1] as TrackName]
      )

  return currentStandings.map((standing) => {
    const previousPosition = previousStandings.find(
      (prev) => prev.racer.name === standing.racer.name
    )

    return {
      ...standing,
      delta: previousPosition ? previousPosition.position - standing.position : 0
    }
  })
})

onBeforeMount(() => {
  results.value = raceResults.value
  const { racerId, time } = resultsData[season.value][track.value].fastestLap
  fastestLap.value = { racer: racersData[season.value][racerId as RacerName], time }
})

onMounted(() => {
  if (stage.value === 'raceResultsIn') {
    setTimeout(() => stagesStore.advanceStage(), 3000)
  }
})

watch(stage, () => {
  const determineDelay = () => {
    switch (stage.value) {
      case 'raceResultsOut':
      case 'standingsOut':
        return 1000
      case 'standingsIn':
        return 3000
      case 'raceResultsPodium':
        return 10000
      case 'raceResultsClassification':
      case 'standings':
        return 10000 * Math.ceil(raceResults.value.length / 5)
    }
  }

  const delay = determineDelay()

  if (delay) {
    setTimeout(() => stagesStore.advanceStage(), delay)
  }
})

const animationClass = computed(() => {
  switch (stage.value) {
    case 'raceResultsIn':
    case 'standingsIn':
      return 'outer-wrapper-intro'
    case 'raceResultsOut':
    case 'standingsOut':
      return 'outer-wrapper-outro'
    case 'finished':
      return 'finished'
    default:
      return ''
  }
})
</script>

<style scoped>
.outer-wrapper {
  background: var(--vt-bg-light);
}

.outer-wrapper-intro {
  height: 160px;
  animation:
    1s expandOut ease forwards,
    1s expandUp 2s ease forwards;
}

.finished {
  transform: scaleY(0);
}

.outer-wrapper-outro {
  animation: 1s collapse ease forwards;
}
</style>

<style>
@keyframes expandOut {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

@keyframes expandUp {
  0% {
    height: 160px;
  }
  100% {
    height: 100%;
  }
}

@keyframes collapse {
  0% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0);
    opacity: 0;
  }
}

@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
