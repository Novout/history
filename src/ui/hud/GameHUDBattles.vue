<template>
  <div
    v-if="BATTLE.getPlayerBattles.length > 0"
    class="p-10 z-max max-h-100 rounded-r-lg select-none overflow-y-auto w-35 gap-2 fixed top-1/2 transform -translate-y-1/2 text-white left-0 z-max bg-blur flex flex-col rounded-t-md"
  >
    <H2>Batalhas</H2>
    <div
      @click="onOpenBattle(index)"
      v-for="(battle, index) in BATTLE.getPlayerBattles"
      :key="index"
      class="cursor-pointer"
    >
      <div class="flex items-start gap-2">
        <div>
          <IconAttacker
            v-if="APP.player?.name === battle.attacker.owner"
            class="w-6 h-6"
          />
          <IconDefender v-else class="w-6 h-6" />
        </div>
        <p class="font-bold truncate">
          Batalha {{ index }} - {{ battle.round?.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { useApplicationStore } from '../../store/application'
  import { useBattleStore } from '../../store/battle'

  const BATTLE = useBattleStore()
  const APP = useApplicationStore()

  const onOpenBattle = async (id: number) => {
    APP.actives.terrain = id

    await nextTick

    APP.absolute.battleWindow = true
  }
</script>
