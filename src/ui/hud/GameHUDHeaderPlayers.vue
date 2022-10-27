<template>
  <header class="gap-5 cursor-pointer fixed text-white top-0 left-15 flex z-max items-center text-xl">
    <div :style="{ borderColor: APP.player?.color[0] }" class="p-1 border-b-10 rounded-b-md shadow-lg bg-blur mr-10">
      <p class="text-base font-bold select-none">{{ APP.player?.name }}</p>
    </div>
    <div v-for="(ia, index) in APP.IA" :key="index" class="shadow-lg bg-blur">
      <p :style="{ borderColor: ia.color[0] }" v-if="APP.player?.knownPlayers.includes(ia.name)" class="p-1 border-b-5 rounded-b-md text-base font-bold select-none">{{ ia.name }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useApplicationStore } from '../../store/application';

const APP = useApplicationStore()
</script>