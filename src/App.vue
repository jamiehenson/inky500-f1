<script setup lang="ts">
import RaceResults from './components/RaceResults.vue'
import './assets/base.css'
</script>

<template>
  <header></header>

  <main>
    <div class="container mx-auto h-screen flex items-center justify-center flex-col p-3 min-w-fit">
      <RaceResults />
    </div>
  </main>
</template>
