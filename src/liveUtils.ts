import type { LiveDrivers, LiveRace } from './types'

export const sampleDrivers: LiveDrivers = {
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

export const sampleRace: LiveRace = {
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

export const nationalityLookup = (country: string) => {
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

export const carLookup = (model: number) => {
  switch (model) {
    case 60:
      return 'mercedes'
    case 59:
      return 'mclaren'
    case 52:
      return 'audi'
    case 57:
      return 'ktm'
    case 56:
      return 'ginetta'
    case 53:
      return 'bmw'
    case 55:
      return 'chevrolet'
    case 51:
      return 'astonmartin'
    case 61:
      return 'porsche'
    case 50:
      return 'alpine'
    case 58:
      return 'maserati'
    default:
      return 'renault'
  }
}
