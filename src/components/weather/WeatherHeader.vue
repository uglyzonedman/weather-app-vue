<template>
  <div class="flex items-start justify-between mb-8">
    <div>
      <h3 class="text-3xl font-semibold text-white mb-1">
        {{ city.name }}
      </h3>
      <span class="text-gray-400 text-sm">
        {{ city.country }}
      </span>
    </div>

    <div class="text-right">
      <div class="text-gray-400 text-sm">
        {{ getDate }}
      </div>
      <div class="text-gray-500 text-xs mt-1">Обновлено {{ getTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  city: {
    name: string
    country: string
  }
  time: string
}>()

const date = new Date(props.time)

const getDate = computed(() =>
  date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  }),
)

const getTime = computed(() =>
  date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }),
)
</script>
