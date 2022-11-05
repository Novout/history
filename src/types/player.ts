import { HistoryResources } from './map'

export type Player = string

export interface HistoryPlayerRelations {
  name: Player
  value: number
}

export type HistoryPlayerIA = 'default' | 'barbarian'

export interface HistoryPlayer {
  name: Player
  color: string
  isIA: HistoryPlayerIA | boolean
  isBarbarian: boolean
  isAlive: boolean
  players: {
    known: string[]
    allies: string[]
    enemies: string[]
  }
  resources: HistoryResources
  militaryCapability: number
  cityLimit: number
  influenceBase: number
}
