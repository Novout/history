<template>
  <button
    :disabled="disabled"
    :style="{ fontFamily: 'Poppins' }"
    class="flex-1 cursor-pointer border-none !bg-blur-button text-white p-2 rounded-lg shadow-lg font-bold text-lg"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    disabled?: boolean
  }>()
</script>
