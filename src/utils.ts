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
  type Constructor,
  type SeasonRacers,
  type ConstructorName
} from './types'
import driversData from './data/drivers.json'
import trackData from './data/tracks.json'
import constructorData from './data/constructors.json'
import constructorsData from './data/constructors/index'
import seasonRacersData from './data/seasonRacers'
import standingsData from './data/standings'
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

export const combinedRacer = (driver: RacerName, season: SeasonName, track: TrackName) => {
  const racerPresent = seasonRacersData[season] && driversData[driver]
  const seasonRacer = (seasonRacersData[season] as SeasonRacers)[racerPresent ? driver : 'unknown']

  return {
    ...driversData[racerPresent ? driver : 'unknown'],
    ...(seasonRacersData[season] as Racers)[racerPresent ? driver : 'unknown'],
    car: seasonRacer.otherCars?.[track] ?? seasonRacer.car,
    id: driver
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
      return ` | ${season.toUpperCase()} ${trackData[track].name} Results`
    default:
      return ` | ${season.toUpperCase()} ${trackData[track].name} ${titleize(mode)} Results`
  }
}

export const getCarBadge = (car: string) =>
  new URL(`./assets/cars/${car ?? 'bmw'}.png`, import.meta.url).href

export const entryIsRacer = (entry: Racer | Constructor): entry is Racer => {
  return (entry as Racer).team !== undefined
}

const topTenPoints = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const topTwentyPoints = [35, 29, 24, 21, 19, 17, 15, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
export const pointsScheme = {
  s1: topTenPoints,
  s2: topTenPoints,
  s3: topTenPoints,
  s4: topTwentyPoints
}

export const msToTime = (duration: number) => {
  const s = (duration / 1000) % 60,
    m = Math.floor((duration / (1000 * 60)) % 60)

  const minutes = m < 10 ? '0' + m : m
  const seconds = s < 10 ? '0' + s.toFixed(3) : s.toFixed(3)

  return minutes + ':' + seconds
}

export const pointslessResults = ['DNF', 'DSQ']

type ChartSet = { label: string; data: number[] }

export const getChartData = (season: SeasonName) => {
  const standings = standingsData[season]
  const constructors = constructorsData[season]

  const labels: string[] = []
  const standingsSet: Record<string, ChartSet> = {}
  const constructorsSet: Record<string, ChartSet> = {}

  Object.entries(standings).forEach(([track, set]) => {
    if (!set) {
      return
    }

    labels.push(trackData[track as TrackName].name)

    Object.entries(set).forEach(([key, value]) => {
      if (!standingsSet[key]) {
        standingsSet[key] = {
          label: driversData[key as RacerName].name,
          data: []
        }
      }
      standingsSet[key].data.push(value as number)
    })
  })

  Object.values(constructors).forEach((set) => {
    if (!set) return

    Object.entries(set).forEach(([key, value]) => {
      if (!constructorsSet[key]) {
        constructorsSet[key] = {
          label: constructorData[key as ConstructorName].name,
          data: []
        }
      }
      constructorsSet[key].data.push(value.normalisedPoints)
    })
  })

  return {
    labels,
    standingsDataset: Object.values(standingsSet).sort((a: ChartSet, b: ChartSet) =>
      a.label.localeCompare(b.label)
    ),
    constructorsDataset: Object.values(constructorsSet).sort((a: ChartSet, b: ChartSet) =>
      a.label.localeCompare(b.label)
    )
  }
}
