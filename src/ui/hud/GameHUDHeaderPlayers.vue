<template>
  <header class="gap-5 cursor-pointer fixed text-white top-0 left-15 flex z-max items-center text-xl">
    <div :style="{ borderColor: APP.player?.color[0] }" class="p-1 border-b-10 rounded-b-md shadow-lg bg-blur mr-10">
      <p class="text-base font-bold">{{ APP.player?.name }}</p>
    </div>
    <div :style="{ borderColor: ia.color[0] }" v-for="(ia, index) in APP.IA" :key="index" class="p-1 border-b-5 rounded-b-md shadow-lg bg-blur">
      <p class="text-base font-bold">{{ ia.name }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useApplicationStore } from '../../store/application';

const APP = useApplicationStore()
</script>