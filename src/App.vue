<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useStart } from './use/start';

const start = useStart()

onMounted(() => {
  start.create()
})

onBeforeUnmount(() => {
  start.destroy()
})
</script>

<template>
  <main class="h-screen w-full overflow-hidden" id="game" />
  <GameProvider />
</template>