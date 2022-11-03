<template>
  <GameTerrainBattleSlot v-if="unit.index < 3" :max="unit.stack">
    <div>
      <IconUnitWall v-if="unit.unitType === 'wall'" class="history-line-icon" />
      <IconUnitBarrier
        v-else-if="unit.unitType === 'barrier'"
        class="history-line-icon"
      />
      <IconUnitSpear
        v-else-if="unit.unitType === 'spearman'"
        class="history-line-icon"
      />
      <IconUnitArcher
        v-else-if="unit.unitType === 'archer'"
        class="history-line-icon"
      />
      <IconUnitCatapult
        v-else-if="unit.unitType === 'catapult'"
        class="history-line-icon"
      />
      <IconUnitDragon
        v-else-if="unit.unitType === 'dragon'"
        class="history-line-icon"
      />
    </div>
    <GameTerrainBattleCounter :max="unit.stack" :value="unit.value" />
  </GameTerrainBattleSlot>
</template>

<script setup lang="ts">
  import { HistoryBattleSlotUnit } from '../../../../types/battle'

  defineProps<{
    unit: HistoryBattleSlotUnit
  }>()
</script>
