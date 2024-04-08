import {
  seasons,
  type GeneralResult,
  type Racer,
  type RacerName,
  type RacerResults,
  type Racers,
  type SeasonName,
  type TrackName,
  type ModeName,
  type Constructor
} from './types'
import driversData from './data/drivers.json'
import seasonRacersData from './data/seasonRacers'
import resultsData from './data/results'

export const splitRacerName = (driver: Racer) => {
  const split = driver.name.split(' ')
  return [split.slice(0, -1).join(' '), split.slice(-1).join(' ')]
}

export const chunkRacers = (results: GeneralResult[], pageSize: number) => {
  if (results) {
    return Array.from({ length: Math.ceil(results.length / pageSize) }, (_, i) =>
      results.slice(i * pageSize, i * pageSize + pageSize)
    )
  }

  return results
}

export const combinedRacer = (driver: RacerName, season: SeasonName) => {
  const racerPresent = (seasonRacersData[season] as Racers)[driver] && driversData[driver]

  return {
    ...driversData[racerPresent ? driver : 'unknown'],
    ...(seasonRacersData[season] as Racers)[racerPresent ? driver : 'unknown']
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
    .split(/[ -]+/)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')

export const lookupStage = (mode: ModeName) => {
  switch (mode) {
    case 'podium':
      return 1
    case 'race':
      return 2
    case 'drivers':
      return 5
    case 'constructors':
      return 8
    case 'all':
      return 0
  }
}

export const idealHeight = 900
export const idealWidth = idealHeight * (16 / 9)

export const calculateScaleRatio = () => {
  if (typeof window !== 'undefined') {
    const y = (window.innerHeight - 100) / idealHeight
    const x = window.innerWidth / idealWidth

    return Math.min(y, x)
  }

  return 1
}

export const calculateTranslateOffset = (scaleRatio: number) => {
  if (typeof window !== 'undefined') {
    return (window.innerWidth - idealWidth * scaleRatio) / 2
  }

  return 0
}

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export const withBase = (href = '') =>
  import.meta.env.PROD ? `${import.meta.env.BASE_URL}${href}` : `/${href}`

export const titleSnippet = (season: SeasonName, track: TrackName, mode: ModeName) => {
  switch (mode) {
    case 'all':
      return ` | ${season.toUpperCase()} ${titleize(track)} Results`
    default:
      return ` | ${season.toUpperCase()} ${titleize(track)} ${titleize(mode)} Results`
  }
}

export const getCarBadge = (car: string) =>
  new URL(`./assets/cars/${car ?? 'bmw'}.png`, import.meta.url).href

export const entryIsRacer = (entry: Racer | Constructor): entry is Racer => {
  return (entry as Racer).team !== undefined
}

export const timeGrabber = () => {
  const table = document.querySelector('table')

  if (table) {
    const times = Array.from(table.querySelectorAll('tr'))
      .map((row) => {
        const cell = row.querySelectorAll('td')[3]
        return cell && cell.innerHTML
      })
      .filter((val) => val)

    return times.map((time, index) =>
      index > 0
        ? (Date.parse(`01/01/2000 ${time}`) - Date.parse(`01/01/2000 ${times[index - 1]}`)) / 1000
        : time
    )
  }
}
