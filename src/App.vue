<script lang="ts" setup>
import { weatherService } from './services/weather.service'
import { onMounted, ref, watch } from 'vue'

const weatherData = ref({})
const searchCity = ref('')
const coords = ref({})

const getWeather = async () => {
  coords.value = await weatherService.getCoordsByCityName(searchCity.value)
  weatherData.value = await weatherService.getWeather(
    coords.value.results[0].latitude,
    coords.value.results[0].longitude,
    coords.value.results[0].timezone,
  )

  console.log('coords', coords.value)
  console.log('weatherData', weatherData.value)
}

const date = new Date()

const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

const getCurrentTimeWeather = (time: Date) => {
  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const getCurrentDateWeather = (date: Date) => {
  const currentMonths = months[date.getMonth()]
  const currentDay = days[date.getDay()]
  const currentDate = date.getDate()
  return `${currentDay}, ${currentDate} ${currentMonths}`
}

const weatherCode = (code: number) => {
  switch (code) {
    case 0:
      return 'Ясно'

    case 1:
    case 2:
      return 'Переменная облачность'

    case 3:
      return 'Пасмурно'

    case 45:
    case 48:
      return 'Туман'

    case 51:
    case 53:
    case 55:
      return 'Морось'

    case 56:
    case 57:
      return 'Переохлаждённая морось'

    case 61:
    case 63:
    case 65:
      return 'Дождь'

    case 66:
    case 67:
      return 'Переохлаждённый дождь'

    case 71:
    case 73:
    case 75:
      return 'Снегопад'

    case 77:
      return 'Снежные зерна'

    case 80:
    case 81:
    case 82:
      return 'Ливни'

    case 85:
    case 86:
      return 'Снегопады сильные'

    case 95:
      return 'Гроза'

    case 96:
    case 99:
      return 'Гроза с градом'

    default:
      return 'Неизвестная погода'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="text-white">
        <h3 class="text-3xl font-semibold mb-1">Погода</h3>
        <p class="text-gray-400 text-base">Прогноз погоды для тебя</p>
      </div>

      <div class="flex gap-3">
        <input
          v-model="searchCity"
          type="text"
          placeholder="Поиск города"
          class="flex-1 bg-white/5 border border-white/10 rounded-lg px-5 py-3 text-white text-base placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
        />
        <button
          @click="getWeather"
          class="bg-white/5 border border-white/10 rounded-lg px-6 py-3 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          GPS
        </button>
      </div>

      <div
        v-if="weatherData && weatherData.current_weather"
        class="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div class="flex items-start justify-between mb-8">
          <div>
            <h3 class="text-3xl font-semibold text-white mb-1">{{ coords.results[0].name }}</h3>
            <span class="text-gray-400 text-sm">{{ coords.results[0].country }}</span>
          </div>
          <div class="text-right">
            <div class="text-gray-400 text-sm">
              {{ getCurrentDateWeather(new Date(weatherData.current_weather.time)) }}
            </div>
            <div class="text-gray-500 text-xs mt-1">
              Обновлено {{ getCurrentTimeWeather(new Date(weatherData.current_weather.time)) }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6 mb-8">
          <div class="bg-white/5 rounded-xl p-5">
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
              class="text-gray-300"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-start gap-1 mb-2">
              <span class="text-7xl font-light text-white">
                {{ Math.round(weatherData.current_weather?.temperature) ?? '--' }}
              </span>
              <span class="text-3xl text-gray-400 mt-4">°</span>
            </div>
            <div class="text-gray-300 mb-1 text-lg">
              {{ weatherCode(weatherData.current_weather?.weathercode) }}
            </div>
            <div class="text-gray-500 text-sm">Ощущается как 3°</div>
          </div>
        </div>

        <div class="h-px bg-white/10 my-6"></div>

        <div class="flex justify-around text-center">
          <div>
            <div class="text-gray-500 text-sm mb-1">Макс</div>
            <div class="text-xl font-medium text-white">6°</div>
          </div>
          <div>
            <div class="text-gray-500 text-sm mb-1">Мин</div>
            <div class="text-xl font-medium text-white">4°</div>
          </div>
        </div>
      </div>

      <!-- Hourly Forecast -->
      <div
        v-if="weatherData && weatherData.current_weather"
        class="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h3 class="text-xl font-semibold text-white mb-4">Почасовый прогноз</h3>

        <!-- <div class="flex gap-4 overflow-x-auto pb-2">
          <div
            v-for="(hour, index) in hourlyForecast"
            :key="index"
            class="bg-white/5 rounded-xl p-4 min-w-[100px] text-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div class="text-gray-400 text-sm font-medium mb-3">{{ hour.time }}</div>
            <div class="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-gray-300"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            <div class="text-xl font-medium text-white mb-2">{{ hour.temp }}°</div>
            <div class="text-xs text-gray-500">{{ hour.desc }}</div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style></style>
