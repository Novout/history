import { HistoryResourcesBase } from './map'

export type HistoryUnitType = 'spearman' | 'archer' | 'catapult' | 'dragon'
export type HistoryUnitLineType =
  | 'front_line'
  | 'back_line'
  | 'destruction_line'
  | 'support'
  | 'extra'
  | 'wall'

export interface HistoryUnit<T extends HistoryUnitType> {
  type: T
  line: HistoryUnitLineType
  count: number
  weight: number
  attack: number
  HP: number
  maxHP: number
  time: number
  cost: HistoryResourcesBase
  maintenance: HistoryResourcesBase
}
