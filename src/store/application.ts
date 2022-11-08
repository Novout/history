import { defineStore } from 'pinia'
import { HistoryPlayer } from '../types/player'
import { HistoryContainer, HistoryGraphics } from '../types/sprite'
import { ApplicatonState } from '../types/stores'
import { useUtils } from '../use/utils'
import {
  HistoryTerrain,
  HistoryTerrainStructure,
  HistoryTerrainUnits,
} from '../types/map'
import { Container, Graphics, Loader, Sprite, Text, utils } from 'pixi.js'
import { usePlayer } from '../use/player'
import { useMap } from '../use/map'
import COST_DEFINE from '../defines/cost.json'
import { useDefines } from '../use/defines'
import { useOptionsState } from './options'
import { HistoryUnitType } from '../types/units'
import { useUnits } from '../use/units'
import { useToast } from 'vue-toastification'
import { nextTick } from 'vue'
import { useBattleStore } from './battle'
import { useBattle } from '../use/battle'

export const useApplicationStore = defineStore('application', {
  state: (): ApplicatonState => ({
    context: null,
    viewport: null,
    terrainContainer: null,
    terrain: [],
    player: null,
    IA: [],
    barbarians: [],
    actives: {
      terrain: -1,
      terrainClicked: false,
      battleClicked: 0,
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

      if (player.isBarbarian) {
        this.setBarbarianPlayer(player, id)

        return
      }

      if (player.isIA) this.IA.push(player)
      else this.player = player

      this.createCity(player, id, true)
    },
    setBarbarianPlayer(player: HistoryPlayer, id: number) {
      this.barbarians.push(player)

      this.createCity(player, id, true)

      this.terrain[id].units = useDefines().getBarbarianUnits(player)

      this.setSquadSprite(this.terrain[id], player)
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
          color: utils.string2hex(player.color),
        })

        target?.addChild(terrain)
      }
    },
    resetTerrain(terrain: HistoryTerrain) {
      const target = this.terrainContainer?.children[
        terrain.id
      ] as HistoryContainer

      // @ts-expect-error
      const tr = target.children.find((c) => c.type === 'territory')

      // @ts-expect-error
      const city = target.children.find((c) => c.type === 'city')

      if (tr) target.removeChild(tr)
      if (city) target.removeChild(city)
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

      this.setSquadSprite(terrain)
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

          this.setSquadSprite(terrain)
        }
      } else if (!player.isIA) {
        useToast().error('Você não possui recursos suficientes para recrutar!')
      }
    },
    removeSquadFromTerrain(terrain: HistoryTerrain) {
      this.terrain[terrain.id].units = undefined

      this.removeSquadSprite(terrain)
    },
    moveSquad(from: HistoryTerrain, to: HistoryTerrain) {
      const squad = from.units as HistoryTerrainUnits

      if (squad.inCombat || !to.isAccessible) return

      squad.wasMoved = true

      this.removeSquadFromTerrain(from)
      this.setSquad(to, squad)
    },
    async attack(from: HistoryTerrain, to: HistoryTerrain) {
      if (!from.units) return

      const attacker = usePlayer().getPlayer(
        from.units.owner as string
      ) as HistoryPlayer

      if (!to.units && to.owner) {
        if (
          !attacker.players.enemies.includes(to.owner) &&
          !usePlayer().isBarbarian(to.owner)
        ) {
          if (confirm(`Deseja declarar guerra contra o jogador ${to.owner}?`)) {
            attacker.players.enemies.unshift(to.owner as string)
          } else {
            return
          }
        }

        this.moveSquad(from, to)

        if (to.city) to.city = undefined
        if (to.structure) to.structure = undefined

        return
      }

      if (!to.units) return

      const defender = usePlayer().getPlayer(
        to.units.owner as string
      ) as HistoryPlayer

      const squad = from.units as HistoryTerrainUnits

      if (!attacker) return

      if (attacker.players.allies.includes(defender.name)) {
        if (!attacker.isIA)
          useToast().error('Não é permitido atacar um aliado!')

        return
      }

      if (!to.isAccessible) return

      if (
        !attacker.players.enemies.includes(defender.name) &&
        !defender.isBarbarian
      ) {
        if (
          confirm(`Deseja declarar guerra contra o jogador ${defender.name}?`)
        ) {
          attacker.players.enemies.unshift(defender.name)
          defender.players.enemies.unshift(attacker.name)
        } else {
          return
        }
      }

      squad.wasMoved = true
      squad.inCombat = true

      to.units.wasMoved = true
      to.units.inCombat = true

      useBattleStore().battles.push({
        isActive: true,
        winner: undefined,
        attacker: from,
        defender: to,
        round: {
          value: 1,
          attacker: useBattle().getUnitsCounter(from, 'attacker'),
          defender: useBattle().getUnitsCounter(to, 'defender'),
        },
      })

      await nextTick

      this.absolute.terrainInfo = false
      this.actives.battleClicked = useBattleStore().battles.length - 1
      this.absolute.battleWindow = true

      useToast().info(`Guerra declarada contra ${defender.name}!`)
    },
    setSquadSprite(tr: HistoryTerrain, player?: HistoryPlayer) {
      if (!tr.units) return

      const target = this.terrainContainer?.children[tr.id] as HistoryContainer

      this.removeSquadSprite(tr)

      // @ts-expect-error
      const fog = target.children.find((c) => c.type === 'fog')

      if (fog) return

      player =
        player ||
        (usePlayer().getPlayer(tr.units.owner as string) as HistoryPlayer)

      const container = new Container() as HistoryContainer
      container.type = 'unit'

      const rect = new Graphics() as HistoryGraphics
      rect.lineStyle(2, utils.string2hex(player.color))
      rect.drawRect(0, 0, 80, 50)
      rect.x = -25
      rect.y += 22

      const icon = Sprite.from(
        // @ts-expect-error
        Loader.shared.resources['icon_unit'].texture
      )
      icon.x -= icon.width / 2
      icon.y += 30
      icon.height = 30
      icon.width = 30

      const text = new Text(usePlayer().getUnitsCountByWeightInTerrain(tr), {
        fontFamily: 'Arial',
        fontSize: 25,
        fill: 0xffffff,
        align: 'center',
      })
      text.x -= text.width / 2 - 30
      text.y += 30
      // @ts-expect-error
      text.type = 'city'

      container.addChild(rect)
      container.addChild(icon)
      container.addChild(text)

      target.addChild(container)
    },
    removeSquadSprite(tr: HistoryTerrain) {
      const target = this.terrainContainer?.children[tr.id] as HistoryContainer

      // @ts-expect-error
      const unit = target.children.find((c) => c.type === 'unit')
      if (unit) target.removeChild(unit)
    },
  },
})
