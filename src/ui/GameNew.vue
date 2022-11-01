<template>
  <div
    class="flex items-center justify-center absolute top-0 left-0 z-max bg-dark w-full h-screen bg-main"
  >
    <div
      class="flex gap-10 max-h-screen md:max-h-3/4 p-6 rounded-xl shadow-xl bg-blur"
    >
      <div class="flex justify-between gap-8 flex-col w-80 text-white">
        <H1>Jogador</H1>
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
      </div>
      <div class="flex justify-between gap-8 flex-col w-80 text-white">
        <H1>Mapa</H1>
        <div class="flex flex-col w-full gap-2">
          <H2>Tamanho do Mapa</H2>
          <select
            class="text-xl bg-blur border border-none rounded p-0.5 text-white"
            v-model="OPTIONS.map.size"
          >
            <option value="small">Pequeno</option>
            <option value="medium">Médio</option>
            <option value="large">Grande</option>
          </select>
        </div>
        <div class="flex flex-col w-full gap-2">
          <H2>Bioma</H2>
          <select
            class="text-xl bg-blur border border-none p-0.5 rounded text-white"
            v-model="OPTIONS.map.type"
          >
            <option value="pangea">Pangeia</option>
          </select>
        </div>
        <div class="flex flex-col w-full gap-2">
          <H2>Impérios</H2>
          <input
            class="bg-blur border-transparent w-10 p-1 text-lg text-white"
            type="number"
            :min="2"
            :max="15"
            v-model="OPTIONS.game.playersCount"
          />
        </div>
        <div class="flex flex-col w-full gap-2">
          <H2>Bárbaros</H2>
          <input
            class="bg-blur border-transparent w-10 p-1 text-lg text-white"
            type="number"
            :min="0"
            :max="10"
            v-model="OPTIONS.game.barbarians"
          />
        </div>
        <Button @click.prevent.stop="onClick">Iniciar Jogo</Button>
      </div>
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
