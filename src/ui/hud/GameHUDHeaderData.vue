<template>
  <header class="p-2 select-none gap-8 fixed text-white top-0 right-10 flex z-max bg-blur flex items-center text-xl rounded-b-md">
    <Influence>{{APP.player?.resources.influence.toFixed(0)}}<Counter :value="computed(() => player.getInfluence(APP.player)).value" /></Influence>
    <City>{{ player.getCityTerritories(APP.player).length }}/{{ APP.player?.cityLimit}}</City>
    <Militar>{{ computed(() => player.getAllUnitsCount(APP.player))  }}/{{ computed(() => player.getMilitaryCapacity(APP.player)) }}</Militar>
    <Science>{{APP.player?.resources.science.toFixed(0)}}<Counter :value="computed(() => player.getScience(APP.player)).value" /></Science>
    <Food>{{APP.player?.resources.food.toFixed(0)}}<Counter :value="computed(() => player.getFood(APP.player)).value" /></Food>
    <Production>{{APP.player?.resources.production.toFixed(0)}}<Counter :value="computed(() => player.getProduction(APP.player)).value" /></Production>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApplicationStore } from '../../store/application';
import { usePlayer } from '../../use/player';

const player = usePlayer()

const APP = useApplicationStore()
</script>