import { Application, Container } from "pixi.js";
import { Viewport } from 'pixi-viewport'
import { HistoryMapCreateOptions, HistoryTerrain } from "./map";
import { HistoryPlayer } from "./player";
import { HistoryGameOptions } from "./game";

export interface ApplicatonState {
  context: Application | null,
  viewport: Viewport | null
  terrainContainer: Container | null
  terrain: HistoryTerrain[],
  player: HistoryPlayer | null,
  IA: HistoryPlayer[],
  actives: {
    terrain: number
  },
  absolute: {
    terrainInfo: boolean
  }
}

export interface OptionsState {
  map: HistoryMapCreateOptions
  game: HistoryGameOptions
  debug: boolean
}

export interface CycleState {
  round: number
}