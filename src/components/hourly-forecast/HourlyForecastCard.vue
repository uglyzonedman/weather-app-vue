<template>
  <div
    v-if="props.hourlyForecast.length"
    class="bg-white/5 border border-white/10 rounded-3xl p-6 z-20 backdrop-blur-md"
  >
    <h3 class="text-2xl font-bold text-white mb-6">Почасовой прогноз</h3>

    <div class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
      <div
        v-for="(hour, idx) in props.hourlyForecast.slice(0, 24)"
        :key="idx"
        class="min-w-[80px] bg-gradient-to-b from-white/5 to-white/10 rounded-xl p-4 text-center border border-white/10 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
      >
        <div class="text-gray-400 text-sm mb-2">{{ hour.hour }}:00</div>

        <div class="text-2xl font-semibold text-white mb-2">{{ Math.round(hour.temp) }}°</div>

        <div class="text-gray-400 text-xs">
          {{ hour.code !== undefined ? weatherCode(hour.code) : '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HourlyForecast } from '@/types/weather'
import { weatherCode } from '@/utils/utils'

const props = defineProps<{ hourlyForecast: HourlyForecast[] }>()
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  transition: background 0.3s ease;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Для Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05);
}
</style>
