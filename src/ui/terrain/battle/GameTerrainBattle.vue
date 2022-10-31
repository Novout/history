<template>
  <Modal>
    <div v-provider-close :esc="() => APP.absolute.terrainInfo = false" class="flex w-auto max-h-screen md:max-h-3/4 bg-blur"></div>
  </Modal>
</template>

<script setup lang="ts">
import { useApplicationStore } from '../../../store/application';

const APP = useApplicationStore()
</script>