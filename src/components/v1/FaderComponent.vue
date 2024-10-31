<template>
  <div
    class="fader hidden sm:block absolute h-full top-0 left-0 rounded-xl"
    style="animation-delay: 0s"
  >
    <img src="/src/assets/gghq.png" class="fader-gghq opacity-50" />
  </div>
</template>

<script setup lang="ts">
const { slow } = defineProps<{ slow?: boolean }>()
const animationSpeed = slow ? '2s' : '1.5s'
</script>

<style scoped>
.fader {
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 26%,
    var(--vt-bg) 26%,
    var(--vt-bg) 45%,
    var(--vt-bg-light) 45%
  );
  animation: v-bind(animationSpeed) slideOut ease forwards;
  margin-left: -100%;
  width: 200%;
  z-index: 1;
}

.fader-gghq {
  /* margin-left: -50%; */
  margin-top: 10%;
  margin-left: 25%;
  width: 31vh;
  height: 50vh;
}

@keyframes slideOut {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
