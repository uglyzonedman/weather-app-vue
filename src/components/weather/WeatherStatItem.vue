<template>
  <div
    class="bg-white/5 rounded-lg p-4 border border-white/10 text-center hover:border-white/20 hover:bg-white/8 transition-all duration-200"
  >
    <div class="text-gray-500 text-sm mb-2">
      {{ label }}
    </div>
    <div class="text-2xl font-medium text-white">
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>
