import { weatherService } from '@/services/weather.service'
import type { Citylist, SelectedCity, WeatherData } from '@/types/weather'
import { days, months } from '@/utils/utils'
import axios from 'axios'
import { computed, ref } from 'vue'

export const useWeather = () => {
  const weatherData = ref<WeatherData | null>(null)

  const searchCity = ref('')
  const coords = ref({})
  const cityList = ref<Citylist[]>([])
  const isLoading = ref(false)
  const isOpen = ref(false)

  const selectedCity = ref<SelectedCity>({
    country: '',
    latitude: 0,
    longitude: 0,
    name: '',
    timezone: '',
  })

  const getWeather = async (selectedCity: SelectedCity) => {
    console.log('seelectedCity', selectedCity)
    isLoading.value = true
    try {
      coords.value = await weatherService.getCoordsByCityName(searchCity.value)
      weatherData.value = await weatherService.getWeather(
        selectedCity.latitude,
        selectedCity.longitude,
        selectedCity.timezone,
      )
      console.log('weatherData', weatherData.value)
    } finally {
      isLoading.value = false
    }
  }

  const getCurrentDateWeather = (date: Date) => {
    const currentMonths = months[date.getMonth()]
    const currentDay = days[date.getDay()]
    const currentDate = date.getDate()
    return `${currentDay}, ${currentDate} ${currentMonths}`
  }

  const getCurrentTimeWeather = (time: Date) => {
    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
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

  const hourlyForecast = computed(() => {
    if (!weatherData.value?.hourly) return []

    const { time, temperature_2m, weathercode } = weatherData.value.hourly

    return time.map((t: string, i: number) => ({
      time: t,
      hour: new Date(t).getHours().toString().padStart(2, '0'),
      temp: temperature_2m.length !== 0 && temperature_2m[i] ? Math.round(temperature_2m[i]) : '',
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

        selectedCity.value = {
          name: geoRes.data.address.city,
          country: geoRes.data.address.country,
          latitude: geoRes.data.lat ?? 0,
          longitude: geoRes.data.lon ?? 0,
          timezone: geoRes.data.timezone ?? 'UTC',
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

  const hasCurrentWeather = computed(() => Boolean(weatherData.value?.current))

  return {
    hasCurrentWeather,
    requestGeolocation,
    hourlyForecast,
    dailwyWeather,
    getCurrentTimeWeather,
    getWeather,
    selectedCity,
    weatherData,
    searchCity,
    coords,
    cityList,
    isLoading,
    isOpen,
    getCurrentDateWeather,
  }
}
