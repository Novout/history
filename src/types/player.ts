import { HistoryResources } from './map'

export type Player = string

export interface HistoryPlayerRelations {
  name: Player
  value: number
}

export type HistoryPlayerIA = 'default'

export interface HistoryPlayer {
  name: Player
  color: [string, number]
  isIA: HistoryPlayerIA | boolean
  isAlive: boolean
  knownPlayers: string[]
  resources: HistoryResources
  militaryCapability: number
  cityLimit: number
  influenceBase: number
}
