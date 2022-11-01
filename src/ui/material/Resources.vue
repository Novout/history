<template>
  <div class="flex justify-between items-center gap-2">
    <Food>{{ resources.food.toFixed(1) }}</Food>
    <Production>{{ resources.production.toFixed(1) }}</Production>
    <Influence>{{ resources.influence.toFixed(1) }}</Influence>
    <Science>{{ resources.science.toFixed(1) }}</Science>
  </div>
</template>

<script setup lang="ts">
import { HistoryResourcesBase } from '../../types/map';

defineProps<{
  resources: HistoryResourcesBase
}>()
</script>