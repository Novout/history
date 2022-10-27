import { HistoryTerrainGenerate, HistoryTerrainStructure, HistoryTerrainType } from "../types/map";
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
import { HistoryPlayerIA } from "../types/player";

export const useDefines = () => {
  const getTerrainGenerateDefine = (type: HistoryTerrainGenerate) => {
    switch(type) {
      case 'pangea':
        return PANGEA_GENERATE_DEFINE
    }
  }

  const getTerrainDefine = (type: HistoryTerrainType) => {
    switch(type) {
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

  return { getTerrainGenerateDefine, getTerrainDefine, getStructureDefine, getIAType }
}