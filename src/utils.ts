import type { GeneralResult, Racer } from './types'

export const splitRacerName = (racer: Racer) => {
  const split = racer.name.split(' ')
  return [split.slice(0, -1).join(' '), split.slice(-1).join(' ')]
}

export const chunkRacers = (results: GeneralResult[], pageSize: number) =>
  Array.from({ length: Math.ceil(results.length / pageSize) }, (_, i) =>
    results.slice(i * pageSize, i * pageSize + pageSize)
  )
