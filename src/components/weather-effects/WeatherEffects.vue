<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  code?: number
}>()

const weatherType = computed(() => {
  if (props.code === undefined) return null
  const c = props.code
  if (c >= 71 && c <= 77) return 'snow'
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return 'rain'
  if (c >= 95) return 'storm'
  if (c >= 1 && c <= 3) return 'clouds'
  return null
})

const raindrops = Array.from({ length: 120 })
const snowflakes = Array.from({ length: 60 })
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <!-- Дождь -->
    <template v-if="weatherType === 'rain' || weatherType === 'storm'">
      <div
        v-for="(drop, index) in raindrops"
        :key="'drop-' + index"
        class="raindrop"
        :style="{
          left: Math.random() * 100 + '%',
          animationDuration: Math.random() * 0.5 + 0.5 + 's',
          animationDelay: Math.random() + 's',
          height: Math.random() * 15 + 10 + 'px',
          width: '2px',
          opacity: Math.random() * 0.5 + 0.3,
        }"
      ></div>
    </template>

    <!-- Снег -->
    <template v-if="weatherType === 'snow'">
      <div
        v-for="(flake, n) in snowflakes"
        :key="'flake-' + n"
        class="snowflake"
        :style="{
          left: Math.random() * 100 + '%',
          animationDuration: Math.random() * 3 + 2 + 's',
          animationDelay: Math.random() * 5 + 's',
          opacity: Math.random(),
          width: Math.random() * 4 + 2 + 'px',
          height: Math.random() * 4 + 2 + 'px',
        }"
      ></div>
    </template>

    <!-- Облака -->
    <div
      v-if="weatherType === 'clouds' || weatherType === 'rain' || weatherType === 'storm'"
      class="clouds-bg"
    ></div>
  </div>
</template>

<style scoped>
/* ===== Дождь ===== */
.raindrop {
  position: absolute;
  top: -20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: fall-rain linear infinite;
}

@keyframes fall-rain {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

/* ===== Снег ===== */
.snowflake {
  position: absolute;
  top: -10px;
  background: white;
  border-radius: 50%;
  filter: blur(1px);
  animation: fall-snow linear infinite;
}

@keyframes fall-snow {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(50vh) translateX(20px);
  }
  100% {
    transform: translateY(110vh) translateX(-20px);
  }
}

/* ===== Облака ===== */
.clouds-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% -20%, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
}
</style>
