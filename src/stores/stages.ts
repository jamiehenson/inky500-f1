import { ref, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'
import type { Ref } from 'vue'
import { type RacerResult, type ModeName, type SeasonName, type TrackName } from '../types'
import { getLastValidTrack, lookupStage, mostRecentSeason } from '../utils'

export const useStagesStore = (initialParams?: {
  season: SeasonName
  track: TrackName
  mode: ModeName
}) => {
  const params = initialParams || {
    season: mostRecentSeason,
    track: getLastValidTrack(mostRecentSeason) as TrackName,
    mode: 'all'
  }

  const stagesStore = defineStore('stages', () => {
    const stages = [
      'raceResultsIn',
      'raceResultsPodium',
      'raceResultsClassification',
      'raceResultsOut',
      'standingsIn',
      'standings',
      'standingsOut',
      'constructorsIn',
      'constructors',
      'constructorsOut',
      'finished'
    ]

    const season: Ref<SeasonName> = ref(params.season)
    const track: Ref<TrackName> = ref(params.track)
    const mode: Ref<ModeName> = ref((params.mode || 'all') as ModeName)

    const stageIndex = ref(lookupStage(mode.value) ?? 0)
    const stage = computed(() => stages[stageIndex.value])
    const advanceStage = () => {
      if (stageIndex.value < stages.length - 2) {
        stageIndex.value++
      } else {
        stageIndex.value = 0
      }
    }
    const setStage = (stage: number) => {
      stageIndex.value = stage
    }

    const fastestLap: Ref<RacerResult | undefined> = ref()

    return {
      season,
      track,
      mode,
      stages,
      stageIndex,
      stage,
      advanceStage,
      setStage,
      fastestLap
    }
  })

  return stagesStore(createPinia())
}
