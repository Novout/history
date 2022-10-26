import { Container, Graphics } from "pixi.js";

export type HistoryGraphics = Graphics & Record<string, any>
export type HistoryContainer = Container & Record<string, any>

export interface HistorySpriteHexagonOptions {
  id: number
  x: number,
  y: number,
  backgroundColor: number
}