<template>
  <div v-if="BATTLE.getPlayerBattles.length > 0" class="p-10 z-max max-h-100 select-none overflow-y-auto w-35 gap-2 fixed top-1/2 transform -translate-y-1/2 text-white left-0 z-max bg-blur flex flex-col rounded-t-md">
    <div @click="onOpenBattle(battle.terrain)" v-for="(battle, index) in BATTLE.getPlayerBattles" :key="index">
      <div class="flex flex-col gap-2 w-full">
        <div class="flex items-center gap-2">
          <IconAttacker v-if="APP.player?.name === battle.attacker" class="w-6 h-6" />
          <IconDefender v-else class="w-6 h-6" />
          <p class="font-bold">{{ battle.terrain }} - Rodada {{ battle.round }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { useApplicationStore } from '../../store/application';
import { useBattleStore } from '../../store/battle';

const BATTLE = useBattleStore()
const APP = useApplicationStore()

const onOpenBattle = async (id: number) => {
  APP.actives.terrain = id

  await nextTick

  APP.absolute.terrainInfo = true
}
</script>