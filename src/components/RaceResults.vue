<template>
  <ResultsWrapper :dataAvailable="dataAvailable" :animationClass="animationClass">
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
    <SectionIntro
      v-else-if="stage === 'constructorsIn'"
      heading="Constructors'"
      sub-heading="Championship"
    />
    <StandingsTable
      v-else-if="stage === 'constructors' || stage === 'constructorsOut'"
      title="Constructors' Championship"
      mode="championship"
      :results="constructors"
      :isLastRace="isLastRace"
    />
  </ResultsWrapper>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeMount } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import ResultsWrapper from './ResultsWrapper.vue'
import resultsData from '../data/results'
import standingsData from '../data/standings'
import constructorsData from '../data/constructors/index'
import constructorData from '../data/constructors.json'
import type {
  NumberObject,
  RacerName,
  TrackName,
  RacerResults,
  StandingsResults,
  ConstructorName,
  ConstructorResults,
  ConstructorsResults
} from '@/types'
import { useStagesStore } from '@/stores/stages'
import SectionIntro from './SectionIntro.vue'
import RacePodium from './RacePodium.vue'
import StandingsTable from './StandingsTable.vue'
import { combinedRacer, titleSnippet } from '@/utils'
import seasonRacers from '@/data/seasonRacers'

const dataAvailable = computed(() => !!(resultsData[season.value] as RacerResults)[track.value])

const stagesStore = useStagesStore()
const { stage, season, track, fastestLap, mode } = storeToRefs(stagesStore)
const { advanceStage } = stagesStore

const raceResults = computed(() => {
  const results = (resultsData[season.value] as RacerResults)[track.value]?.results

  if (results) {
    return Object.entries(results).map((entry) => ({
      entry: combinedRacer(entry[0] as RacerName, season.value, track.value),
      time: entry[1]
    }))
  } else {
    return []
  }
})

const sortAndFormatStandings = (data: NumberObject, isConstructor?: boolean) => {
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
        entry: isConstructor
          ? constructorData[entry[0] as ConstructorName]
          : combinedRacer(entry[0] as RacerName, season.value, track.value),
        points: entry[1],
        position
      }
    })
}

const sortAndFormatConstructors = (data: NumberObject) => sortAndFormatStandings(data, true)

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
      (prev) => prev.entry.name === standing.entry.name
    )

    return {
      ...standing,
      delta: previousPosition ? previousPosition.position - standing.position : 0
    }
  })
})

const constructors = computed(() => {
  const raceKeys = Object.keys(constructorsData[season.value])
  const firstRace = raceKeys.indexOf(track.value) === 0

  const currentData = (constructorsData[season.value] as ConstructorsResults)[track.value]
  if (!currentData) {
    return []
  }

  const mapData = (data: ConstructorResults) =>
    Object.entries(data).reduce((obj: NumberObject, item) => {
      return (obj[item[0]] = item[1].normalisedPoints), obj
    }, {})

  const currentStandings = sortAndFormatConstructors(mapData(currentData))

  const previousData = (constructorsData[season.value] as ConstructorsResults)[
    raceKeys[raceKeys.indexOf(track.value) - 1] as TrackName
  ]

  const previousStandings = firstRace
    ? currentStandings
    : sortAndFormatConstructors(mapData(previousData))

  return currentStandings.map((standing) => {
    const previousPosition = previousStandings.find(
      (prev) => prev.entry.name === standing.entry.name
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
      🥇 ${raceResults.value[0].entry.name} (${raceResults.value[0].time}),
      🥈 ${raceResults.value[1].entry.name} (+${raceResults.value[1].time}),
      🥉 ${raceResults.value[2].entry.name} (+${raceResults.value[2].time})
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
  fastestLap.value = { entry: combinedRacer(racerId as RacerName, season.value, track.value), time }
})

watch(
  stage,
  () => {
    const determineDelay = () => {
      switch (stage.value) {
        case 'raceResultsOut':
        case 'standingsOut':
        case 'constructorsOut':
        case 'finished':
          return 1000
        case 'raceResultsIn':
        case 'standingsIn':
        case 'constructorsIn':
          return 3000
        case 'raceResultsPodium':
          return 5000
        case 'raceResultsClassification':
        case 'standings':
          return 5000 * Math.ceil(Object.keys(seasonRacers[season.value]).length / 5)
        case 'constructors':
          return (
            5000 *
            Math.ceil(
              Array.from(new Set(Object.values(seasonRacers[season.value]).map(({ car }) => car)))
                .length / 5
            )
          )
      }
    }

    const delay = determineDelay()

    if (typeof window !== 'undefined' && mode.value === 'all') {
      timeouts.push(window.setTimeout(() => advanceStage(), delay))
    }
  },
  { immediate: true }
)

const animationClass = computed(() => {
  switch (stage.value) {
    case 'raceResultsIn':
    case 'standingsIn':
    case 'constructorsIn':
      return 'outer-wrapper-intro'
    case 'raceResultsOut':
    case 'standingsOut':
    case 'constructorsOut':
      return 'outer-wrapper-outro'
    case 'finished':
      return 'finished'
    default:
      return ''
  }
})
</script>
