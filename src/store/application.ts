import { defineStore } from 'pinia'
import { HistoryPlayer } from '../types/player'
import { HistoryContainer } from '../types/sprite'
import { ApplicatonState } from '../types/stores'
import { useUtils } from '../use/utils'
import {
  HistoryTerrain,
  HistoryTerrainStructure,
  HistoryTerrainType,
  HistoryTerrainUnits,
} from '../types/map'
import { Text } from 'pixi.js'
import { usePlayer } from '../use/player'
import { useMap } from '../use/map'
import COST_DEFINE from '../defines/cost.json'
import { useDefines } from '../use/defines'
import { useOptionsState } from './options'
import { HistoryUnitType } from '../types/units'
import { useUnits } from '../use/units'
import { useToast } from 'vue-toastification'
import { nextTick } from 'vue'

export const useApplicationStore = defineStore('application', {
  state: (): ApplicatonState => ({
    context: null,
    viewport: null,
    terrainContainer: null,
    terrain: [],
    player: null,
    IA: [],
    actives: {
      terrain: -1,
      terrainClicked: false,
    },
    absolute: {
      battleWindow: false,
      battleInfo: false,
      terrainInfo: false,
    },
  }),
  actions: {
    setNewPlayer(player: HistoryPlayer) {
      const id = useUtils().getRandomTerrainID()

      this.setTerrainOwner(player, id, true)

      !player.isIA ? (this.player = player) : this.IA.push(player)

      this.createCity(player, id, true)
    },
    setTerrainOwner(
      player: HistoryPlayer,
      index: number,
      newPlayer: boolean = false
    ) {
      this.terrain[index].owner = player.name

      this.setTerrainColor(player, index, newPlayer)
    },
    setTerrainColor(
      player: HistoryPlayer,
      index: number,
      newPlayer: boolean = false
    ) {
      const target = this.terrainContainer?.children[index] as HistoryContainer

      // @ts-expect-error
      const tr = target.children.find((c) => c.type === 'territory')

      if (tr) target.removeChild(tr)

      // @ts-expect-error
      const fog = target.children.find((c) => c.type === 'fog')

      if (!fog && (!newPlayer || !player.isIA)) {
        const terrain = useMap().hexOwner({
          id: index,
          x: 0,
          y: 0,
          color: player.color[1],
        })

        target?.addChild(terrain)
      }
    },
    annex(player: HistoryPlayer | null, terrain?: HistoryTerrain) {
      if (!player) return

      const target = terrain ? terrain.id : this.actives.terrain

      if (!this.terrain[target]?.isAttachable) return

      if (
        this.terrain[target].units &&
        this.terrain[target].units?.owner !== player.name
      )
        return

      const influenceValue =
        COST_DEFINE.COLONIZE_ANNEX *
        (usePlayer().getTerritories(this.player).length + 1)

      if (
        player.resources.influence >= influenceValue &&
        !this.terrain[target].owner
      ) {
        this.setTerrainOwner(player, target)

        player.resources.influence -= influenceValue
      }

      this.absolute.terrainInfo = false
    },
    createCity(
      player: HistoryPlayer | null,
      index: number,
      newPlayer: boolean = false,
      cityName?: string
    ) {
      const terrain = this.terrain[index]

      if (
        !player ||
        !terrain?.isColonizable ||
        usePlayer().getCityTerritories(player).length >= player.cityLimit
      )
        return

      const food = COST_DEFINE.COLONIZE_FOOD
      const production = COST_DEFINE.COLONIZE_PRODUCTION

      if (
        (player.name === terrain.owner &&
          player.resources.food >= food &&
          player.resources.production >= production) ||
        newPlayer
      ) {
        if (!newPlayer) {
          player.resources.food -= food
          player.resources.production -= production
        }

        this.terrain[index].city = {
          name:
            cityName ||
            (newPlayer && !player.isIA
              ? useOptionsState().game.player.capital
              : useDefines().getRandomCityName()),
          resources: {
            influence: 0,
            food: 1,
            production: 1,
            science: 1,
            multipliers: {
              influence: 1.0,
              food: 1.0,
              production: 1.0,
              science: 1.0,
            },
          },
          structure: {
            townHall: 1,
            wall: 0,
            militaryAcademy: 1,
          },
        }

        const target = this.terrainContainer?.children[
          index
        ] as HistoryContainer

        // @ts-expect-error
        const fog = target.children.find((c) => c.type === 'fog')

        if (!fog && (!newPlayer || !player.isIA)) {
          this.setCitySprite(index, this.terrain[index])
        }
      }
    },
    setCitySprite(index: number, terrain: HistoryTerrain) {
      const target = this.terrainContainer?.children[index] as HistoryContainer

      // @ts-expect-error
      const city = target.children.find((c) => c.type === 'city')

      if (city) target.removeChild(city)

      const text = new Text(terrain.city?.name, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
        align: 'center',
      })
      text.x -= text.width / 2
      text.y += 10
      // @ts-expect-error
      text.type = 'city'

      target.addChild(text)
    },
    upgradeCity(player: HistoryPlayer | null, terrain?: HistoryTerrain) {
      if (!player) return

      const target = terrain ? terrain.id : this.actives.terrain
      const city = this.terrain[target].city

      if (!city) return

      const food = COST_DEFINE.CITY_UPGRADE_FOOD[city.structure.townHall]
      const production =
        COST_DEFINE.CITY_UPGRADE_PRODUCTION[city.structure.townHall]

      if (
        player.resources.food >= food &&
        player.resources.production >= production
      ) {
        city.structure.townHall++
        this.terrain[target].structure = undefined

        player.resources.food -= food
        player.resources.production -= production
      }
    },
    upgradeWall(player: HistoryPlayer | null) {
      if (!player) return

      const target = this.actives.terrain
      const city = this.terrain[target].city

      if (!city) return

      const food = COST_DEFINE.CITY_WALL_UPGRADE_FOOD[city.structure.wall]
      const production =
        COST_DEFINE.CITY_WALL_UPGRADE_PRODUCTION[city.structure.wall]

      if (
        player.resources.food >= food &&
        player.resources.production >= production
      ) {
        city.structure.wall++

        player.resources.food -= food
        player.resources.production -= production
      }
    },
    upgradeMilitarAcademy(player: HistoryPlayer | null) {
      if (!player) return

      const target = this.actives.terrain
      const city = this.terrain[target].city

      if (!city) return

      const food =
        COST_DEFINE.CITY_MILITAR_ACADEMY_UPGRADE_FOOD[
          city.structure.militaryAcademy
        ]
      const production =
        COST_DEFINE.CITY_MILITAR_ACADEMY_UPGRADE_PRODUCTION[
          city.structure.militaryAcademy
        ]

      if (
        player.resources.food >= food &&
        player.resources.production >= production
      ) {
        city.structure.militaryAcademy++

        player.resources.food -= food
        player.resources.production -= production
      }
    },
    setStructure(
      player: HistoryPlayer | null,
      type: HistoryTerrainStructure,
      terrain: HistoryTerrain
    ) {
      if (!player) return

      const define = useDefines().getStructureDefine(type)
      const { food, production } = usePlayer().getStructureCost(type)

      const target = terrain.id

      if (
        player.resources.food >= food &&
        player.resources.production >= production &&
        define.isBuildable.includes(terrain.type)
      ) {
        this.terrain[target].structure = type

        player.resources.food -= food
        player.resources.production -= production
      }
    },
    async createSquad(
      player: HistoryPlayer | null,
      terrain: HistoryTerrain,
      name?: string
    ) {
      if (!player || name === '') return

      const units = useDefines().getUnits()

      units.owner = player.name
      units.squad = name || useDefines().getRandomSquadName()

      this.setSquad(terrain, units)

      await nextTick

      const div = document.querySelector('#terrain-info-right')

      if (div) div.scrollTop = div.scrollHeight
    },
    setSquad(terrain: HistoryTerrain, squad: HistoryTerrainUnits) {
      this.terrain[terrain.id].units = squad
    },
    deleteSquad(terrain: HistoryTerrain, squad: HistoryTerrainUnits) {
      if (confirm('Você tem certeza que deseja deletar uma tropa inteira?')) {
        this.terrain[terrain.id].units = undefined
      }
    },
    recruitUnits(
      player: HistoryPlayer | null,
      terrain: HistoryTerrain,
      units: Record<HistoryUnitType, number>
    ) {
      if (!player) return

      const { food, production, science, influence } =
        useUnits().getRecruitCost(units)

      const count = usePlayer().getAllUnitsCount(player)

      if (
        count + usePlayer().getUnitsCountInRecord(units) >
        usePlayer().getMilitaryCapacity(player)
      ) {
        if (!player.isIA)
          useToast().error(
            'Você não pode recrutar mais do que a sua capacidade militar!'
          )

        return
      }

      if (
        player.resources.food >= food &&
        player.resources.production >= production &&
        player.resources.science >= science &&
        player.resources.influence >= influence
      ) {
        if (this.terrain[terrain.id]?.units) {
          this.terrain[terrain.id].units!.spearman.count += units.spearman
          this.terrain[terrain.id].units!.archer.count += units.archer
          this.terrain[terrain.id].units!.dragon.count += units.dragon
          this.terrain[terrain.id].units!.catapult.count += units.catapult

          player.resources.food -= food
          player.resources.production -= production
          player.resources.influence -= influence
          player.resources.science -= science
        }
      } else if (!player.isIA) {
        useToast().error('Você não possui recursos suficientes para recrutar!')
      }
    },
    removeSquadFromTerrain(terrain: HistoryTerrain) {
      this.terrain[terrain.id].units = undefined
    },
    moveSquad(from: HistoryTerrain, to: HistoryTerrain) {
      const squad = from.units as HistoryTerrainUnits

      if (squad.inCombat || !to.isAccessible) return

      squad.wasMoved = true

      this.removeSquadFromTerrain(from)
      this.setSquad(to, squad)
    },
  },
})
