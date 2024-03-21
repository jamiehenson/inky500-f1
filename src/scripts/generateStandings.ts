import fs from 'fs'
import resultsData from '../data/results'
import { seasons, type RacerResults, type TrackName, type SeasonName } from '../types'

type GeneratedRaceStandings = {
  [index: string]: number
}

type GeneratedStandings = {
  [index: string]: GeneratedRaceStandings
}

const topTenPoints = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const topTwentyPoints = [35, 29, 24, 21, 19, 17, 15, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const pointsScheme = { s1: topTenPoints, s2: topTenPoints, s3: topTenPoints, s4: topTwentyPoints }

const calculateStandings = (season: SeasonName) => {
  const seasonRaces = Object.keys(resultsData[season])

  // Compile initial race scores into standings objects
  const points = seasonRaces.reduce((racesObj: GeneratedStandings, race: string) => {
    const raceResults = (resultsData.s3 as RacerResults)[race as TrackName]

    const points = raceResults
      ? Object.keys(raceResults.results).reduce(
          (obj: GeneratedRaceStandings, item: string, currentIndex) => (
            (obj[item] =
              (pointsScheme.s3[currentIndex] ?? 0) +
              (raceResults.fastestLap.racerId === item ? 1 : 0)),
            obj
          ),
          {}
        )
      : {}

    return (racesObj[race] = points), racesObj
  }, {})

  // Add the points for each racer cumulatively, and reorder
  const raceKeys = Object.keys(points)
  raceKeys.forEach((race, index) => {
    if (index === 0) {
      return
    }

    Object.keys(points[race]).forEach((racer) => {
      points[race][racer] += points[raceKeys[index - 1]][racer]
    })

    points[race] = Object.entries(points[race])
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
  })

  return points
}

seasons.forEach((season) => {
  const jsonData = JSON.stringify(calculateStandings(season))

  const filePath = `src/data/standings/generated/${season}.json`
  try {
    fs.writeFileSync(filePath, jsonData, { flag: 'w' })
    console.log(`${season} standings data saved to file successfully.`)
  } catch (error) {
    console.error('Error writing JSON data to file:', error)
  }
})
