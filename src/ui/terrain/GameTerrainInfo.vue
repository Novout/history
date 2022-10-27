<template>
  <div class="flex items-center justify-center absolute top-0 left-0 z-max bg-dark bg-opacity-50 w-full h-screen shadow-xl">
    <div class="flex flex-col gap-5 w-80 h-3/4 overflow-y-auto bg-blur text-white shadow-xl p-5">
      <div class="flex w-full justify-between items-center mb-5">
        <H1>Terreno {{terrain.id}} - {{name.getTerrainTypeName(terrain.type)}}</H1>
      </div>
      <div class="flex flex-col w-full gap-2">
        <H2>Território</H2>
        <p v-if="terrain.owner">Dominado por: <b>{{ terrain.owner }}</b></p>
        <p>Produção: {{ terrain.resources.production }}</p>
        <p>Comida: {{ terrain.resources.food }}</p>
        <p v-if="OPTIONS.debug">Posição: {{ terrain.x }} - {{ terrain.y }}</p>
      </div>
      <div v-if="terrain.city" class="flex flex-col w-full gap-2">
        <H2>{{ terrain.city.name }} {{terrain.city.structure.townHall }}</H2>
        <p>Tamanho: {{ terrain.city.structure.townHall }}</p>
        <p>Produção por Turno: {{ terrain.city.resources.production + terrain.resources.production }}</p>
        <p>Comida por Turno: {{ terrain.city.resources.food + terrain.resources.food}}</p>
        <p>Ciência por Turno: {{ terrain.city.resources.science * 2 }}</p>
        <p>Capacidade Militar: {{ terrain.city.structure.militaryAcademy * 5 }}</p>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <H2>Ações</H2>
        <div :class="[player.isAdjacentTerritory(APP.player, terrain) ? '' : 'pointer-events-none opacity-50']" class="flex items-center gap-2 mt-5" v-if="!terrain.city && !terrain.owner && terrain.isAttachable">
          <Button @click="APP.annex(APP.player)">Anexar</Button>
          <Influence>{{ COST_DEFINE.COLONIZE_ANNEX * (player.getTerritories(APP.player).length + 1) }}</Influence>
        </div>
        <div class="flex items-center gap-2 mt-5" v-else-if="!terrain.city && terrain.owner === APP.player?.name && terrain.isColonizable">
          <Button @click="APP.createCity(APP.player, APP.actives.terrain)">Colonizar</Button>
          <Food>{{ COST_DEFINE.COLONIZE_FOOD }}</Food>
          <Production>{{ COST_DEFINE.COLONIZE_PRODUCTION }}</Production>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-80 h-3/4 overflow-y-auto bg-blur text-white shadow-xl p-5">
      <div class="flex w-full justify-between items-center">
        <H2>Construção</H2>
        <Icon @click="APP.absolute.terrainInfo = false">
          <IconClose class="w-8 h-8 cursor-pointer" />
        </Icon>
      </div>
      <div class="flex flex-col gap-2 w-full" v-if="terrain.city && terrain.owner === APP.player?.name">
        <div :class="[terrain.city.structure.townHall === 5 ? 'pointer-events-none opacity-50' : '']" class="flex items-center gap-2 mt-5">
          <Button @click="APP.upgradeCity(APP.player)">Prefeitura lvl {{ terrain.city.structure.townHall }}</Button>
          <Food>{{ COST_DEFINE.CITY_UPGRADE_FOOD[terrain.city.structure.townHall] }}</Food>
          <Production>{{ COST_DEFINE.CITY_UPGRADE_PRODUCTION[terrain.city.structure.townHall] }}</Production>
        </div>
        <div :class="[terrain.city.structure.townHall <= terrain.city.structure.wall || terrain.city.structure.wall === 5 ? 'pointer-events-none opacity-50' : '']" class="flex items-center gap-2 mt-5">
          <Button @click="APP.upgradeWall(APP.player)">Muralha lvl {{ terrain.city.structure.wall }}</Button>
          <Food>{{ COST_DEFINE.CITY_WALL_UPGRADE_FOOD[terrain.city.structure.wall] }}</Food>
          <Production>{{ COST_DEFINE.CITY_WALL_UPGRADE_PRODUCTION[terrain.city.structure.wall] }}</Production>
        </div>
        <div :class="[terrain.city.structure.townHall <= terrain.city.structure.militaryAcademy || terrain.city.structure.militaryAcademy === 5 ? 'pointer-events-none opacity-50' : '']" class="flex items-center gap-2 mt-5">
          <Button @click="APP.upgradeMilitarAcademy(APP.player)">Militar lvl {{ terrain.city.structure.militaryAcademy }}</Button>
          <Food>{{ COST_DEFINE.CITY_MILITAR_ACADEMY_UPGRADE_FOOD[terrain.city.structure.militaryAcademy] }}</Food>
          <Production>{{ COST_DEFINE.CITY_MILITAR_ACADEMY_UPGRADE_PRODUCTION[terrain.city.structure.militaryAcademy] }}</Production>
        </div>
      </div>
      <div class="flex flex-col gap-1 w-full" v-else-if="!terrain.city && terrain.owner === APP.player?.name && !terrain.structure">
        <div v-if="FARM_DEFINE.isBuildable.includes(terrain.type)" class="flex items-center gap-2 mt-5">
          <IconFarm class="w-8 h-8" />
          <Button @click="APP.setStructure(APP.player, 'farm', terrain.type)">Fazenda</Button>
          <Food>{{ COST_DEFINE.CONSTRUCTION_FARM_UPGRADE_FOOD[0]}} </Food>
          <Production>{{ COST_DEFINE.CONSTRUCTION_FARM_UPGRADE_PRODUCTION[0]}}</Production>
        </div>
        <div v-if="LUMBER_DEFINE.isBuildable.includes(terrain.type)" class="flex items-center gap-2 mt-5">
          <IconLumber class="w-8 h-8" />
          <Button @click="APP.setStructure(APP.player, 'lumber', terrain.type)">Madeireira</Button>
          <Food>{{ COST_DEFINE.CONSTRUCTION_LUMBER_UPGRADE_FOOD[0]}} </Food>
          <Production>{{ COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_PRODUCTION[0]}}</Production>
        </div>
        <div v-if="ACADEMIC_CENTER_DEFINE.isBuildable.includes(terrain.type)" class="flex items-center gap-2 mt-5">
          <IconAcademicCenter class="w-8 h-8" />
          <Button @click="APP.setStructure(APP.player, 'academic_center', terrain.type)">Centro Acadêmico</Button>
          <Food>{{ COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_FOOD[0]}} </Food>
          <Production>{{ COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_PRODUCTION[0]}}</Production>
        </div>
      </div>
      <div class="flex flex-col gap-1 w-full" v-else-if="!terrain.city && terrain.owner === APP.player?.name && terrain.structure">
        <div v-if="terrain.structure === 'farm'" class="flex items-center justify-between gap-2 mt-5 border-2 border-light-50 rounded-lg shadow p-5">
          <div>
            <IconFarm class="w-20 h-20" />
          </div>
          <div class="flex flex-col gap-2">
            <H2>Produção</H2>
            <Food>{{ FARM_DEFINE.resources.food[0] }} </Food>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useApplicationStore } from "../../store/application";
import { useOptionsState } from "../../store/options";
import { usePlayer } from "../../use/player";
import COST_DEFINE from '../../defines/cost.json'
import FARM_DEFINE from '../../defines/buildings/farm.json'
import LUMBER_DEFINE from '../../defines/buildings/lumber.json'
import ACADEMIC_CENTER_DEFINE from '../../defines/buildings/academic_center.json'
import { useName } from "../../use/name";

const APP = useApplicationStore()
const OPTIONS = useOptionsState()

const player = usePlayer()
const name = useName()

const terrain = computed(() => APP.terrain[APP.actives.terrain])
</script>