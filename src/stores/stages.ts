import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import * as Ably from 'ably'
import { type SeasonName, type TrackName, type RacerResult, type ModeName } from '@/types'
import { getLastValidTrack, lookupStage, mostRecentSeason } from '@/utils'

export const useStagesStore = defineStore('stages', () => {
  const route = useRoute()
  const paramsStr = route.path.split('/').slice(1, -1)

  const params = {
    season: paramsStr[0],
    track: paramsStr[1],
    mode: paramsStr[2]
  }

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

  const season: Ref<SeasonName> = ref((params.season as SeasonName) || mostRecentSeason)
  const track: Ref<TrackName> = ref(
    (params.track as TrackName) || getLastValidTrack(mostRecentSeason)
  )

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

  const bgColor = ref('rgb(21,20,29)')
  const updateBgColor = (color: string) => {
    switch (color) {
      case 'blue':
        bgColor.value = 'rgb(21,20,29)'
        break
      case 'green':
        bgColor.value = 'rgb(0,177,64)'
        break
    }
  }

  const ably = new Ably.Realtime('lTQPrA.-iRpAQ:aLBd5k5RozpsMLTn2mgk1MwPBE3yn6hP8H5Y5ZR65wk')
  const ablyConnected = ref(false)
  ably.connection.once('connected', () => {
    ablyConnected.value = true
  })

  return {
    stages,
    stageIndex,
    stage,
    advanceStage,
    setStage,
    season,
    track,
    fastestLap,
    bgColor,
    updateBgColor,
    mode,
    ably,
    ablyConnected
  }
})
