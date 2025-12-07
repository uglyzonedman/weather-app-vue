import axios from 'axios'

export const weatherService = {
  getWeather: async (latitude: number, longitude: number, timezone: string) => {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,weathercode',
        timezone,
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
}
