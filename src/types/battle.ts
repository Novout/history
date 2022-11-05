import { HistoryTerrain } from './map'
import { HistoryUnitLineType, HistoryUnitType } from './units'

export type HistoryBattleRoundPlayerItem = [
  HistoryUnitType,
  HistoryUnitLineType,
  number
]
export type HistoryBattleRoundPlayer = HistoryBattleRoundPlayerItem[]

export interface HistoryBattleRound {
  value: number
  attacker: HistoryBattleRoundPlayer
  defender: HistoryBattleRoundPlayer
}

export interface HistoryBattle {
  isActive: boolean
  winner?: string
  attacker: HistoryTerrain
  defender: HistoryTerrain
  round?: HistoryBattleRound
}

export interface HistoryBattleSlotUnit {
  index: number
  lineType: HistoryUnitLineType
  unitType: HistoryUnitType
  stack: number
  value: number
}
