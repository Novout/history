import { useApplicationStore } from '../store/application'
import {
  HistoryResourcesBase,
  HistoryResourcesType,
  HistoryTerrain,
  HistoryTerrainStructure,
} from '../types/map'
import { HistoryPlayer } from '../types/player'
import { useUtils } from './utils'
import { useDefines } from './defines'
import { HistoryUnitType } from '../types/units'
import COST_DEFINE from '../defines/cost.json'

export const usePlayer = () => {
  const APP = useApplicationStore()

  const utils = useUtils()
  const defines = useDefines()

  const isAdjacentTerritory = (
    player: HistoryPlayer | null,
    target: HistoryTerrain
  ): boolean => {
    if (player === null) return false

    const isAdjacent = getTerritories(player).find((t) =>
      utils.isAdjacentHex(t, target)
    )

    return !!isAdjacent
  }

  const isKnownPlayer = (p1: HistoryPlayer, name: string) => {
    return p1.players.known.includes(name)
  }

  const isBarbarian = (name: string) => {
    return name.includes('Bárbaro')
  }

  const getPlayer = (name: string): HistoryPlayer | false => {
    if (isBarbarian(name))
      return APP.barbarians.find((p) => p.name === name) || false

    return APP.player?.name === name
      ? (APP.player as HistoryPlayer)
      : APP.IA.find((p) => p.name === name) || false
  }

  const getTerritories = (player: HistoryPlayer | null) => {
    if (player === null) return []

    return APP.terrain.filter((t) => t.owner === player.name)
  }

  const getAllAdjacentTerritories = (player: HistoryPlayer | null) => {
    if (player === null) return []

    return APP.terrain
      .filter((f) => isAdjacentTerritory(player, f))
      .filter((f) => f.owner !== player.name)
  }

  const getCityTerritories = (player: HistoryPlayer | null) => {
    if (player === null) return []

    return getTerritories(player).filter((t) => t.city)
  }

  const getUnitsTerritories = (player: HistoryPlayer | null) => {
    if (player === null) return []

    return APP.terrain.filter((t) => t.units && t.units.owner === player.name)
  }

  const getAllCityTerritories = () => {
    return APP.terrain.filter((t) => t.city)
  }

  const getFood = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const add =
      getTerritories(player).reduce((sum, acc) => {
        return (sum +=
          (acc.city ? acc.resources.food + acc.city.resources.food : 0) +
          (acc.structure ? getStructureValue(acc, acc.structure).food : 0))
      }, 0) * player.resources.multipliers.food

    const sub = getUnitsMaintenance(player, 'food')

    return add - sub
  }

  const getProduction = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const add =
      getTerritories(player).reduce((sum, acc) => {
        return (sum +=
          (acc.city
            ? acc.resources.production + acc.city.resources.production
            : 0) +
          (acc.structure
            ? getStructureValue(acc, acc.structure).production
            : 0))
      }, 0) * player.resources.multipliers.production

    const sub = getUnitsMaintenance(player, 'production')

    return add - sub
  }

  const getInfluence = (player: HistoryPlayer | null) => {
    if (player === null) return 0.0

    const add = player.influenceBase * player.resources.multipliers.influence

    const sub = getUnitsMaintenance(player, 'influence')

    return add - sub
  }

  const getScience = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const add =
      getTerritories(player).reduce((sum, acc) => {
        return (sum +=
          (acc.city
            ? acc.resources.science + acc.city.resources.science
            : 0.0) +
          (acc.structure ? getStructureValue(acc, acc.structure).science : 0.0))
      }, 0.0) * player.resources.multipliers.science

    const sub = getUnitsMaintenance(player, 'science')

    return add - sub
  }

  const getMilitaryCapacity = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const value = getTerritories(player).reduce((sum, acc) => {
      return (sum += acc.city ? acc.city.structure.militaryAcademy * 6 : 0)
    }, player.militaryCapability)

    return value
  }

  const getStructureCost = (type: HistoryTerrainStructure) => {
    switch (type) {
      case 'farm':
        return {
          food: COST_DEFINE.CONSTRUCTION_FARM_UPGRADE_FOOD[0],
          production: COST_DEFINE.CONSTRUCTION_FARM_UPGRADE_PRODUCTION[0],
        }
      case 'lumber':
        return {
          food: COST_DEFINE.CONSTRUCTION_LUMBER_UPGRADE_FOOD[0],
          production: COST_DEFINE.CONSTRUCTION_LUMBER_UPGRADE_PRODUCTION[0],
        }
      case 'academic_center':
        return {
          food: COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_FOOD[0],
          production:
            COST_DEFINE.CONSTRUCTION_ACADEMIC_CENTER_UPGRADE_PRODUCTION[0],
        }
    }
  }

  const getStructureValue = (
    terrain: HistoryTerrain,
    type: HistoryTerrainStructure
  ) => {
    const define = defines.getStructureDefine(type)

    return {
      food: define?.resources?.food
        ? terrain.resources.food + define?.resources?.food[0] || 0.0
        : 0.0,
      production: define?.resources?.production
        ? terrain.resources.production + define?.resources?.production[0] || 0.0
        : 0.0,
      influence: define?.resources?.influence
        ? terrain.resources.influence + define?.resources?.influence[0] || 0.0
        : 0.0,
      science: define?.resources?.influence
        ? terrain.resources.science + define?.resources?.science[0] || 0.0
        : 0.0,
      multipliers: define?.multipliers || undefined,
    }
  }

  const getBestCaseTerritory = (tr: HistoryTerrain[]) => {
    return tr.reduce((a1, a2) => {
      const t1: number =
        a1.resources.food +
        a1.resources.production +
        a1.resources.science +
        a1.resources.influence
      const t2: number =
        a2.resources.food +
        a2.resources.production +
        a2.resources.science +
        a2.resources.influence

      const max = Math.max(t1, t2)

      return max === t1 ? a1 : a2
    })
  }

  const getEconomicPower = (player: HistoryPlayer | null): string => {
    if (!player) return '0'

    const tr = getTerritories(player)

    const resourcesPerTurn =
      getFood(player) * 2.0 +
      getProduction(player) * 2.0 +
      getInfluence(player) * 2.0 +
      getScience(player) * 2.0

    const resourcesBase =
      (player.resources.food +
        player.resources.influence +
        player.resources.production +
        player.resources.science) /
      20.0

    const cities = getCityTerritories(player).reduce((acc, t) => {
      return (acc += (t.city?.structure?.townHall || 0.0) * 5.0)
    }, 0)

    const territories = tr.length

    const structures = tr.reduce((acc, t) => {
      return (acc += t.structure ? 3.0 : 0.0)
    }, 0.0)

    const result =
      resourcesPerTurn + resourcesBase + cities + territories + structures

    return (result / 2).toFixed(0)
  }

  const getUnitsCost = (
    player: HistoryPlayer | null,
    resource: HistoryResourcesType
  ) => {
    if (!player) return 0.0

    const tr = getTerritories(player)

    return tr.reduce((sum, t) => {
      return (sum += getUnitsCostInTerrain(t, resource))
    }, 0.0)
  }

  const getUnitsMaintenance = (
    player: HistoryPlayer | null,
    resource: HistoryResourcesType
  ): number => {
    if (!player) return 0.0

    return APP.terrain.reduce((sum, t) => {
      return (sum +=
        t.units?.owner === player.name
          ? getUnitsMaintenanceInTerrain(t, resource)
          : 0)
    }, 0.0)
  }

  const getUnitsMaintenanceInTerrain = (
    terrain: HistoryTerrain,
    resource: HistoryResourcesType
  ): number => {
    if (!terrain.units) return 0.0

    return (
      terrain.units.archer.maintenance[resource] * terrain.units.archer.count +
      terrain.units.spearman.maintenance[resource] *
        terrain.units.spearman.count +
      terrain.units.catapult.maintenance[resource] *
        terrain.units.catapult.count +
      terrain.units.dragon.maintenance[resource] * terrain.units.dragon.count
    )
  }

  const getUnitsMaintenanceInBase = (
    { spearman, archer, catapult, dragon }: Record<HistoryUnitType, number>,
    resource: HistoryResourcesType
  ): Record<HistoryUnitType, number> => {
    const define = defines.getUnits()

    return {
      spearman: spearman * define.spearman.maintenance[resource],
      archer: archer * define.archer.maintenance[resource],
      catapult: catapult * define.catapult.maintenance[resource],
      dragon: dragon * define.dragon.maintenance[resource],
    } as Record<HistoryUnitType, number>
  }

  const getUnitsMaintenanceInBaseResources = (
    units: Record<HistoryUnitType, number>,
    resource: HistoryResourcesType
  ): number => {
    const values = getUnitsMaintenanceInBase(units, resource)

    return Object.values(values).reduce((sum, val) => {
      return (sum += val)
    }, 0)
  }

  const getUnitsCostInTerrain = (
    terrain: HistoryTerrain,
    resource: HistoryResourcesType
  ) => {
    if (!terrain.units) return 0.0

    return (
      terrain.units.archer.cost[resource] +
      terrain.units.spearman.cost[resource] +
      terrain.units.catapult.cost[resource] +
      terrain.units.dragon.cost[resource]
    )
  }

  const getUnitsCostInBase = (
    { spearman, archer, catapult, dragon }: Record<HistoryUnitType, number>,
    resource: HistoryResourcesType
  ): Record<HistoryUnitType, number> => {
    const define = defines.getUnits()

    return {
      spearman: spearman * define.spearman.cost[resource],
      archer: archer * define.archer.cost[resource],
      catapult: catapult * define.catapult.cost[resource],
      dragon: dragon * define.dragon.cost[resource],
    } as Record<HistoryUnitType, number>
  }

  const getUnitsCostInBaseResources = (
    units: Record<HistoryUnitType, number>,
    resource: HistoryResourcesType
  ): number => {
    const values = getUnitsCostInBase(units, resource)

    return Object.values(values).reduce((sum, val) => {
      return (sum += val)
    }, 0)
  }

  const getAllUnitsCount = (player: HistoryPlayer | null): number => {
    if (!player) return 0

    return APP.terrain.reduce((sum, t) => {
      return (sum +=
        t.units?.owner === player.name ? getUnitsCountByWeightInTerrain(t) : 0)
    }, 0)
  }

  const getUnitsCountByWeightInTerrain = (terrain: HistoryTerrain): number => {
    if (!terrain.units) return 0

    return (
      terrain.units.archer.count * terrain.units.archer.weight +
      terrain.units.spearman.count * terrain.units.spearman.weight +
      terrain.units.catapult.count * terrain.units.catapult.weight +
      terrain.units.dragon.count * terrain.units.dragon.weight
    )
  }

  const getUnitsCountInTerrain = (terrain: HistoryTerrain): number => {
    if (!terrain.units) return 0

    return (
      terrain.units.archer.count +
      terrain.units.spearman.count +
      terrain.units.catapult.count +
      terrain.units.dragon.count
    )
  }

  const getUnitsCountInRecord = (units?: Record<HistoryUnitType, number>) => {
    if (!units) return 0

    return units.archer + units.spearman + units.catapult + units.dragon
  }

  const getMilitaryPower = (player: HistoryPlayer | null): string => {
    if (!player) return '0'

    const troops = getAllUnitsCount(player) * 1.25

    const capacity = getMilitaryCapacity(player) / 2.0

    const result = troops + capacity

    return (result / 2).toFixed(0)
  }

  const getPossibleUnitsMove = (
    player: HistoryPlayer | null,
    terrain: HistoryTerrain
  ): HistoryTerrain[] => {
    if (
      !player ||
      player.isBarbarian ||
      (player.name !== terrain.owner && terrain.owner !== undefined)
    )
      return []
    const possibleTroops = APP.terrain
      .filter((tr) => tr.units)
      .filter(
        (tr) =>
          utils.isAdjacentHex(tr, terrain) &&
          getUnitsCountInTerrain(tr) > 0 &&
          !isBarbarian(tr.units?.squad as string) &&
          !tr.units?.wasMoved
      )
      .filter(
        (tr) =>
          tr.units?.owner === player.name || (!terrain.owner && !terrain.units)
      )

    return possibleTroops
  }

  const getPossibleUnitsAttack = (
    player: HistoryPlayer | null,
    terrain: HistoryTerrain
  ): HistoryTerrain[] => {
    if (
      !player ||
      player.name === terrain.units?.owner ||
      player.players.allies.includes(terrain.owner || '')
    )
      return []

    const possibleAttack = APP.terrain
      .filter(
        (tr) =>
          utils.isAdjacentHex(tr, terrain) &&
          getUnitsCountInTerrain(tr) > 0 &&
          getUnitsCountInTerrain(terrain) > 0 &&
          !tr.units?.wasMoved
      )
      .filter(
        (tr) =>
          (tr.units?.squad === 'Bárbaros' && terrain.owner === player.name) ||
          tr.units?.owner === player.name ||
          (!terrain.owner && !terrain.units)
      )

    return possibleAttack
  }

  return {
    isAdjacentTerritory,
    isKnownPlayer,
    isBarbarian,
    getPlayer,
    getAllAdjacentTerritories,
    getCityTerritories,
    getAllCityTerritories,
    getUnitsCountByWeightInTerrain,
    getUnitsTerritories,
    getTerritories,
    getInfluence,
    getFood,
    getProduction,
    getScience,
    getMilitaryCapacity,
    getStructureCost,
    getStructureValue,
    getBestCaseTerritory,
    getEconomicPower,
    getUnitsMaintenance,
    getUnitsMaintenanceInTerrain,
    getUnitsMaintenanceInBase,
    getUnitsMaintenanceInBaseResources,
    getUnitsCost,
    getUnitsCostInTerrain,
    getUnitsCostInBase,
    getUnitsCostInBaseResources,
    getAllUnitsCount,
    getUnitsCountInRecord,
    getUnitsCountInTerrain,
    getMilitaryPower,
    getPossibleUnitsMove,
    getPossibleUnitsAttack,
  }
}
