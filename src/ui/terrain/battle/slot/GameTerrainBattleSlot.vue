<template>
  <div v-if="max > 0" class="history-line-item">
    <slot />
  </div>
  <div v-else class="history-line-item-empty" />
</template>

<script setup lang="ts">
  defineProps<{
    max: number
  }>()
</script>
