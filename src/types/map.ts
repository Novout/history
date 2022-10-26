export type HistoryTerrainType = 'forest' | 'plain' | 'water'
export type HistoryTerrainStructure = 'farm' | 'lumber' | 'academic_center'

export interface HistoryResources {
  influence: number
  production: number
  food: number
  science: number
}

export interface HistoryTerrain {
  id: number
  x: number
  y: number
  isColonizable: boolean
  isAccessible: boolean
  owner: string | undefined
  type: HistoryTerrainType,
  resources: HistoryResources
  structure: HistoryTerrainStructure | undefined
  city?: {
    name: string
    resources: HistoryResources
    structure: {
      townHall: number,
      wall: number,
      militaryAcademy: number
    }
  }
  troops?: {}
}
export interface HistoryMapHexagonCreateOptions { type: HistoryTerrainType, data?: HistoryTerrain, id: number, radius: number, x: number, y: number, typeDefine: any, resources: {
  food: number,
  production: number
} }
export interface HistoryMapCreateOptions {
  radius: number, 
  width: number, 
  height: number, 
  type: 'default'
}