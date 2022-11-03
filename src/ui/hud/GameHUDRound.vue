<template>
  <div
    class="p-5 gap-5 fixed text-white bottom-0 right-20 z-max bg-blur flex flex-col items-center rounded-t-md"
  >
    <p class="font-bold text-lg select-none">Rodada {{ CYCLE.round }}</p>
    <Icon @click="game.next()">
      <IconNext class="w-10 h-10" />
    </Icon>
  </div>
</template>

<script setup lang="ts">
  import { useCycleState } from '../../store/cycle'
  import { useGame } from '../../use/game'

  const game = useGame()

  const CYCLE = useCycleState()
</script>
