import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import tracks from '../data/tracks.json'
import { type SeasonName, type TrackName, type RacerResult, type ModeName } from '@/types'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLastValidTrack, lookupStage, mostRecentSeason } from '@/utils'

export const useStagesStore = defineStore('stages', () => {
  const router = useRouter()
  const route = useRoute()

  const stages = [
    'raceResultsIn',
    'raceResultsPodium',
    'raceResultsClassification',
    'raceResultsOut',
    'standingsIn',
    'standings',
    'standingsOut',
    'finished',
    'noop'
  ]

  const season: Ref<SeasonName> = ref((route.params.season as SeasonName) || mostRecentSeason)
  const updateSeason = (seasonName: SeasonName) => {
    season.value = seasonName
  }
  const track: Ref<TrackName> = ref(
    (route.params.track as TrackName) || getLastValidTrack(mostRecentSeason)
  )
  const trackName = computed(() => tracks[track.value].name)
  const updateTrack = (trackName: TrackName) => {
    track.value = trackName
    router.push(`/${season.value}/${trackName}/${mode.value}`)
  }
  const mode: Ref<ModeName> = ref((route.params.mode as ModeName) || 'demo')
  const updateMode = (modeName: ModeName) => {
    mode.value = modeName
    router.push(`/${season.value}/${track.value}/${modeName}`)
  }

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

  return {
    stages,
    stageIndex,
    stage,
    advanceStage,
    setStage,
    season,
    updateSeason,
    track,
    trackName,
    fastestLap,
    bgColor,
    updateBgColor,
    updateTrack,
    mode,
    updateMode
  }
})
