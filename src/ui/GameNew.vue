<template>
  <div
    class="flex items-center justify-center absolute top-0 left-0 z-max bg-dark w-full h-screen bg-main"
  >
    <div
      class="flex gap-8 flex-col w-80 max-h-screen md:max-h-3/4 bg-blur text-white p-6 rounded-lg shadow-lg"
    >
      <H1>History - Novo Jogo</H1>
      <div class="flex flex-col w-full gap-2">
        <H2>Nome do Império</H2>
        <InputText v-model="OPTIONS.game.player.name" />
      </div>
      <div class="flex flex-col w-full gap-2">
        <H2>Cor do Império</H2>
        <InputColor v-model="OPTIONS.game.player.color" />
      </div>
      <div class="flex flex-col w-full gap-2">
        <H2>Nome da Capital</H2>
        <InputText v-model="OPTIONS.game.player.capital" />
      </div>
      <Button @click.prevent.stop="onClick">Iniciar Jogo</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useOptionsState } from '../store/options'
  import { useStart } from '../use/start'

  const OPTIONS = useOptionsState()

  const { create } = useStart()

  const onClick = () => {
    if (
      !OPTIONS.game.player.name ||
      !OPTIONS.game.player.color ||
      !OPTIONS.game.player.capital
    )
      return

    create()
  }
</script>

<style>
  .bg-main {
    background-image: url('@/assets/bg.jpg');
  }
</style>
