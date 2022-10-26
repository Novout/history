import { HistoryTerrainStructure, HistoryTerrainType } from "../types/map";
import FOREST_DEFINE from '../defines/terrain/forest.json'
import PLAIN_DEFINE from '../defines/terrain/plain.json'
import WATER_DEFINE from '../defines/terrain/water.json'
import FARM_DEFINE from '../defines/buildings/farm.json'
import LUMBER_DEFINE from '../defines/buildings/lumber.json'
import ACADEMIC_CENTER_DEFINE from '../defines/buildings/academic_center.json'
import DEFAULT_FACTOR_DEFINE from '../defines/factors/default.json'
import { HistoryPlayerIA } from "../types/player";

export const useDefines = () => {
  const getTerrainDefine = (type: HistoryTerrainType) => {
    switch(type) {
      case 'forest':
        return FOREST_DEFINE
      case 'plain':
        return PLAIN_DEFINE
      case 'water':
        return WATER_DEFINE
      default:
        return FOREST_DEFINE
    }
  }

  const getStructureDefine = (type: HistoryTerrainStructure): any => {
    switch(type) {
      case 'farm':
        return FARM_DEFINE
      case 'lumber':
        return LUMBER_DEFINE
      case 'academic_center':
        return ACADEMIC_CENTER_DEFINE
    }
  }

  const getIAType = (type: HistoryPlayerIA): any => {
    switch(type) {
      case 'default':
        return DEFAULT_FACTOR_DEFINE
    }
  }

  return { getTerrainDefine, getStructureDefine, getIAType }
}