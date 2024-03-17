import racersData from './data/racers.json'
import trackData from './data/tracks.json'

export const seasons = ['s1', 's2', 's3', 's4'] as const
export type SeasonName = (typeof seasons)[number]

export const modes = ['all', 'podium', 'race', 'standings'] as const
export type ModeName = (typeof modes)[number]

export const tracks = Object.keys(trackData)
export type TrackName = keyof typeof trackData

export const racers = Object.keys(racersData)
export type RacerName = keyof typeof racersData

export type Standings = {
  [key in SeasonName]: {
    [key in TrackName]: {
      name: string
      positions: NumberObject
    }
  }
}

export type Racers = {
  [key in RacerName]: Racer
}

export type Racer = {
  name: string
  team: string
  teamColor: string
  car: string
  img?: string
  countryCode?: string
}

export type RacerResult = {
  racer: Racer
  time: string
}

export type StandingsResult = {
  racer: Racer
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
