<template>
  <div v-if="dataAvailable" class="h-full" :style="`transform: translateX(${translateOffset}px)`">
    <div
      class="h-full sm:aspect-video flex items-center object-contain sm:p-3 overflow-x-hidden origin-top-left ratio"
    >
      <div
        :class="[
          'outer-wrapper h-full w-full sm:white-outline sm:overflow-hidden flex items-center bg-red-400',
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
          :isLastRace="isLastRace"
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
          :isLastRace="isLastRace"
        />
      </div>
    </div>
  </div>
  <div v-else>No data</div>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import resultsData from '../data/results'
import standingsData from '../data/standings'
import type { NumberObject, RacerName, TrackName, RacerResults, StandingsResults } from '@/types'
import { useStagesStore } from '@/stores/stages'
import { storeToRefs } from 'pinia'
import SectionIntro from './SectionIntro.vue'
import RacePodium from './RacePodium.vue'
import StandingsTable from './StandingsTable.vue'
import {
  calculateScaleRatio,
  calculateTranslateOffset,
  combinedRacer,
  debounce,
  idealHeight,
  titleSnippet
} from '@/utils'
import { useSeoMeta } from '@unhead/vue'

const dataAvailable = computed(() => (resultsData[season.value] as RacerResults)[track.value])

const stagesStore = useStagesStore()
const { stage, season, track, fastestLap, mode } = storeToRefs(stagesStore)
const { advanceStage } = stagesStore

const scaleRatio = ref(calculateScaleRatio())
const translateOffset = ref(calculateTranslateOffset(scaleRatio.value))

const updateScaleRatio = debounce(() => {
  scaleRatio.value = calculateScaleRatio()
  translateOffset.value = calculateTranslateOffset(scaleRatio.value)
}, 200)

const idealHeightAsPx = `${idealHeight}px`

const raceResults = computed(() => {
  const results = (resultsData[season.value] as RacerResults)[track.value]?.results

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

      let position = index + 1

      if (!isLastRace) {
        position = index > 0 ? index + 1 - tieCount : 1
      }

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

const isLastRace = Object.keys(standingsData[season.value]).slice(-1)[0] === track.value

const timeouts: number[] = []

const title = `Inky 500${titleSnippet(season.value, track.value, mode.value)}`
const description =
  raceResults.value.length >= 3
    ? `
      🥇 ${raceResults.value[0].racer.name} (${raceResults.value[0].time}),
      🥈 ${raceResults.value[1].racer.name} (+${raceResults.value[1].time}),
      🥉 ${raceResults.value[2].racer.name} (+${raceResults.value[2].time})
    `
    : 'Standings for the Inky 500 League'

useSeoMeta({
  title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogTitle: title,
  twitterTitle: title
})

onBeforeMount(() => {
  const { racerId, time } = (resultsData[season.value] as RacerResults)[track.value].fastestLap
  fastestLap.value = { racer: combinedRacer(racerId as RacerName, season.value), time }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateScaleRatio)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateScaleRatio)
  }
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
          return 5000
        case 'raceResultsClassification':
        case 'standings':
          return 10000 * Math.ceil(raceResults.value.length / 5)
      }
    }

    const delay = determineDelay()

    if (mode.value === 'all') {
      timeouts.push(setTimeout(() => advanceStage(), delay))
    }
  },
  { immediate: true }
)

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

@media screen and (min-width: 640px) {
  .ratio {
    height: v-bind('idealHeightAsPx');
    transform: scale(v-bind('scaleRatio'));
  }
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
