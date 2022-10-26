<template>
  <GameHUD />
  <GameTerrainInfo v-if="APP.absolute.terrainInfo" />
</template>

<script setup lang="ts">
import { useApplicationStore } from '../store/application';

const APP = useApplicationStore()
</script>