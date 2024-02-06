import standings from './standings/results.json'
import racers from './standings/racers.json'

export type SeasonName = 's3'

export type TrackName = keyof (typeof standings)[SeasonName]

export type RacerName = keyof (typeof racers)[SeasonName]

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
