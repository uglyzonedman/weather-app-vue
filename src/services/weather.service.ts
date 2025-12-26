import axios from 'axios'

export const weatherService = {
  getWeather: async (latitude: number, longitude: number, timezone: string) => {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        timezone,

        current:
          'temperature_2m,apparent_temperature,weathercode,windspeed_10m,relative_humidity_2m',

        hourly: 'temperature_2m,apparent_temperature,weathercode',

        daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      },
    })

    return response.data
  },

  getCoordsByCityName: async (cityName: string) => {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: cityName, count: 1 },
    })
    return response.data
  },
  searchCities: async (query: string) => {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: query,
        count: 1,
        language: 'ru',
      },
    })

    return response.data.results || []
  },
}
