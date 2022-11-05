<template>
  <Modal>
    <div
      v-provider-close
      :esc="() => (APP.absolute.battleWindow = false)"
      class="flex flex-col w-1/3 max-h-screen md:max-h-3/4 bg-blur text-white p-10 rounded-lg"
    >
      <div class="flex items-center justify-between mb-10">
        <H1>Batalha - Rodada {{ b.round?.value || 0 }}</H1>
        <div @click="APP.absolute.battleWindow = false">
          <IconClose class="w-8 h-8 text-white cursor-pointer" />
        </div>
      </div>
      <div class="flex flex-col w-full gap-5">
        <H2>Atacante - {{ b.attacker.owner }}</H2>
        <GameTerrainBattleRow
          v-for="([unit, line, count], index) in b.round?.attacker"
          :key="index"
        >
          <div class="flex items-center gap-2" v-if="count > 0">
            <GameTerrainBattleSlotUnit
              v-for="(value, i) in battle.splitUnitsByStack(
                count,
                battle.getStack(unit)
              )"
              :key="i"
              :unit="{
                index: i,
                lineType: line,
                unitType: unit,
                value,
                stack: battle.getStack(unit),
              }"
            />
          </div>
        </GameTerrainBattleRow>
      </div>
      <div class="flex flex-col w-full gap-5">
        <H2>Defensor - {{ b.defender.owner }}</H2>
        <GameTerrainBattleRow
          v-for="([unit, line, count], index) in b.round?.defender"
          :key="index"
        >
          <div class="flex items-center gap-2" v-if="count > 0">
            <GameTerrainBattleSlotUnit
              v-for="(value, i) in battle.splitUnitsByStack(
                count,
                battle.getStack(unit)
              )"
              :key="i"
              :unit="{
                index: i,
                lineType: line,
                unitType: unit,
                value,
                stack: battle.getStack(unit),
              }"
            />
          </div>
        </GameTerrainBattleRow>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useApplicationStore } from '../../../store/application'
  import { useBattleStore } from '../../../store/battle'
  import { useBattle } from '../../../use/battle'
  import { useDefines } from '../../../use/defines'

  const BATTLE = useBattleStore()
  const APP = useApplicationStore()

  const battle = useBattle()
  const defines = useDefines()

  const b = computed(() => BATTLE.battles[APP.actives.battleClicked])
</script>
