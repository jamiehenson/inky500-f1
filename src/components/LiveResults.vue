<template>
  <ResultsWrapper :dataAvailable="!!entries">
    <FaderComponent />
    <div class="flex-[2_2_0%] p-3 sm:p-5 flex flex-col standing-bg w-full">
      <h1 class="hidden sm:block text-5xl uppercase font-bold text-gray-300 mb-6">LIVE RESULTS</h1>
      <StandingsTableListItem
        v-for="(result, index) in entries"
        :key="result.entry.name"
        :isRace="true"
        :index="index"
        :pageNumber="0"
        :result="result"
        :isLastRace="false"
      ></StandingsTableListItem>
    </div>
  </ResultsWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ResultsWrapper from './ResultsWrapper.vue'
import StandingsTableListItem from './StandingsTableListItem.vue'
import FaderComponent from './FaderComponent.vue'
import type { LiveDrivers, LiveRace, RacerResult } from '@/types'

const drivers: LiveDrivers = {
  '0': { model: 60, team: 'Leipert Motorsport', nationality: 'Poland', driver: 'Jan Kisiel' },
  '1': { model: 59, team: 'Equipe Verschuur', nationality: 'GreatBritain', driver: 'Daniel McKay' },
  '2': {
    model: 52,
    team: 'Phoenix Racing',
    nationality: 'Denmark',
    driver: 'Nicolaj M\u00f8ller-Madsen'
  },
  '3': {
    model: 57,
    team: 'Valvoline True Racing',
    nationality: 'Norway',
    driver: 'Mads Siljehaug'
  },
  '4': { model: 56, team: 'NM Racing Team', nationality: 'Spain', driver: 'Lluc Iba\u00f1ez' },
  '5': { model: 57, team: 'True Racing', nationality: 'Austria', driver: 'Reinhard Kofler' },
  '6': { model: 53, team: 'MDM Motorsport', nationality: 'USA', driver: 'Alec Udell' },
  '7': { model: 55, team: 'V8 Racing', nationality: 'Netherlands', driver: 'Olivier Hart' },
  '8': { model: 55, team: 'V8 Racing', nationality: 'Netherlands', driver: 'Duncan Huisman' },
  '9': { model: 60, team: 'Leipert Motorsport', nationality: 'Norway', driver: 'Marcus Paverud' },
  '10': { model: 51, team: 'Street Art Racing', nationality: 'France', driver: 'Julien Darras' },
  '11': { model: 61, team: 'Allied Racing', nationality: 'Austria', driver: 'Nicolas Sch\u00f6ll' },
  '12': { model: 50, team: 'CMR', nationality: 'France', driver: 'Guillaume Roman' },
  '13': {
    model: 61,
    team: 'Allied Racing',
    nationality: 'Austria',
    driver: 'Constantin Sch\u00f6ll'
  },
  '14': { model: 58, team: 'eSky WP Racing Team', nationality: 'Poland', driver: 'Lukasz Kreski' },
  '15': {
    model: 50,
    team: 'Redele Competition',
    nationality: 'France',
    driver: 'Alain Fert\u00e9'
  },
  '16': {
    model: 51,
    team: 'Street Art Racing',
    nationality: 'Luxembourg',
    driver: 'Clement Seyler'
  },
  '17': {
    model: 53,
    team: 'Borusan Otomotiv Motorsport',
    nationality: 'Turkey',
    driver: 'Ibrahim Okyay'
  },
  '18': { model: 52, team: 'IMSA Performance', nationality: 'France', driver: 'Franck Leherpeur' },
  '19': {
    model: 59,
    team: 'Las Moras Racing Team',
    nationality: 'Netherlands',
    driver: 'Gaby Uljee'
  },
  '20': {
    model: 50,
    team: "L'Ecurie des Prongles",
    nationality: 'GreatBritain',
    driver: 'BigTime Bosco'
  }
}

const race: LiveRace = {
  '12': { pos: 13, lap: 0 },
  '15': { pos: 16, lap: 0 },
  '20': { pos: 21, lap: 0 },
  '10': { pos: 11, lap: 0 },
  '16': { pos: 17, lap: 0 },
  '2': { pos: 3, lap: 0 },
  '18': { pos: 19, lap: 0 },
  '6': { pos: 7, lap: 0 },
  '17': { pos: 18, lap: 0 },
  '7': { pos: 8, lap: 0 },
  '8': { pos: 9, lap: 0 },
  '4': { pos: 5, lap: 0 },
  '3': { pos: 4, lap: 0 },
  '5': { pos: 6, lap: 0 },
  '14': { pos: 15, lap: 0 },
  '1': { pos: 2, lap: 0 },
  '19': { pos: 20, lap: 0 },
  '0': { pos: 1, lap: 0 },
  '9': { pos: 10, lap: 0 },
  '11': { pos: 12, lap: 0 },
  '13': { pos: 14, lap: 0 }
}

const nationalityLookup = (country: string) => {
  switch (country) {
    case 'Denmark':
      return 'dk'
    case 'Norway':
      return 'no'
    case 'Spain':
      return 'es'
    case 'Austria':
      return 'au'
    case 'USA':
      return 'us'
    case 'Netherlands':
      return 'nl'
    case 'France':
      return 'fr'
    case 'Poland':
      return 'pl'
    case 'Luxembourg':
      return 'lu'
    case 'Turkey':
      return 'tr'
    case 'GreatBritain':
      return 'gb'
    default:
      return 'xx'
  }
}

const entries = computed(() => {
  const sortedRace = Object.entries(race).sort((a, b) => a[1].pos - b[1].pos)

  const results: RacerResult[] = sortedRace
    .map((r) => {
      const driver = drivers[r[0]]

      return {
        entry: {
          name: driver.driver,
          team: driver.team,
          car: 'renault',
          countryCode: nationalityLookup(driver.nationality)
        },
        time: r[1].lap.toString()
      }
    })
    .slice(0, 20)

  return results
})
</script>
