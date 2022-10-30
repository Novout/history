<template>
  <p v-if="value >= 0.0" class="text-green-400 text-base">+{{ value.toFixed(0) }}</p>
  <p v-else class="text-red-600 text-base">{{ value.toFixed(0) }}</p>
</template>

<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>