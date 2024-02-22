import {
  seasons,
  type GeneralResult,
  type ModeName,
  type Racer,
  type RacerName,
  type RacerResults,
  type Racers,
  type SeasonName,
  type TrackName
} from './types'
import racersData from './data/racers.json'
import seasonRacersData from './data/seasonRacers'
import resultsData from './data/results'

export const splitRacerName = (racer: Racer) => {
  const split = racer.name.split(' ')
  return [split.slice(0, -1).join(' '), split.slice(-1).join(' ')]
}

export const chunkRacers = (results: GeneralResult[], pageSize: number) =>
  Array.from({ length: Math.ceil(results.length / pageSize) }, (_, i) =>
    results.slice(i * pageSize, i * pageSize + pageSize)
  )

export const combinedRacer = (racer: RacerName, season: SeasonName) => {
  const racerPresent = Object.keys(seasonRacersData[season]).includes(racer)

  return {
    ...racersData[racer as RacerName],
    ...(racerPresent
      ? (seasonRacersData[season] as Racers)[racer as RacerName]
      : { team: '', teamColor: '', car: '' })
  }
}

export const mostRecentSeason = seasons.slice(-1)[0]

export const trackDisabled = (track: TrackName, season: SeasonName, specificSeason?: SeasonName) =>
  !(resultsData[specificSeason || season] as RacerResults)[track]

export const seasonDisabled = (season: SeasonName) =>
  Object.keys(resultsData[season] as RacerResults).length === 0

export const getLastValidTrack = (season: SeasonName) => {
  const reversedTracks = [...Object.keys(resultsData[season])].reverse()
  return reversedTracks.find((track) => !trackDisabled(track as TrackName, season))
}

export const titleize = (string: string) =>
  string
    .split(' ')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')

export const lookupStage = (mode: ModeName) => {
  switch (mode) {
    case 'podium':
      return 1
    case 'race':
      return 2
    case 'standings':
      return 5
    case 'demo':
      return 0
  }
}

export const idealHeight = 900
export const idealWidth = idealHeight * (16 / 9)

export const calculateScaleRatio = () => {
  const y = (window.innerHeight - 100) / idealHeight
  const x = window.innerWidth / idealWidth

  return Math.min(y, x)
}

export const calculateTranslateOffset = (scaleRatio: number) =>
  (window.innerWidth - idealWidth * scaleRatio) / 2
