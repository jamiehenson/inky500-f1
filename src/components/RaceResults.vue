<template>
  <div
    v-if="dataAvailable"
    class="aspect-video flex items-center object-contain p-3 transition-transform overflow-x-hidden origin-top-left"
    :style="`height: ${idealHeight}px; transform: scale(${scaleRatio}) translateX(${translateOffset}px)`"
  >
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
  <div v-else>No data</div>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeMount, onMounted, onUnmounted, ref, nextTick } from 'vue'
import resultsData from '../standings/results.json'
import standingsData from '../standings/standings.json'
import type { NumberObject, RacerName, TrackName, RacerResults, StandingsResults } from '@/types'
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import { debounce } from 'vue-debounce'
import SectionIntro from './SectionIntro.vue'
import RacePodium from './RacePodium.vue'
import StandingsTable from './StandingsTable.vue'
import {
  calculateScaleRatio,
  calculateTranslateOffset,
  combinedRacer,
  lookupStage,
  idealHeight
} from '@/utils'

const dataAvailable = computed(() => (resultsData[season.value] as RacerResults)[track.value])

const stagesStore = useStagesStore()
const { stage, season, track, fastestLap, mode } = storeToRefs(stagesStore)
const { advanceStage, setStage } = stagesStore

const scaleRatio = ref(calculateScaleRatio())
const translateOffset = ref(calculateTranslateOffset(scaleRatio.value))

const updateScaleRatio = debounce(() => {
  scaleRatio.value = calculateScaleRatio()
  translateOffset.value = calculateTranslateOffset(scaleRatio.value)
}, '200ms')

const raceResults = computed(() => {
  const results = (resultsData[season.value] as RacerResults)[track.value].results

  if (results) {
    return Object.entries(results).map((entry) => ({
      racer: combinedRacer(entry[0] as RacerName, season.value),
      time: entry[1]
    }))
  } else {
    return []
  }
})

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
        racer: combinedRacer(entry[0] as RacerName, season.value),
        points: entry[1],
        position
      }
    })
}

const standings = computed(() => {
  const raceKeys = Object.keys(standingsData[season.value])
  const firstRace = raceKeys.indexOf(track.value) === 0

  const currentStandings = sortAndFormatStandings(
    (standingsData[season.value] as StandingsResults)[track.value]
  )
  const previousStandings = firstRace
    ? currentStandings
    : sortAndFormatStandings(
        (standingsData[season.value] as StandingsResults)[
          raceKeys[raceKeys.indexOf(track.value) - 1] as TrackName
        ]
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

const timeouts: number[] = []
const clearTimeouts = () => {
  timeouts.forEach((timeout) => clearTimeout(timeout))
}

onBeforeMount(() => {
  const { racerId, time } = (resultsData[season.value] as RacerResults)[track.value].fastestLap
  fastestLap.value = { racer: combinedRacer(racerId as RacerName, season.value), time }
})

onMounted(() => {
  window.addEventListener('resize', updateScaleRatio)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScaleRatio)
})

watch(
  stage,
  () => {
    const determineDelay = () => {
      switch (stage.value) {
        case 'raceResultsOut':
        case 'standingsOut':
        case 'finished':
          return 1000
        case 'raceResultsIn':
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

    if (mode.value === 'demo') {
      timeouts.push(setTimeout(() => advanceStage(), delay))
    }
  },
  { immediate: true }
)

watch(mode, () => {
  setStage(lookupStage(mode.value))
  clearTimeouts()
})

watch([season, track], async () => {
  setStage(7)
  clearTimeouts()
  await nextTick()
  setStage(lookupStage(mode.value))
  clearTimeouts()
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
