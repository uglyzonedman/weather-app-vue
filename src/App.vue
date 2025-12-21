<script lang="ts" setup>
import { watch } from 'vue'
import HourlyForecastCard from '@/components/hourly-forecast/HourlyForecastCard.vue'
import WeatherCard from '@/components/weather/WeatherCard.vue'
import { useWeather } from '@/composables/useWeather'
import { weatherService } from '@/services/weather.service'
import SearchBar from '@/components/search-bar/SearchBar.vue'
import { weatherCode } from './utils/utils'

const {
  cityList,
  getWeather,
  hasCurrentWeather,
  hourlyForecast,
  isLoading,
  isOpen,
  requestGeolocation,
  searchCity,
  selectedCity,
  weatherData,
  dailwyWeather,
} = useWeather()

watch(searchCity, async (value) => {
  if (value.length < 2) {
    cityList.value = []
    isOpen.value = false
    return
  }
  cityList.value = await weatherService.searchCities(value)
  isOpen.value = true
})

const selectCity = async (city: any) => {
  selectedCity.value = city
  searchCity.value = city.name
  isOpen.value = false
  await getWeather(selectedCity.value)
}

watch(weatherData, (value) => {
  console.log('weatherData', value)
})
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 flex items-center justify-center"
  >
    <div class="w-full max-w-5xl space-y-6">
      <!-- Header -->
      <div class="text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">Погода</h1>
        <p class="text-slate-400 text-base md:text-lg">Прогноз погоды для тебя</p>
      </div>

      <search-bar
        :city-list="cityList"
        :get-weather="getWeather"
        :is-loading="isLoading"
        :is-open="isOpen"
        :request-geolocation="requestGeolocation"
        :search-city="searchCity"
        :select-city="selectCity"
        :selected-city="selectedCity"
      />

      <weather-card
        :has-current-weather="hasCurrentWeather"
        :selected-city="selectedCity"
        :weather-data="weatherData"
      />

      <hourly-forecast-card :hourly-forecast="hourlyForecast" />
      <div
        v-if="dailwyWeather && dailwyWeather.length"
        class="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300"
      >
        <h3 class="text-xl font-semibold text-white mb-4">Прогноз погоды на неделю</h3>

        <div class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          <div
            v-for="(daily, idx) in dailwyWeather"
            :key="idx"
            class="min-w-28 bg-white/5 rounded-xl p-3 text-center border border-white/10"
          >
            <div class="text-gray-400 text-sm mb-2">{{ daily.date }}</div>

            <div class="text-white text-xs font-medium mb-2">{{ daily.day }}</div>

            <div class="space-y-1 mb-2">
              <div class="flex justify-center items-center gap-2">
                <span class="text-gray-400 text-xs">Макс:</span>
                <span class="text-red-400 text-lg font-semibold">{{ daily.t_max }}°</span>
              </div>
              <div class="flex justify-center items-center gap-2">
                <span class="text-gray-400 text-xs">Мин:</span>
                <span class="text-blue-400 text-lg font-semibold">{{ daily.t_min }}°</span>
              </div>
            </div>

            <div class="text-gray-400 text-xs">
              {{ daily.weathercode !== undefined ? weatherCode(daily.weathercode) : '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(100, 116, 139, 0.1);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.5);
}

.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.3) rgba(100, 116, 139, 0.1);
}
</style>
