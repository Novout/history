<template>
  <header class="gap-5 cursor-pointer fixed text-white top-0 left-15 flex z-max items-center text-xl">
    <div v-for="(ia, index) in APP.IA" :key="index" class="p-1 rounded-b-md shadow-lg bg-blur">
      <p class="text-base font-bold">{{ ia.name }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useApplicationStore } from '../../store/application';

const APP = useApplicationStore()
</script>