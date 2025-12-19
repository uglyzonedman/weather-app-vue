export interface SelectedCity {
  name: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

export interface WeatherData {
  daily: {
    weathercode: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    time: string[]
  }
  hourly: {
    apparent_temperature: number[]
    time: string[]
    temperature_2m: number[]
    weathercode: number[]
  }
  current: {
    apparent_temperature: number
    interval: number
    relative_humidity_2m: number
    temperature_2m: number
    time: string
    weathercode: number
    windspeed_10m: number
  }
}

export interface Citylist {
  name: string
  country: string
}

export interface HourlyForecast {
  time: string
  hour: string
  temp: string
  code: number
}
