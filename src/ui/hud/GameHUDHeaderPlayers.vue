<template>
  <header
    class="gap-5 cursor-pointer fixed text-white top-0 left-15 flex z-max items-start text-xl select-none"
  >
    <div
      :style="{ borderColor: APP.player?.color }"
      class="p-2 border-b-10 rounded-b-md shadow-lg bg-blur mr-10 w-18"
    >
      <p class="text-base font-bold select-none truncate">
        {{ APP.player?.name }}
      </p>
      <div class="flex items-center justify-between">
        <IconEconomic class="w-6 h-6" />
        <p>{{ player.getEconomicPower(APP.player) }}</p>
      </div>
      <div class="flex items-center justify-between">
        <IconMilitaryPower class="w-6 h-6" />
        <p>{{ player.getMilitaryPower(APP.player) }}</p>
      </div>
    </div>
    <div
      :style="{ borderColor: ia.color }"
      v-for="(ia, index) in APP.IA"
      :key="index"
      :class="[APP.player?.players.known.includes(ia.name) ? 'p-2' : '']"
    >
      <div
        class="shadow-lg bg-blur border-b-5 rounded-b-md w-18"
        v-if="ia.isAlive"
      >
        <p
          v-if="APP.player?.players.known.includes(ia.name)"
          class="text-base font-bold select-none truncate"
        >
          {{ ia.name }}
        </p>
        <div
          v-if="APP.player?.players.known.includes(ia.name)"
          class="flex text-base items-center justify-between"
        >
          <IconEconomic class="w-5 h-5" />
          <p>{{ player.getEconomicPower(ia) }}</p>
        </div>
        <div
          v-if="APP.player?.players.known.includes(ia.name)"
          class="flex text-base items-center justify-between"
        >
          <IconMilitaryPower class="w-5 h-5" />
          <p>{{ player.getMilitaryPower(ia) }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useApplicationStore } from '../../store/application'
  import { usePlayer } from '../../use/player'

  const APP = useApplicationStore()

  const player = usePlayer()
</script>
