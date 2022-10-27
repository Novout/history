import { HistoryTerrainType } from '../types/map'

export const useName = () => {
  const getTerrainTypeName = (type: HistoryTerrainType): string => {
    switch (type) {
      case 'forest':
        return 'Floresta'
      case 'plain':
        return 'Campo'
      case 'snow':
        return 'Neve'
      case 'tundra':
        return 'Tundra'
      case 'water':
        return 'Água'
    }
  }

  return { getTerrainTypeName }
}
