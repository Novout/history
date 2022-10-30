import { HistoryUnit } from './units'

export type HistoryTerrainType =
  | 'forest'
  | 'plain'
  | 'water'
  | 'snow'
  | 'tundra'
export type HistoryTerrainStructure = 'farm' | 'lumber' | 'academic_center'
export type HistoryTerrainGenerate = 'pangea'

export type HistoryResourcesType =
  | 'influence'
  | 'production'
  | 'food'
  | 'science'

export interface HistoryResourcesBase {
  influence: number
  production: number
  food: number
  science: number
}

export interface HistoryResources extends HistoryResourcesBase {
  multipliers: {
    influence: number
    production: number
    food: number
    science: number
  }
}

export interface HistoryTerrainUnits {
  owner?: string
  squad?: string
  wasMoved: boolean
  inCombat: boolean
  archer: HistoryUnit<'archer'>
  catapult: HistoryUnit<'catapult'>
  dragon: HistoryUnit<'dragon'>
  spearman: HistoryUnit<'spearman'>
}

export interface HistoryTerrain {
  id: number
  x: number
  y: number
  isColonizable: boolean
  isAccessible: boolean
  isAttachable: boolean
  isSpecialHex: boolean
  owner: string | undefined
  type: HistoryTerrainType
  resources: HistoryResources
  structure: HistoryTerrainStructure | undefined
  city?: {
    name: string
    resources: HistoryResources
    structure: {
      townHall: number
      wall: number
      militaryAcademy: number
    }
  }
  units?: HistoryTerrainUnits
}
export interface HistoryMapHexagonCreateOptions {
  type: HistoryTerrainType
  data?: HistoryTerrain
  id: number
  radius: number
  x: number
  y: number
  typeDefine: any
  resources: {
    food: number
    production: number
  }
}
export interface HistoryMapCreateOptions {
  radius: number
  size: 'small' | 'medium' | 'large'
  type: HistoryTerrainGenerate
}
