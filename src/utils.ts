import type { GeneralResult, ModeName, Racer, RacerName, Racers, SeasonName } from './types'
import racersData from './standings/racers.json'
import seasonRacersData from './standings/seasonRacers.json'

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

export const calculateTranslateOffset = (scaleRatio: number) => {
  return (window.innerWidth - idealWidth * scaleRatio) / 2
}