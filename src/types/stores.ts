import { Application, Container } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { HistoryMapCreateOptions, HistoryTerrain } from './map'
import { HistoryPlayer } from './player'
import { HistoryGameOptions } from './game'
import { HistoryBattle } from './battle'

export interface ApplicatonState {
  context: Application | null
  viewport: Viewport | null
  terrainContainer: Container | null
  terrain: HistoryTerrain[]
  player: HistoryPlayer | null
  IA: HistoryPlayer[]
  barbarians: HistoryPlayer[]
  actives: {
    terrain: number
    terrainClicked: boolean
  }
  absolute: {
    battleWindow: boolean
    battleInfo: boolean
    terrainInfo: boolean
  }
}

export interface OptionsState {
  map: HistoryMapCreateOptions
  game: HistoryGameOptions
  debug: boolean
}

export interface CycleState {
  started: boolean
  round: number
}

export interface BattleState {
  battles: HistoryBattle[]
}
