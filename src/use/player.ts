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

  const getFood = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    return getTerritories(player).reduce((sum, acc) => {
      return (sum +=
        (acc.city ? acc.resources.food + acc.city.resources.food : 0) +
        (acc.structure ? getStructureValue(acc.structure).food : 0))
    }, 0)
  }

  const getProduction = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    return getTerritories(player).reduce((sum, acc) => {
      return (sum +=
        (acc.city
          ? acc.resources.production + acc.city.resources.production
          : 0) +
        (acc.structure ? getStructureValue(acc.structure).production : 0))
    }, 0)
  }

  const getInfluence = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    return player.influenceBase
  }

  const getScience = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    return getTerritories(player).reduce((sum, acc) => {
      return (sum +=
        (acc.city ? acc.resources.science + acc.city.resources.science : 0) +
        (acc.structure ? getStructureValue(acc.structure).science : 0))
    }, 0)
  }

  const getMilitaryCapacity = (player: HistoryPlayer | null) => {
    if (player === null) return 0

    return getTerritories(player).reduce((sum, acc) => {
      return (sum += acc.city ? acc.city.structure.militaryAcademy * 6 : 0)
    }, player.militaryCapability)
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
      multiplier: define?.multiplier || undefined,
    }
  }

  return {
    isAdjacentTerritory,
    isKnownPlayer,
    getPlayer,
    getAllAdjacentTerritories,
    getTerritories,
    getInfluence,
    getFood,
    getProduction,
    getScience,
    getMilitaryCapacity,
    getStructureCost,
    getStructureValue,
  }
}
