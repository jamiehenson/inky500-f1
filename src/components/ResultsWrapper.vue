<template>
  <div v-if="dataAvailable" class="h-full" :style="`transform: translateX(${translateOffset}px)`">
    <div
      class="h-full sm:aspect-video flex items-center object-contain sm:p-3 overflow-x-hidden origin-top-left ratio"
    >
      <div
        :class="[
          'outer-wrapper h-full w-full sm:white-outline sm:overflow-hidden flex items-center',
          animationClass
        ]"
      >
        <slot />
      </div>
    </div>
  </div>
  <div v-else class="h-full flex items-center justify-center">
    <div>
      <h2 class="font-bold">Waiting for data...</h2>
      <div class="loader h-[160px] flex flex-col items-center justify-center">
        <div class="ball-triangle-path h-12">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { calculateScaleRatio, calculateTranslateOffset, debounce, idealHeight } from '../utils'
import 'loaders.css/loaders.min.css'

const { dataAvailable, animationClass } = defineProps<{
  dataAvailable?: boolean
  animationClass?: string
}>()

const scaleRatio = ref(calculateScaleRatio())
const translateOffset = ref(calculateTranslateOffset(scaleRatio.value))

const updateScaleRatio = debounce(() => {
  scaleRatio.value = calculateScaleRatio()
  translateOffset.value = calculateTranslateOffset(scaleRatio.value)
}, 200)

const idealHeightAsPx = `${idealHeight}px`

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateScaleRatio)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateScaleRatio)
  }
})
</script>

<style>
.outer-wrapper {
  background: var(--vt-bg-light);
}

.outer-wrapper-intro {
  height: 160px;
  animation:
    1s expandOut ease forwards,
    1s expandUp 2s ease forwards;
}

.finished {
  transform: scaleY(0);
}

.outer-wrapper-outro {
  animation: 1s collapse ease forwards;
}

@media screen and (min-width: 640px) {
  .ratio {
    height: v-bind('idealHeightAsPx');
    transform: scale(v-bind('scaleRatio'));
  }
}

@keyframes expandOut {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

@keyframes expandUp {
  0% {
    height: 160px;
  }
  100% {
    height: 100%;
  }
}

@keyframes collapse {
  0% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0);
    opacity: 0;
  }
}

@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
