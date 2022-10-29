<template>
  <div class="flex items-center justify-between gap-2 mt-5 border-2 border-light-50 rounded-lg shadow p-5">
    <div>
      <IconFarm v-if="terrain.structure === 'farm'" class="w-20 h-20" />
      <IconLumber v-if="terrain.structure === 'lumber'" class="w-20 h-20" />
      <IconAcademicCenter v-if="terrain.structure === 'academic_center'" class="w-20 h-20" />
    </div>
    <div class="flex flex-col gap-2">
      <H2 v-if="define.resources">Produção</H2>
      <Food v-if="define.resources?.food">{{ define.resources.food[0] }}</Food>
      <Production v-if="define.resources?.production">{{ define.resources.production[0] }}</Production>
      <Influence v-if="define.resources?.influence">{{ define.resources.influence[0] }}</Influence>
      <Science v-if="define.resources?.science">{{ define.resources.science[0] }}</Science>
      <H2 v-if="define.multipliers">Multiplicador</H2>
      <Food v-if="define.multipliers?.food">{{ String(define.multipliers.food[0]).substring(2) }}0%</Food>
      <Production v-if="define.multipliers?.production">{{ String(define.multipliers.production[0]).substring(2) }}0%</Production>
      <Influence v-if="define.multipliers?.influence">{{ String(define.multipliers.influence[0]).substring(2) }}0%</Influence>
      <Science v-if="define.multipliers?.science">{{ String(define.multipliers.science[0]).substring(2) }}0%</Science>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HistoryTerrain } from '../../../types/map';

defineProps<{
  terrain: HistoryTerrain,
  define: Record<string, any>
}>()
</script>