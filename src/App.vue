<script lang="ts" setup>
import axios from 'axios'
import { weatherService } from './services/weather.service'
import { computed, onMounted, ref, watch } from 'vue'

const weatherData = ref({})
const searchCity = ref('')
const coords = ref({})
const cityList = ref([])
const isLoading = ref(false)
const isOpen = ref(false)
const selectedCity = ref({})
const getWeather = async (selectedCity) => {
  console.log('seelectedCity', selectedCity.value)
  isLoading.value = true
  try {
    coords.value = await weatherService.getCoordsByCityName(searchCity.value)
    weatherData.value = await weatherService.getWeather(
      selectedCity.value.latitude,
      selectedCity.value.longitude,
      selectedCity.value.timezone,
    )
    console.log('weatherData', weatherData.value)
  } finally {
    isLoading.value = false
  }
}

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

const dailwyWeather = computed(() => {
  if (!weatherData.value?.daily) return []

  const { weathercode, temperature_2m_max, temperature_2m_min, time } = weatherData.value.daily

  const array = time.map((item, index) => ({
    t_max: temperature_2m_max[index],
    t_min: temperature_2m_min[index],
    weathercode: weathercode[index],
    day: days[new Date(item).getDay()],
    date: item,
  }))
  console.log('array', array)

  return array
})

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

watch(searchCity, async (value) => {
  if (value.length < 2) {
    cityList.value = []
    isOpen.value = false
    return
  }
  cityList.value = await weatherService.searchCities(value)
  isOpen.value = true
})

watch(dailwyWeather, (value) => {
  console.log('value', value)
})

const selectCity = async (city: any) => {
  selectedCity.value = city
  searchCity.value = city.name
  isOpen.value = false
  await getWeather(selectedCity)
}

const hourlyForecast = computed(() => {
  if (!weatherData.value?.hourly) return []

  const { time, temperature_2m, weathercode } = weatherData.value.hourly

  return time.map((t: string, i: number) => ({
    time: t,
    hour: new Date(t).getHours().toString().padStart(2, '0'),
    temp: Math.round(temperature_2m[i]),
    code: weathercode[i],
  }))
})

const requestGeolocation = () => {
  if (!('geolocation' in navigator)) {
    console.log('Геолокация не поддерживается')

    return
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      console.log('position', position.coords)

      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&timezone=auto`,
      )

      const geoRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          format: 'json',
          accept_language: 'ru',
        },
        headers: {
          'User-Agent': 'weather-app', // обязательно!
        },
      })

      console.log('geoRes', geoRes.data)
      selectedCity.value = {
        name: geoRes.data.address.city,
        country: geoRes.data.address.country,
      }
      weatherData.value = await weatherService.getWeather(
        res.data.latitude,
        res.data.longitude,
        res.data.timezone,
      )
    },
    (error) => {
      console.error('Geolocation error:', error.message)
    },
  )
}

watch(weatherData, (value) => {
  console.log('weatherData', value)
})
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center"
  >
    <div class="max-w-3xl w-full space-y-6">
      <!-- Header -->
      <div class="text-white">
        <h3 class="text-3xl font-semibold mb-1">Погода</h3>
        <p class="text-gray-400 text-base">Прогноз погоды для тебя</p>
      </div>

      <!-- Search Bar -->
      <div class="flex gap-3 relative">
        <input
          v-model="searchCity"
          type="text"
          placeholder="Поиск города"
          @keyup.enter="getWeather"
          class="flex-1 bg-white/5 border border-white/10 rounded-lg px-5 py-3 text-white text-base placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-200"
        />
        <button
          @click="requestGeolocation"
          :disabled="isLoading"
          class="bg-white/5 border border-white/10 rounded-lg px-6 py-3 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="!isLoading"
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
          <svg
            v-else
            class="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 2.2"
            />
          </svg>
          GPS
        </button>

        <transition name="slide">
          <div
            v-if="isOpen && cityList.length !== 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm overflow-hidden z-10"
          >
            <button
              v-for="(city, idx) of cityList"
              :key="idx"
              @click="selectCity(city)"
              class="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-all duration-150 border-b border-white/5 last:border-0 flex items-center justify-between group"
            >
              <div class="flex flex-col">
                <span class="font-medium">{{ city.name }}</span>
                <span class="text-gray-400 text-sm">{{ city.country }}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-gray-500 group-hover:text-white transition-colors"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </transition>
      </div>

      <!-- Weather Card -->
      <transition name="fade">
        <div
          v-if="weatherData && weatherData.current"
          class="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="text-3xl font-semibold text-white mb-1">{{ selectedCity.name }}</h3>
              <span class="text-gray-400 text-sm">{{ selectedCity.country }}</span>
            </div>
            <div class="text-right">
              <div class="text-gray-400 text-sm">
                {{ getCurrentDateWeather(new Date(weatherData.current.time)) }}
              </div>
              <div class="text-gray-500 text-xs mt-1">
                Обновлено {{ getCurrentTimeWeather(new Date(weatherData.current.time)) }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-6 mb-8">
            <div class="bg-white/5 rounded-xl p-5 border border-white/10">
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
            </div>
            <div class="flex-1">
              <div class="flex items-start gap-1 mb-2">
                <span class="text-7xl font-light text-white">
                  {{ Math.round(weatherData.current?.temperature_2m) ?? '--' }}
                </span>
                <span class="text-3xl text-gray-400 mt-4">°</span>
              </div>
              <div class="text-gray-300 mb-1 text-lg">
                {{ weatherCode(weatherData.current?.weathercode) }}
              </div>
              <div class="text-gray-400 text-sm">
                Ощущается как
                {{ Math.round(weatherData.current.apparent_temperature) }}°
              </div>
              <div class="text-gray-500 text-sm">
                Ветер {{ weatherData.current.windspeed_10m }} м/с
              </div>
            </div>
          </div>

          <div class="h-px bg-white/10 my-6"></div>

          <div class="grid grid-cols-3 gap-4">
            <div
              class="bg-white/5 rounded-lg p-4 border border-white/10 text-center hover:border-white/20 hover:bg-white/8 transition-all duration-200"
            >
              <div class="text-gray-500 text-sm mb-2">Макс</div>
              <div class="text-2xl font-medium text-white">
                {{ Math.round(weatherData.daily.temperature_2m_max[0]) }}°
              </div>
            </div>
            <div
              class="bg-white/5 rounded-lg p-4 border border-white/10 text-center hover:border-white/20 hover:bg-white/8 transition-all duration-200"
            >
              <div class="text-gray-500 text-sm mb-2">Мин</div>
              <div class="text-2xl font-medium text-white">
                {{ Math.round(weatherData.daily.temperature_2m_min[0]) }}°
              </div>
            </div>
            <div
              class="bg-white/5 rounded-lg p-4 border border-white/10 text-center hover:border-white/20 hover:bg-white/8 transition-all duration-200"
            >
              <div class="text-gray-500 text-sm mb-2">Влажность</div>
              <div class="text-2xl font-medium text-white">
                {{ weatherData.current.relative_humidity_2m }}%
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Hourly Forecast -->
      <div v-if="hourlyForecast.length" class="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 class="text-xl font-semibold text-white mb-4">Почасовой прогноз</h3>

        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-custom">
          <div
            v-for="(hour, idx) in hourlyForecast.slice(0, 24)"
            :key="idx"
            class="min-w-[80px] bg-white/5 rounded-xl p-3 text-center border border-white/10"
          >
            <div class="text-gray-400 text-sm mb-1">{{ hour.hour }}:00</div>

            <div class="text-2xl text-white mb-1">{{ hour.temp }}°</div>

            <div class="text-gray-400 text-xs">
              {{ weatherCode(hour.code) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
}

.scrollbar-custom::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
