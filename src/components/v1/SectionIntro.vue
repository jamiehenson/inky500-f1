<template>
  <div class="wide text-center p-8 w-full relative">
    <FaderComponent slow />
    <h1 class="text-lg sm:text-6xl uppercase">{{ heading }}</h1>
    <h2 class="text-md sm:text-4xl text-red-600 uppercase">{{ subHeading }}</h2>
  </div>
</template>

<script setup lang="ts">
import FaderComponent from './FaderComponent.vue'
const { heading, subHeading } = defineProps<{ heading: string; subHeading: string }>()
</script>
