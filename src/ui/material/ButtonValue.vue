<template>
  <div
    class="flex items-center bg-blur text-white cursor-pointer rounded-r-2xl w-45"
  >
    <button
      class="flex-1 text-white text-xl bg-transparent cursor-pointer border-none"
    >
      <slot />
    </button>
    <p
      class="border-l border-dark-50 rounded-r-xl bg-dark-100 h-max w-5 flex items-center justify-center text-xl p-1"
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    value: number
  }>()
</script>
