<template>
  <div v-if="props.hourlyForecast.length" class="bg-white/5 border border-white/10 rounded-2xl p-6">
    <h3 class="text-xl font-semibold text-white mb-4">Почасовой прогноз</h3>

    <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-custom">
      <div
        v-for="(hour, idx) in props.hourlyForecast.slice(0, 24)"
        :key="idx"
        class="min-w-20 bg-white/5 rounded-xl p-3 text-center border border-white/10"
      >
        <div class="text-gray-400 text-sm mb-1">{{ hour.hour }}:00</div>

        <div class="text-2xl text-white mb-1">{{ hour.temp }}°</div>

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
