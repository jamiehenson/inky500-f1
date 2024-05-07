<script setup lang="ts">
import Nav from './components/NavComponent.vue'
import './assets/base.css'
import { useStagesStore } from './stores/stages'
import { storeToRefs } from 'pinia'

const { bgColor } = storeToRefs(useStagesStore())
</script>

<template>
  <header><Nav /></header>
  <main>
    <div
      class="app transition-colors mx-auto h-full sm:h-screen overflow-scroll sm:overflow-hidden pt-12 sm:pt-16"
    >
      <RouterView :key="$route.fullPath" />
    </div>
  </main>
</template>

<style>
.app {
  background: v-bind(bgColor);
}
</style>
