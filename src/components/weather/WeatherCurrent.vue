<template>
  <div class="flex items-center gap-6 mb-8">
    <div class="bg-white/5 rounded-xl p-5 border border-white/10">
      <!-- Иконка можно вынести позже -->
      <slot name="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-200"
        >
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      </slot>
    </div>

    <div class="flex-1">
      <div class="flex items-start gap-1 mb-2">
        <span class="text-7xl font-light text-white">
          {{ temperature }}
        </span>
        <span class="text-3xl text-gray-400 mt-4">°</span>
      </div>

      <div class="text-gray-300 mb-1 text-lg">
        {{ description }}
      </div>

      <div class="text-gray-400 text-sm">Ощущается как {{ feelsLike }}°</div>

      <div class="text-gray-500 text-sm">Ветер {{ weather.windspeed_10m }} м/с</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { weatherCode } from '@/utils/utils'
import { computed } from 'vue'

const props = defineProps<{
  weather: any
}>()

const temperature = computed(() => Math.round(props.weather.temperature_2m))

const feelsLike = computed(() => Math.round(props.weather.apparent_temperature))

const description = computed(() => weatherCode(props.weather.weathercode))
</script>
