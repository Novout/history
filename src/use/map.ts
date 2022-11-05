import { Container, Graphics, Loader, Sprite, Text } from 'pixi.js'
import { useApplicationStore } from '../store/application'
import {
  HistoryContainer,
  HistoryGraphics,
  HistorySpriteHexagonOptions,
} from '../types/sprite'
import {
  HistoryMapCreateOptions,
  HistoryMapHexagonCreateOptions,
  HistoryTerrainType,
} from '../types/map'
import { useOptionsState } from '../store/options'
import { useUtils } from './utils'
import { useDefines } from './defines'
import { Coordinates } from '../types/utils'
import { useListeners } from './listeners'
import { useFactory } from './factory'
import { usePlayer } from './player'
import { HistoryPlayer } from '../types/player'

export const useMap = () => {
  const APP = useApplicationStore()
  const OPTIONS = useOptionsState()

  const utils = useUtils()
  const defines = useDefines()
  const listeners = useListeners()
  const factory = useFactory()
  const player = usePlayer()
  const loader = Loader.shared

  const getSize = (): { width: number; height: number } => {
    switch (OPTIONS.map.size) {
      case 'small':
        return { width: 6, height: 6 }
      case 'medium':
        return { width: 12, height: 8 }
      case 'large':
        return { width: 30, height: 8 }
    }
  }

  const generateType = ({ y }: Coordinates): HistoryTerrainType => {
    const define = defines.getTerrainGenerateDefine(OPTIONS.map.type)

    const random = utils.getRandomPercentage()

    const { height } = getSize()

    if (OPTIONS.map.type === 'pangea') {
      if (
        (y <= define.snow[0] && random > define.snow[1]) ||
        (height - 1 - define.snow[0] <= y && random > define.snow[1])
      ) {
        return 'snow'
      }

      if (
        (y <= define.tundra[0] && random > define.tundra[1]) ||
        (height - 1 - define.tundra[0] <= y && random > define.tundra[1])
      ) {
        return 'tundra'
      }

      if (random > define.plain) {
        return 'plain'
      }

      if (random > define.forest) {
        return 'forest'
      }

      return 'water'
    }

    return 'plain'
  }

  const hexTerrain = (
    options: HistoryMapHexagonCreateOptions
  ): HistoryContainer => {
    const target = factory.hexagon({
      type: 'fog',
      radius: OPTIONS.map.radius,
      color: options.typeDefine.backgroundColor,
      colorAlpha: 0.6,
    })

    const { x, y } = factory.hexagonTile({
      x: options.x,
      y: options.y,
      radius: OPTIONS.map.radius,
    })
    target.x = x
    target.y = y
    target.id = options.id
    target.interactive = true
    target.buttonMode = true
    target.on('click', listeners.onTerrainInfo)
    target.on('touch', listeners.onTerrainInfo)

    if (options.type === 'forest') {
      const tree1: HistoryGraphics = new Graphics()

      tree1.beginFill(Number(options.typeDefine.borderColor), 1)
      tree1.lineStyle(0, Number(options.typeDefine.borderColor), 1)
      tree1.moveTo(30, 0)
      tree1.lineTo(15, 30)
      tree1.lineTo(0, 0)
      tree1.lineTo(15, 0)
      tree1.endFill()
      tree1.rotation = 3
      tree1.x = 30
      tree1.y = 30

      const tree2: HistoryGraphics = new Graphics()

      tree2.beginFill(Number(options.typeDefine.borderColor), 1)
      tree2.lineStyle(0, Number(options.typeDefine.borderColor), 1)
      tree2.moveTo(30, 0)
      tree2.lineTo(15, 30)
      tree2.lineTo(0, 0)
      tree2.lineTo(15, 0)
      tree2.endFill()
      tree2.rotation = 3
      tree2.x = -20
      tree2.y = 0

      const tree3: HistoryGraphics = new Graphics()

      tree3.beginFill(Number(options.typeDefine.borderColor), 1)
      tree3.lineStyle(0, Number(options.typeDefine.borderColor), 1)
      tree3.moveTo(30, 0)
      tree3.lineTo(15, 30)
      tree3.lineTo(0, 0)
      tree3.lineTo(15, 0)
      tree3.endFill()
      tree3.rotation = 3
      tree3.x = 40
      tree3.y = -20

      const tree4: HistoryGraphics = new Graphics()

      tree4.beginFill(Number(options.typeDefine.borderColor), 1)
      tree4.lineStyle(0, Number(options.typeDefine.borderColor), 1)
      tree4.moveTo(30, 0)
      tree4.lineTo(15, 30)
      tree4.lineTo(0, 0)
      tree4.lineTo(15, 0)
      tree4.endFill()
      tree4.rotation = 3
      tree4.x = 10
      tree4.y = 0

      const tree5: HistoryGraphics = new Graphics()

      tree5.beginFill(Number(options.typeDefine.borderColor), 1)
      tree5.lineStyle(0, Number(options.typeDefine.borderColor), 1)
      tree5.moveTo(30, 0)
      tree5.lineTo(15, 30)
      tree5.lineTo(0, 0)
      tree5.lineTo(15, 0)
      tree5.endFill()
      tree5.rotation = 3
      tree5.x = -15
      tree5.y = 50

      target.addChild(tree1)
      target.addChild(tree2)
      target.addChild(tree3)
      target.addChild(tree4)
      target.addChild(tree5)
    }

    const production = new Container()
    production.y = -50
    production.x = 30
    const productionIcon = Sprite.from(
      // @ts-expect-error
      loader.resources['icon_production'].texture
    )
    productionIcon.x = -26
    production.addChild(productionIcon)
    const productionValue = new Text(String(options.resources.production), {
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0xe0b14a,
      align: 'center',
    })
    production.addChild(productionValue)

    const food = new Container()
    food.y = -25
    food.x = 30
    // @ts-expect-error
    const foodIcon = Sprite.from(loader.resources['icon_food'].texture)
    foodIcon.x = -26
    food.addChild(foodIcon)
    const foodValue = new Text(String(options.resources.food), {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xe0b14a,
      align: 'center',
    })
    food.addChild(foodValue)

    target.addChild(production)
    target.addChild(food)

    if (OPTIONS.debug) {
      const text = new Text(String(options.id), {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xff1010,
        align: 'center',
      })
      text.y = 50
      text.x = -40

      target.addChild(text)
    }

    return target
  }

  const hexOwner = (options: HistorySpriteHexagonOptions) => {
    const target = factory.hexagon({
      type: 'fog',
      radius: OPTIONS.map.radius,
      color: options.color,
      colorAlpha: 0.15,
      border: 3,
      borderAlpha: 1.0,
    })

    const { x, y } = factory.hexagonTile({
      radius: 100,
      x: options.x,
      y: options.y,
    })
    target.x = x
    target.y = y
    target.id = options.id
    target.type = 'territory'

    return target
  }

  const create = (opts: HistoryMapCreateOptions) => {
    const { width, height } = getSize()

    let counterX = 0
    let counterY = 0
    let ID = 0

    const terrain = new Container()

    for (let y = opts.radius * 2; counterY < height; y += opts.radius * 1.8) {
      for (let x = opts.radius * 2; counterX < width; x += opts.radius * 1.5) {
        const type = generateType({ x: counterX, y: counterY })
        const typeDefine = defines.getTerrainDefine(type)

        const resourcesSet = utils.getRandomInArray(typeDefine.resources)
        const hex = hexTerrain({
          type,
          id: ID,
          radius: opts.radius,
          x,
          y,
          typeDefine,
          resources: resourcesSet,
        })

        terrain.addChild(hex)
        APP.terrain.push({
          id: ID,
          x: counterX,
          y: counterY,
          isColonizable: typeDefine.isColonizable,
          isAccessible: typeDefine.isAccessible,
          isAttachable: typeDefine.isAttachable,
          isSpecialHex: typeDefine.isSpecialHex,
          owner: undefined,
          type,
          structure: undefined,
          city: undefined,
          resources: resourcesSet,
          units: undefined,
        })

        ID++
        counterX++
      }

      counterY++
      counterX = 0
    }

    counterY = 0

    APP.viewport?.addChild(terrain)
    APP.terrainContainer = terrain
  }

  const load = () => {
    APP.terrain.forEach((t1) => {
      const index = APP.terrain.indexOf(t1)
      const target = APP.terrainContainer?.children[index] as HistoryContainer

      // @ts-expect-error
      const fog = target.children.find((c) => c.type === 'fog')

      const setVisual = () => {
        if (fog) target.removeChild(fog)

        if (t1.owner) {
          const p = player.getPlayer(t1.owner)

          APP.setTerrainColor(p as HistoryPlayer, index, false)
          APP.setCitySprite(index, t1)
          APP.setSquadSprite(t1)
        }
      }

      if (
        APP.player &&
        t1.owner &&
        player.isKnownPlayer(APP.player, t1.owner)
      ) {
        setVisual()

        return
      }

      if (
        !player.isAdjacentTerritory(APP.player, t1) &&
        !player.getTerritories(APP.player).find((t2) => t1 === t2)
      ) {
        if (fog) target.removeChild(fog)

        const hex = factory.hexagon({
          type: 'fog',
          radius: OPTIONS.map.radius,
          color: 0x000000,
          colorAlpha: 0.8,
        })

        target.addChild(hex)
      } else {
        setVisual()
      }
    })
  }

  return { generateType, hexTerrain, hexOwner, create, load }
}
