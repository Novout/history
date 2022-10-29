<template>
  <header class="p-2 select-none gap-8 fixed text-white top-0 right-10 flex z-max bg-blur flex items-center text-xl rounded-b-md">
    <Influence>{{APP.player?.resources.influence.toFixed(0)}}<p class="text-green-400 text-base">+{{ computed(() => player.getInfluence(APP.player)).value.toFixed(0) }}</p></Influence>
    <City>{{ player.getCityTerritories(APP.player).length }}/{{ APP.player?.cityLimit}}</City>
    <Militar>0/{{ computed(() => player.getMilitaryCapacity(APP.player)) }}</Militar>
    <Science>{{APP.player?.resources.science.toFixed(0)}}<p class="text-green-400 text-base">+{{ computed(() => player.getScience(APP.player)).value.toFixed(0) }}</p></Science>
    <Food>{{APP.player?.resources.food.toFixed(0)}}<p class="text-green-400 text-base">+{{ computed(() => player.getFood(APP.player)).value.toFixed(0) }}</p></Food>
    <Production>{{APP.player?.resources.production.toFixed(0)}}<p class="text-green-400 text-base">+{{ computed(() => player.getProduction(APP.player)).value.toFixed(0) }}</p></Production>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApplicationStore } from '../../store/application';
import { usePlayer } from '../../use/player';

const player = usePlayer()

const APP = useApplicationStore()
</script>