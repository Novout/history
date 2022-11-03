<template>
  <Modal>
    <div
      v-provider-close
      :esc="() => (APP.absolute.terrainInfo = false)"
      class="flex flex-col w-1/3 max-h-screen md:max-h-3/4 bg-blur text-white p-5 rounded"
    >
      <div class="flex flex-col w-full gap-5">
        <H2>Atacante - {{ b.attacker.owner }}</H2>
        <GameTerrainBattleRow v-if="b.attacker.units!.dragon.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index: 0,
            lineType: 'extra',
            unitType: 'dragon',
            value: battle.splitUnitsByStack(b.attacker.units!.dragon.count, b.attacker.units!.dragon.stack)[0],
            stack: b.attacker.units!.dragon.stack
          }"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow v-if="b.attacker.units!.catapult.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index,
            lineType: 'destruction_line',
            unitType: 'catapult',
            stack: b.attacker.units!.catapult.stack,
            value
          }"
            v-for="(value, index) in battle.splitUnitsByStack(b.attacker.units!.catapult.count, b.attacker.units!.catapult.stack)"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow v-if="b.attacker.units!.archer.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index,
            lineType: 'back_line',
            unitType: 'archer',
            stack: b.attacker.units!.archer.stack,
            value
          }"
            v-for="(value, index) in battle.splitUnitsByStack(b.attacker.units!.archer.count, b.attacker.units!.archer.stack)"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow v-if="b.attacker.units!.spearman.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index,
            lineType: 'front_line',
            unitType: 'spearman',
            stack: b.attacker.units!.spearman.stack,
            value
          }"
            v-for="(value, index) in battle.splitUnitsByStack(b.attacker.units!.spearman.count, b.attacker.units!.spearman.stack)"
          />
        </GameTerrainBattleRow>
      </div>
      <div class="flex flex-col w-full gap-5">
        <H2>Defensor - {{ b.defender.owner }}</H2>
        <GameTerrainBattleRow
          v-if="b.defender.city && b.defender.city.structure.wall === 0"
        >
          <GameTerrainBattleSlotUnit
            v-for="(value, index) in [1, 1, 1]"
            :unit="{
              index,
              lineType: 'wall',
              unitType: 'barrier',
              stack: 1,
              value: value,
            }"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow
          v-else-if="b.defender.city && b.defender.city.structure.wall > 0"
        >
          <GameTerrainBattleSlotUnit
            v-for="(value, index) in [1, 1, 1]"
            :unit="{
              index,
              lineType: 'wall',
              unitType: 'wall',
              stack: 1,
              value: value,
            }"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow v-if="b.defender.units!.spearman.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index,
            lineType: 'front_line',
            unitType: 'spearman',
            stack: b.defender.units!.spearman.stack,
            value
          }"
            v-for="(value, index) in battle.splitUnitsByStack(b.defender.units!.spearman.count, b.defender.units!.spearman.stack)"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow v-if="b.defender.units!.archer.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index,
            lineType: 'back_line',
            unitType: 'archer',
            stack: b.defender.units!.archer.stack,
            value
          }"
            v-for="(value, index) in battle.splitUnitsByStack(b.defender.units!.archer.count, b.defender.units!.archer.stack)"
          />
        </GameTerrainBattleRow>
        <GameTerrainBattleRow v-if="b.defender.units!.dragon.count !== 0">
          <GameTerrainBattleSlotUnit
            :unit="{
            index: 0,
            lineType: 'extra',
            unitType: 'dragon',
            value: battle.splitUnitsByStack(b.defender.units!.dragon.count, b.defender.units!.dragon.stack)[0],
            stack: b.defender.units!.dragon.stack
          }"
          />
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

  const BATTLE = useBattleStore()
  const APP = useApplicationStore()

  const battle = useBattle()

  const b = computed(() => BATTLE.battles[APP.actives.battleClicked])
</script>
