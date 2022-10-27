<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useStart } from './use/start';
import { useCycleState } from './store/cycle'

const CYCLE = useCycleState()

const { destroy } = useStart()

onBeforeUnmount(() => {
  destroy()
})
</script>

<template>
  <main class="h-screen w-full overflow-hidden" id="game" />
  <GameNew v-if="!CYCLE.started" />
  <GameProvider v-else />
</template>