<template>
  <div class="flex gap-3 relative">
    <input
      v-model="props.searchCity"
      type="text"
      placeholder="Поиск города"
      @keyup.enter="() => props.getWeather(props.selectedCity)"
      class="flex-1 bg-white/5 border border-white/10 rounded-lg px-5 py-3 text-white text-base placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-200"
    />
    <button
      @click="props.requestGeolocation"
      :disabled="props.isLoading"
      class="bg-white/5 border border-white/10 rounded-lg px-6 py-3 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        v-if="!props.isLoading"
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
        v-if="props.isOpen && props.cityList.length !== 0"
        class="absolute top-full left-0 right-0 mt-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm overflow-hidden z-10"
      >
        <button
          v-for="(city, idx) of props.cityList"
          :key="idx"
          @click="props.selectCity(city)"
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
</template>

<script lang="ts" setup>
import type { Citylist, SelectedCity } from '../../types/weather'

const props = defineProps<{
  isOpen: boolean
  searchCity: string
  getWeather: (selectedCity: SelectedCity) => Promise<void>
  selectedCity: SelectedCity
  requestGeolocation: () => void
  isLoading: boolean
  cityList: Citylist[]
  selectCity: (city: Citylist) => Promise<void>
}>()
</script>
