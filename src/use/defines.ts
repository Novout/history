import {
  HistoryTerrainGenerate,
  HistoryTerrainStructure,
  HistoryTerrainType,
  HistoryTerrainUnits,
} from '../types/map'
import PANGEA_GENERATE_DEFINE from '../defines/terrain/generate/pangea.json'
import FOREST_DEFINE from '../defines/terrain/forest.json'
import PLAIN_DEFINE from '../defines/terrain/plain.json'
import WATER_DEFINE from '../defines/terrain/water.json'
import TUNDRA_DEFINE from '../defines/terrain/tundra.json'
import SNOW_DEFINE from '../defines/terrain/snow.json'
import FARM_DEFINE from '../defines/buildings/farm.json'
import LUMBER_DEFINE from '../defines/buildings/lumber.json'
import ACADEMIC_CENTER_DEFINE from '../defines/buildings/academic_center.json'
import DEFAULT_FACTOR_DEFINE from '../defines/factors/default.json'
import RANDOM_CITY_NAMES_DEFINE from '../defines/random/city_names.json'
import RANDOM_SQUAD_NAMES_DEFINE from '../defines/random/unit_squad_names.json'
import UNIT_ARCHER_DEFINE from '../defines/units/archer.json'
import UNIT_SPEARMAN_DEFINE from '../defines/units/spearman.json'
import UNIT_DRAGON_DEFINE from '../defines/units/dragon.json'
import UNIT_CATAPULT_DEFINE from '../defines/units/catapult.json'
import { HistoryPlayer, HistoryPlayerIA } from '../types/player'
import { useUtils } from './utils'
import { HistoryUnit } from '../types/units'

export const useDefines = () => {
  const utils = useUtils()

  const getTerrainGenerateDefine = (type: HistoryTerrainGenerate) => {
    switch (type) {
      case 'pangea':
        return PANGEA_GENERATE_DEFINE
    }
  }

  const getTerrainDefine = (type: HistoryTerrainType) => {
    switch (type) {
      case 'forest':
        return FOREST_DEFINE
      case 'plain':
        return PLAIN_DEFINE
      case 'water':
        return WATER_DEFINE
      case 'snow':
        return SNOW_DEFINE
      case 'tundra':
        return TUNDRA_DEFINE
      default:
        return FOREST_DEFINE
    }
  }

  const getStructureDefine = (type: HistoryTerrainStructure): any => {
    switch (type) {
      case 'farm':
        return FARM_DEFINE
      case 'lumber':
        return LUMBER_DEFINE
      case 'academic_center':
        return ACADEMIC_CENTER_DEFINE
    }
  }

  const getIAType = (type: HistoryPlayerIA): any => {
    switch (type) {
      case 'default':
        return DEFAULT_FACTOR_DEFINE
    }
  }

  const getRandomCityName = (): string => {
    return utils.getRandomInArray(RANDOM_CITY_NAMES_DEFINE as string[])
  }

  const getRandomSquadName = (): string => {
    return utils.getRandomInArray(RANDOM_SQUAD_NAMES_DEFINE as string[])
  }

  const getBarbarianUnits = (player: HistoryPlayer): HistoryTerrainUnits => {
    return {
      owner: player.name,
      squad: 'Bárbaros',
      wasMoved: true,
      inCombat: true,
      archer: {
        type: UNIT_ARCHER_DEFINE.type,
        line: UNIT_ARCHER_DEFINE.line,
        count: 0,
        weight: UNIT_ARCHER_DEFINE.weight,
        attack: UNIT_ARCHER_DEFINE.attack,
        HP: UNIT_ARCHER_DEFINE.HP,
        maxHP: UNIT_ARCHER_DEFINE.HP,
        time: UNIT_ARCHER_DEFINE.time,
        cost: UNIT_ARCHER_DEFINE.cost,
        maintenance: UNIT_ARCHER_DEFINE.maintenance,
      } as HistoryUnit<'archer'>,
      catapult: {
        type: UNIT_CATAPULT_DEFINE.type,
        line: UNIT_CATAPULT_DEFINE.line,
        count: 0,
        weight: UNIT_CATAPULT_DEFINE.weight,
        attack: UNIT_CATAPULT_DEFINE.attack,
        HP: UNIT_CATAPULT_DEFINE.HP,
        maxHP: UNIT_CATAPULT_DEFINE.HP,
        time: UNIT_CATAPULT_DEFINE.time,
        cost: UNIT_CATAPULT_DEFINE.cost,
        maintenance: UNIT_CATAPULT_DEFINE.maintenance,
      } as HistoryUnit<'catapult'>,
      dragon: {
        type: UNIT_DRAGON_DEFINE.type,
        line: UNIT_DRAGON_DEFINE.line,
        count: 0,
        weight: UNIT_DRAGON_DEFINE.weight,
        attack: UNIT_DRAGON_DEFINE.attack,
        HP: UNIT_DRAGON_DEFINE.HP,
        maxHP: UNIT_DRAGON_DEFINE.HP,
        time: UNIT_DRAGON_DEFINE.time,
        cost: UNIT_DRAGON_DEFINE.cost,
        maintenance: UNIT_DRAGON_DEFINE.maintenance,
      } as HistoryUnit<'dragon'>,
      spearman: {
        type: UNIT_SPEARMAN_DEFINE.type,
        line: UNIT_SPEARMAN_DEFINE.line,
        count: Math.floor(Math.random() * 30) + 1,
        weight: UNIT_SPEARMAN_DEFINE.weight,
        attack: UNIT_SPEARMAN_DEFINE.attack,
        HP: UNIT_SPEARMAN_DEFINE.HP,
        maxHP: UNIT_SPEARMAN_DEFINE.HP,
        time: UNIT_SPEARMAN_DEFINE.time,
        cost: UNIT_SPEARMAN_DEFINE.cost,
        maintenance: UNIT_SPEARMAN_DEFINE.maintenance,
      } as HistoryUnit<'spearman'>,
    }
  }

  const getUnits = (): HistoryTerrainUnits => {
    return {
      owner: undefined,
      squad: undefined,
      wasMoved: true,
      inCombat: false,
      archer: {
        type: UNIT_ARCHER_DEFINE.type,
        line: UNIT_ARCHER_DEFINE.line,
        count: 0,
        weight: UNIT_ARCHER_DEFINE.weight,
        attack: UNIT_ARCHER_DEFINE.attack,
        HP: UNIT_ARCHER_DEFINE.HP,
        maxHP: UNIT_ARCHER_DEFINE.HP,
        time: UNIT_ARCHER_DEFINE.time,
        cost: UNIT_ARCHER_DEFINE.cost,
        maintenance: UNIT_ARCHER_DEFINE.maintenance,
      } as HistoryUnit<'archer'>,
      catapult: {
        type: UNIT_CATAPULT_DEFINE.type,
        line: UNIT_CATAPULT_DEFINE.line,
        count: 0,
        weight: UNIT_CATAPULT_DEFINE.weight,
        attack: UNIT_CATAPULT_DEFINE.attack,
        HP: UNIT_CATAPULT_DEFINE.HP,
        maxHP: UNIT_CATAPULT_DEFINE.HP,
        time: UNIT_CATAPULT_DEFINE.time,
        cost: UNIT_CATAPULT_DEFINE.cost,
        maintenance: UNIT_CATAPULT_DEFINE.maintenance,
      } as HistoryUnit<'catapult'>,
      dragon: {
        type: UNIT_DRAGON_DEFINE.type,
        line: UNIT_DRAGON_DEFINE.line,
        count: 0,
        weight: UNIT_DRAGON_DEFINE.weight,
        attack: UNIT_DRAGON_DEFINE.attack,
        HP: UNIT_DRAGON_DEFINE.HP,
        maxHP: UNIT_DRAGON_DEFINE.HP,
        time: UNIT_DRAGON_DEFINE.time,
        cost: UNIT_DRAGON_DEFINE.cost,
        maintenance: UNIT_DRAGON_DEFINE.maintenance,
      } as HistoryUnit<'dragon'>,
      spearman: {
        type: UNIT_SPEARMAN_DEFINE.type,
        line: UNIT_SPEARMAN_DEFINE.line,
        count: 0,
        weight: UNIT_SPEARMAN_DEFINE.weight,
        attack: UNIT_SPEARMAN_DEFINE.attack,
        HP: UNIT_SPEARMAN_DEFINE.HP,
        maxHP: UNIT_SPEARMAN_DEFINE.HP,
        time: UNIT_SPEARMAN_DEFINE.time,
        cost: UNIT_SPEARMAN_DEFINE.cost,
        maintenance: UNIT_SPEARMAN_DEFINE.maintenance,
      } as HistoryUnit<'spearman'>,
    }
  }

  return {
    getTerrainGenerateDefine,
    getTerrainDefine,
    getStructureDefine,
    getIAType,
    getRandomCityName,
    getRandomSquadName,
    getBarbarianUnits,
    getUnits,
  }
}
