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
      : { team: '', teamColor: '' })
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
