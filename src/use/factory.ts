import { Graphics } from 'pixi.js'
import { HistoryGraphics } from '../types/sprite'

export const useFactory = () => {
  const hexagonTile = (options: { radius: number; x: number; y: number }) => {
    const hexagonHeight = options.radius * Math.sqrt(3)

    const newP = { x: 0, y: 0 }
    let xIdx = Math.round(options.x / (options.radius * (3 / 2)))
    newP.x = xIdx * (options.radius * (3 / 2))
    if (xIdx % 2) {
      newP.y =
        Math.floor(options.y / hexagonHeight) * hexagonHeight +
        hexagonHeight / 2
    } else {
      newP.y = Math.round(options.y / hexagonHeight) * hexagonHeight
    }

    return newP
  }

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

  return { hexagonTile, hexagon }
}
