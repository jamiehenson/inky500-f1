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
    <div class="app transition-colors mx-auto h-screen overflow-hidden pt-16 lg:pt-20">
      <RouterView :key="$route.fullPath" />
    </div>
  </main>
</template>

<style>
.app {
  background: v-bind(bgColor);
}
</style>
