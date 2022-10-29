import { useApplicationStore } from '../store/application'
import { HistoryTerrain, HistoryTerrainStructure } from '../types/map'
import { HistoryPlayer } from '../types/player'
import { useUtils } from './utils'
import { useDefines } from './defines'
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
    return p1.knownPlayers.includes(name)
  }

  const getPlayer = (name: string): HistoryPlayer | false => {
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

  const getAllCityTerritories = () => {
    return APP.terrain.filter((t) => t.city)
  }

  const getFood = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const value = getTerritories(player).reduce((sum, acc) => {
      return (sum +=
        (acc.city ? acc.resources.food + acc.city.resources.food : 0) +
        (acc.structure ? getStructureValue(acc.structure).food : 0))
    }, 0)

    return value * player.resources.multipliers.food
  }

  const getProduction = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const value = getTerritories(player).reduce((sum, acc) => {
      return (sum +=
        (acc.city
          ? acc.resources.production + acc.city.resources.production
          : 0) +
        (acc.structure ? getStructureValue(acc.structure).production : 0))
    }, 0)

    return value * player.resources.multipliers.production
  }

  const getInfluence = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    return player.influenceBase * player.resources.multipliers.influence
  }

  const getScience = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    const value = getTerritories(player).reduce((sum, acc) => {
      return (sum +=
        (acc.city ? acc.resources.science + acc.city.resources.science : 0) +
        (acc.structure ? getStructureValue(acc.structure).science : 0))
    }, 0)

    return value * player.resources.multipliers.science
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

  const getStructureValue = (type: HistoryTerrainStructure) => {
    const define = defines.getStructureDefine(type)

    return {
      food: define?.resources?.food ? define?.resources?.food[0] || 0 : 0,
      production: define?.resources?.production
        ? define?.resources?.production[0] || 0
        : 0,
      influence: define?.resources?.influence
        ? define?.resources?.influence[0] || 0
        : 0,
      science: define?.resources?.influence
        ? define?.resources?.science[0] || 0
        : 0,
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
      getFood(player) * 2 +
      (getProduction(player) + 2) +
      (getInfluence(player) + 2) +
      (getScience(player) + 2)

    const resourcesBase =
      (player.resources.food +
        player.resources.influence +
        player.resources.production +
        player.resources.science) /
      20

    const cities = getCityTerritories(player).reduce((acc, t) => {
      return (acc += (t.city?.structure?.townHall || 0) * 5)
    }, 0)

    const territories = tr.length

    const structures = tr.reduce((acc, t) => {
      return (acc += t.structure ? 3 : 0)
    }, 0)

    const result =
      resourcesPerTurn + resourcesBase + cities + territories + structures

    return (result / 2).toFixed(0)
  }

  const getMilitaryPower = (player: HistoryPlayer | null): string => {
    if (!player) return '0'

    const tr = getTerritories(player)

    const troops = tr.reduce((sum, t) => {
      return (sum += t.troops ? 0 : 0)
    }, 0)

    const result = troops

    return result.toFixed(0)
  }

  return {
    isAdjacentTerritory,
    isKnownPlayer,
    getPlayer,
    getAllAdjacentTerritories,
    getCityTerritories,
    getAllCityTerritories,
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
    getMilitaryPower,
  }
}
