import driversData from './data/drivers.json'
import trackData from './data/tracks.json'
import constructorsData from './data/constructors.json'

export const seasons = ['s1', 's2', 's3', 's4'] as const
export type SeasonName = (typeof seasons)[number]

export const modes = ['all', 'podium', 'race', 'drivers', 'constructors'] as const
export type ModeName = (typeof modes)[number]

export const tracks = Object.keys(trackData)
export type TrackName = keyof typeof trackData

export const drivers = Object.keys(driversData)
export type RacerName = keyof typeof driversData

export const constructors = Object.keys(constructorsData)
export type ConstructorName = keyof typeof constructorsData

export type Tracks = {
  [key in TrackName]: Track
}

export type Track = {
  name: TrackName
  countryCode: string
  noPoints?: boolean
}

export type Racers = {
  [key in RacerName]: Racer
}

export type Racer = {
  name: string
  team: string
  car: string
  teamColor?: string
  img?: string
  countryCode?: string
  twitch?: string
  id?: string
}

export type RacerResult = {
  entry: Racer
  time: string
}

export type SeasonRacer = {
  team: string
  car: string
  teamColor?: string
  otherCars?: { [index: string]: string }
}

export type SeasonRacers = {
  [key in RacerName]: SeasonRacer
}

export type StandingsResult = {
  entry: Racer | Constructor
  points: number
  position: number
  delta: number
}

export type NumberObject = {
  [index: string]: number
}

export type GeneralResult = RacerResult | StandingsResult

export type RacerResults = {
  [index in TrackName]: {
    results: {
      [index in RacerName]: string
    }
    fastestLap: {
      racerId: RacerName
      time: string
    }
  }
}

export type StandingsResults = {
  [index in TrackName]: {
    [index in RacerName]: number
  }
}

export type Constructor = {
  name: string
  countryCode: string
  img: string
}

export type ConstructorResult = {
  points: number
  normalisedPoints: number
  driverCount: number
}

export type ConstructorResults = {
  [index in ConstructorName]: ConstructorResult
}

export type ConstructorsResults = {
  [index in TrackName]: ConstructorResults
}

export type Penalties = Record<string, Record<string, number>>

export type LiveDrivers = Record<
  string,
  { model: number; team: string; nationality: string; driver: string }
>

type LiveRaceInner = { pos: number; lap: number; laps: number; spline: number }

export type LiveRace = Record<string, LiveRaceInner>

export type LiveRaceEntries = [string, LiveRaceInner]
