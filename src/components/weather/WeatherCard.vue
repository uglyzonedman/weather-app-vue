<template>
  <transition name="fade">
    <div
      v-if="props.hasCurrentWeather"
      class="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300"
    >
      <weather-header :city="props.selectedCity" :time="props.weatherData.current.time" />

      <WeatherCurrent :weather="props.weatherData.current" />

      <div class="h-px bg-white/10 my-6"></div>

      <WeatherStats
        :daily="props.weatherData.daily"
        :humidity="props.weatherData.current.relative_humidity_2m"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { WeatherData } from '@/types/weather'
import WeatherCurrent from './WeatherCurrent.vue'
import WeatherHeader from './WeatherHeader.vue'
import WeatherStats from './WeatherStats.vue'
const props = defineProps<{
  hasCurrentWeather: boolean
  selectedCity: {
    name: string
    country: string
  }
  weatherData: WeatherData
}>()

console.log('hasCurrentWeather', props.hasCurrentWeather)
</script>
