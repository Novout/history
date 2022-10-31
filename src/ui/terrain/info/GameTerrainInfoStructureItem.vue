<template>
  <div class="flex items-center justify-between gap-5 mt-5 border-2 border-light-50 rounded-lg shadow p-5">
    <div>
      <IconFarm v-if="terrain.structure === 'farm'" class="w-20 h-20" />
      <IconLumber v-if="terrain.structure === 'lumber'" class="w-20 h-20" />
      <IconAcademicCenter v-if="terrain.structure === 'academic_center'" class="w-20 h-20" />
    </div>
    <div v-if="define.resources || define.multipliers" class="flex flex-col gap-2">
      <H2>Produção do Terreno</H2>
      <div class="flex flex-wrap gap-2 items-center mb-5">
        <Food>{{ terrain.resources.food + (define.resources?.food ? define.resources.food[0] : 0) }}</Food>
      <Production>{{ terrain.resources.production + (define.resources?.production ? define.resources.food[0] : 0) }}</Production>
      <Influence>{{ terrain.resources.influence + (define.resources?.influence ? define.resources.influence[0] : 0) }}</Influence>
      <Science>{{ terrain.resources.science + (define.resources?.science ? define.resources.science[0] : 0) }}</Science>
      </div>
      <H2 v-if="define.multipliers">Multiplicador Global</H2>
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