<template>
  <div class="grid grid-cols-3 gap-4">
    <WeatherStatItem label="Макс" :value="maxTemp" />
    <WeatherStatItem label="Мин" :value="minTemp" />
    <WeatherStatItem label="Влажность" :value="humidity + '%'" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WeatherStatItem from './WeatherStatItem.vue'

const props = defineProps<{
  daily: any
  humidity: number
}>()

const maxTemp = computed(() =>
  props.daily.temperature_2m_max?.[0] !== undefined
    ? Math.round(props.daily.temperature_2m_max[0]) + '°'
    : '-',
)

const minTemp = computed(() =>
  props.daily.temperature_2m_min?.[0] !== undefined
    ? Math.round(props.daily.temperature_2m_min[0]) + '°'
    : '-',
)
</script>
