<template>
  <div
    class="p-10 h-100 select-none overflow-y-auto w-35 gap-2 fixed top-1/2 transform -translate-y-1/2 text-white right-0 z-max bg-blur flex flex-col rounded-t-md"
  >
    <H2>Cidades</H2>
    <div
      v-for="(terrain, index) in player.getCityTerritories(APP.player)"
      :key="index"
    >
      <div
        @click="onTerrainInfo(terrain.id)"
        class="flex w-full gap-2 items-center cursor-pointer"
      >
        <div>
          <IconCity class="w-5 h-5" />
        </div>
        <H3 class="truncate"
          >{{ terrain.city?.name }} {{ terrain.city?.structure.townHall }}</H3
        >
      </div>
    </div>
    <H2 class="mt-3">Tropas</H2>
    <div
      class="cursor-pointer"
      v-for="(terrain, index) in player.getUnitsTerritories(APP.player)"
      :key="index"
    >
      <div
        @click="onTerrainInfo(terrain.id)"
        class="flex flex-col w-full pt-3 my-1"
      >
        <div class="flex items-center gap-2">
          <div>
            <IconMilitar class="w-7 h-7" />
          </div>
          <H3 class="truncate"
            >{{ terrain.units?.squad }} - {{ terrain.id }}</H3
          >
        </div>
        <div>
          <div class="flex flex-wrap justify-between gap-2 w-full">
            <div class="flex gap-2 items-center">
              <IconUnitSpear class="w-5 h-5" />
              <H3>{{ terrain.units?.spearman.count }}</H3>
            </div>
            <div class="flex gap-2 items-center">
              <IconUnitArcher class="w-5 h-5" />
              <H3>{{ terrain.units?.archer.count }}</H3>
            </div>
          </div>
          <div class="flex flex-wrap justify-between gap-2 w-full">
            <div class="flex gap-2 items-center">
              <IconUnitCatapult class="w-5 h-5" />
              <H3>{{ terrain.units?.catapult.count }}</H3>
            </div>
            <div class="flex gap-2 items-center">
              <IconUnitDragon class="w-5 h-5" />
              <H3>{{ terrain.units?.dragon.count }}</H3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { useApplicationStore } from '../../store/application'
  import { useCycleState } from '../../store/cycle'
  import { useGame } from '../../use/game'
  import { usePlayer } from '../../use/player'

  const CYCLE = useCycleState()
  const APP = useApplicationStore()

  const game = useGame()
  const player = usePlayer()

  const onTerrainInfo = async (index: number) => {
    APP.actives.terrain = index

    await nextTick

    APP.absolute.terrainInfo = true
  }
</script>
