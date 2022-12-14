<template>
  <div class="flex flex-col w-full gap-2">
    <div class="mt-2" />
    <H2 v-if="terrain.units"
      >Tropas <span class="border-b">{{ terrain.units?.squad }}</span></H2
    >
    <p v-if="terrain.units">
      Controlado por: <b>{{ terrain.units?.owner }}</b>
    </p>
    <div>
      <div v-if="terrain.units?.squad" class="">
        <div class="flex gap-2 items-center">
          <IconUnitSpear class="w-5 h-5" />
          <p class="text-lg">Lanceiro</p>
          <p>{{ terrain.units.spearman.count }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <IconUnitArcher class="w-5 h-5" />
          <p class="text-lg">Arqueiro</p>
          <p>{{ terrain.units.archer.count }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <IconUnitCatapult class="w-5 h-5" />
          <p class="text-lg">Catapulta</p>
          <p>{{ terrain.units.catapult.count }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <IconUnitDragon class="w-5 h-5" />
          <p class="text-lg">Dragão</p>
          <p>{{ terrain.units.dragon.count }}</p>
        </div>
      </div>
    </div>
    <div
      v-if="terrain.city && terrain.owner === APP.player?.name"
      class="flex flex-col gap-5 w-auto border border-dark-100 shadow-lg p-5 rounded-lg bg-dark-800"
    >
      <H2 class="mb-2">Criar Tropas</H2>
      <div v-if="!terrain.units?.squad" class="flex gap-2 w-full items-center">
        <input
          v-model="name"
          type="text"
          class="bg-blur h-8 w-40 text-white text-lg border-none"
        />
        <Button
          @click="APP.createSquad(APP.player, terrain, name)"
          class="flex-1"
          >Criar</Button
        >
      </div>
      <div v-if="terrain.units?.squad">
        <div class="flex gap-2 items-center">
          <IconUnitSpear class="w-7 h-7" />
          <input
            :min="0"
            class="bg-transparent border-transparent w-10 text-white text-xl"
            v-model="recruit.spearman"
            type="number"
          />
        </div>
        <div class="flex gap-2 items-center">
          <IconUnitArcher class="w-7 h-7" />
          <input
            :min="0"
            class="bg-transparent border-transparent w-10 text-white text-xl"
            v-model="recruit.archer"
            type="number"
          />
        </div>
        <div class="flex gap-2 items-center">
          <IconUnitCatapult class="w-7 h-7" />
          <input
            :min="0"
            class="bg-transparent border-transparent w-10 text-white text-xl"
            v-model="recruit.catapult"
            type="number"
          />
        </div>
        <div class="flex gap-2 items-center">
          <IconUnitDragon class="w-7 h-7" />
          <input
            :min="0"
            class="bg-transparent border-transparent w-10 text-white text-xl"
            v-model="recruit.dragon"
            type="number"
          />
        </div>
      </div>
      <p>
        Custo Base:
        <Resources
          :resources="{
            food: player.getUnitsCostInBaseResources(recruit, 'food'),
            production: player.getUnitsCostInBaseResources(
              recruit,
              'production'
            ),
            science: player.getUnitsCostInBaseResources(recruit, 'science'),
            influence: player.getUnitsCostInBaseResources(recruit, 'influence'),
          }"
        />
      </p>
      <p>
        Manutenção:
        <Resources
          :resources="{
            food: player.getUnitsMaintenanceInBaseResources(recruit, 'food'),
            production: player.getUnitsMaintenanceInBaseResources(
              recruit,
              'production'
            ),
            science: player.getUnitsMaintenanceInBaseResources(
              recruit,
              'science'
            ),
            influence: player.getUnitsMaintenanceInBaseResources(
              recruit,
              'influence'
            ),
          }"
        />
      </p>
      <Button v-if="terrain.units?.squad" @click="onRecruit">Recrutar</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { HistoryTerrain } from '../../../types/map'
  import { useApplicationStore } from '../../../store/application'
  import { ref, reactive } from 'vue'
  import { useDefines } from '../../../use/defines'
  import { usePlayer } from '../../../use/player'
  import { HistoryUnitType } from '../../../types/units'

  const APP = useApplicationStore()

  const defines = useDefines()
  const player = usePlayer()

  const name = ref(defines.getRandomSquadName())

  const recruit = reactive({
    spearman: 0,
    archer: 0,
    catapult: 0,
    dragon: 0,
  } as Record<HistoryUnitType, number>)

  const props = defineProps<{
    terrain: HistoryTerrain
  }>()

  const onRecruit = () => {
    APP.recruitUnits(APP.player, props.terrain, recruit)

    recruit.spearman = 0
    recruit.archer = 0
    recruit.catapult = 0
    recruit.dragon = 0
  }
</script>
