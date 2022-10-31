<template>
  <div class="flex items-center justify-center absolute top-0 left-0 z-max bg-dark bg-opacity-50 w-full h-screen">
    <div v-provider-close :esc="() => APP.absolute.terrainInfo = false" class="flex w-auto max-h-screen md:max-h-3/4 bg-blur">
      <div class="flex flex-col gap-5 w-80 overflow-y-auto text-white shadow-xl p-5">
        <div class="flex w-full justify-between items-center mb-5">
          <H1>Terreno {{terrain.id}} - {{name.getTerrainTypeName(terrain.type)}}</H1>
        </div>
        <div class="flex flex-col w-full gap-2">
          <H2>Território</H2>
          <p class="text-lg" v-if="terrain.owner">Dominado por: <b>{{ terrain.owner }}</b></p>
          <p>Produção: {{ terrain.resources.production }}</p>
          <p>Comida: {{ terrain.resources.food }}</p>
          <p v-if="OPTIONS.debug">Posição: {{ terrain.x }} - {{ terrain.y }}</p>
        </div>
        <div v-if="terrain.city" class="flex flex-col w-full gap-2">
          <H2>{{ terrain.city.name }} {{terrain.city.structure.townHall }}</H2>
          <p>Produção por Turno: {{ terrain.city.resources.production + terrain.resources.production }}</p>
          <p>Comida por Turno: {{ terrain.city.resources.food + terrain.resources.food}}</p>
          <p>Ciência por Turno: {{ terrain.city.resources.science * 2 }}</p>
          <p>Capacidade Militar: {{ terrain.city.structure.militaryAcademy * 5 }}</p>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <H2>Ações</H2>
          <GameTerrainInfoActionContainer :class="[player.isAdjacentTerritory(APP.player, terrain) && (APP.player!.resources.influence >= COST_DEFINE.COLONIZE_ANNEX * (usePlayer().getTerritories(APP.player).length + 1)) ? '' : 'pointer-events-none opacity-50']" v-if="!terrain.city && !terrain.owner && terrain.isAttachable">
            <div class="flex gap-2 w-full">
              <Button @click="APP.annex(APP.player)">Anexar</Button>
              <Influence>{{ COST_DEFINE.COLONIZE_ANNEX * (player.getTerritories(APP.player).length + 1) }}</Influence>
            </div>
          </GameTerrainInfoActionContainer>
          <GameTerrainInfoActionContainer :class="[APP.player!.resources.food >= COST_DEFINE.COLONIZE_FOOD && APP.player!.resources.production >= COST_DEFINE.COLONIZE_PRODUCTION ? '' : 'pointer-events-none opacity-50']" v-else-if="!terrain.city && terrain.owner === APP.player?.name && terrain.isColonizable">
            <H3>Nova Cidade</H3>
            <div class="mt-5">
              <input class="bg-blur border-none p-2 text-white text-lg w-full" v-model="cityName" type="text" />
            </div>
            <div class="flex gap-5 justify-between w-full">
              <Button @click="APP.createCity(APP.player, APP.actives.terrain, false, cityName)">Colonizar</Button>
            <Food>{{ COST_DEFINE.COLONIZE_FOOD }}</Food>
            <Production>{{ COST_DEFINE.COLONIZE_PRODUCTION }}</Production>
            </div>
          </GameTerrainInfoActionContainer>
          <GameTerrainInfoActionContainer v-if="terrain.isAccessible && player.getPossibleUnitsMove(APP.player, terrain).length > 0">
            <H3>Mover Tropas</H3>
            <div class="flex items-center w-full justify-between p-2 gap-5" v-for="(tr, index) in player.getPossibleUnitsMove(APP.player, terrain)" :key="index">
              <p class="text-xl truncate">{{ tr.units?.squad }}</p>
              <Button @click="APP.moveSquad(tr, terrain)">Mover</Button>
            </div>
          </GameTerrainInfoActionContainer>
        </div>
      </div>
      <div class="flex flex-col gap-2 w-80 overflow-y-auto text-white shadow-xl p-5">
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
            <Button @click="APP.setStructure(APP.player, 'farm', terrain)">Fazenda</Button>
            <Food>{{ COST_DEFINE.CONSTRUCTION_FARM_UPGRADE_FOOD[0]}} </Food>
            <Production>{{ COST_DEFINE.CONSTRUCTION_FARM_UPGRADE_PRODUCTION[0]}}</Production>
          </div>
          <div v-if="LUMBER_DEFINE.isBuildable.includes(terrain.type)" class="flex items-center gap-2 mt-5">
            <IconLumber class="w-8 h-8" />
            <Button @click="APP.setStructure(APP.player, 'lumber', terrain)">Madeireira</Button>
            <Food>{{ COST_DEFINE.CONSTRUCTION_LUMBER_UPGRADE_FOOD[0]}} </Food>
            <Production>{{ COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_PRODUCTION[0]}}</Production>
          </div>
          <div v-if="ACADEMIC_CENTER_DEFINE.isBuildable.includes(terrain.type)" class="flex items-center gap-2 mt-5">
            <IconAcademicCenter class="w-8 h-8" />
            <Button @click="APP.setStructure(APP.player, 'academic_center', terrain)">Centro Acadêmico</Button>
            <Food>{{ COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_FOOD[0]}} </Food>
            <Production>{{ COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_PRODUCTION[0]}}</Production>
          </div>
        </div>
        <div class="flex flex-col gap-1 w-full" v-else-if="!terrain.city && terrain.owner === APP.player?.name && terrain.structure">
          <GameTerrainInfoStructureItem v-if="terrain.structure === 'farm'" :terrain="terrain" :define="FARM_DEFINE" />
          <GameTerrainInfoStructureItem v-if="terrain.structure === 'lumber'" :terrain="terrain" :define="LUMBER_DEFINE" />
          <GameTerrainInfoStructureItem v-if="terrain.structure === 'academic_center'" :terrain="terrain" :define="ACADEMIC_CENTER_DEFINE" />
        </div>
        <GameTerrainInfoUnits v-if="APP.player?.name === terrain.owner || terrain.units?.owner === APP.player?.name" :terrain="terrain" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useApplicationStore } from "../../store/application";
import { useOptionsState } from "../../store/options";
import { usePlayer } from "../../use/player";
import { useName } from "../../use/name";
import COST_DEFINE from '../../defines/cost.json'
import FARM_DEFINE from '../../defines/buildings/farm.json'
import LUMBER_DEFINE from '../../defines/buildings/lumber.json'
import ACADEMIC_CENTER_DEFINE from '../../defines/buildings/academic_center.json'
import { useDefines } from "../../use/defines";

const APP = useApplicationStore()
const OPTIONS = useOptionsState()

const player = usePlayer()
const name = useName()
const defines = useDefines()

const terrain = computed(() => APP.terrain[APP.actives.terrain])

const cityName = ref(defines.getRandomCityName())
</script>