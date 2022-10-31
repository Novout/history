<template>
  <GameHUD />
  <GameTerrainInfo v-if="APP.absolute.terrainInfo" />
  <GameTerrainBattle v-else-if="APP.absolute.battleWindow" />
</template>

<script setup lang="ts">
  import { useApplicationStore } from '../store/application'

  const APP = useApplicationStore()
</script>
