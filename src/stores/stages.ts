import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import tracks from '../standings/tracks.json'
import type { SeasonName, TrackName, RacerResult } from '@/types'
import type { Ref } from 'vue'

export const useStagesStore = defineStore('stages', () => {
  const stages = [
    'raceResultsIn',
    'raceResultsPodium',
    'raceResultsClassification',
    'raceResultsOut',
    'standingsIn',
    'standings',
    'standingsOut',
    'finished'
  ]
  const stageIndex = ref(0)
  const stage = computed(() => stages[stageIndex.value])
  const advanceStage = () => {
    if (stageIndex.value < stages.length) {
      stageIndex.value++
    }
  }

  const season: Ref<SeasonName> = ref('s3')
  const track: Ref<TrackName> = ref('nurburgring')
  const trackName = computed(() => tracks[track.value].name)

  const results: Ref<RacerResult[]> = ref([])
  const fastestLap: Ref<RacerResult | undefined> = ref()

  return {
    stages,
    stageIndex,
    stage,
    advanceStage,
    season,
    track,
    trackName,
    results,
    fastestLap
  }
})
