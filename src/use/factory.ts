import { Graphics } from 'pixi.js'
import { HistoryGraphics } from '../types/sprite'

export const useFactory = () => {
  const hexagon = ({
    type,
    radius,
    color,
    colorAlpha,
    border,
    borderAlpha,
  }: {
    type: string
    radius: number
    color: number
    colorAlpha?: number
    border?: number
    borderAlpha?: number
  }) => {
    const target: HistoryGraphics = new Graphics()
    target.type = type

    const bg: HistoryGraphics = new Graphics()
    if (border) bg.lineStyle(border, color, borderAlpha || 1.0)
    bg.beginFill(color, colorAlpha || 1.0)

    const hexagonHeight = radius * Math.sqrt(3)
    bg.drawPolygon([
      -radius,
      0,
      -radius / 2,
      hexagonHeight / 2,
      radius / 2,
      hexagonHeight / 2,
      radius,
      0,
      radius / 2,
      -hexagonHeight / 2,
      -radius / 2,
      -hexagonHeight / 2,
    ])
    bg.endFill()
    target.addChild(bg)

    return target
  }

  return { hexagon }
}
