<template>
  <div class="flex flex-col items-center justify-center">
    <p>{{ value }}</p>
    <div class="bg-white h-0.5 w-full" />
    <p>{{ max }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    value: number
    max: number
  }>()
</script>
