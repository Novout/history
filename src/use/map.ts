import { Container, filters, Graphics, Loader, Sprite, Text } from "pixi.js";
import { useApplicationStore } from "../store/application";
import { HistoryContainer, HistoryGraphics, HistorySpriteHexagonOptions } from "../types/sprite";
import { HistoryMapCreateOptions, HistoryMapHexagonCreateOptions, HistoryTerrain, HistoryTerrainGenerate, HistoryTerrainType } from "../types/map";
import { nextTick } from "vue";
import { useOptionsState } from "../store/options";
import { useUtils } from "./utils";
import { useDefines } from "./defines";
import { Coordinates } from "../types/utils";

export const useMap = () => {
  const APP = useApplicationStore()
  const OPTIONS = useOptionsState()

  const utils = useUtils()
  const defines = useDefines()
  const loader = Loader.shared

  const generateType = ({ y }: Coordinates): HistoryTerrainType => {
    const define = defines.getTerrainGenerateDefine(OPTIONS.map.type)

    const random = utils.getRandomPercentage()

    if(OPTIONS.map.type === 'pangea') {
      if((y <= define.snow[0] && random > define.snow[1]) || (((OPTIONS.map.height - 1) - define.snow[0]) <= y && random > define.snow[1])) {
        return 'snow'
      }

      if((y <= define.tundra[0] && random > define.tundra[1]) || (((OPTIONS.map.height - 1) - define.tundra[0]) <= y && random > define.tundra[1])) {
        return 'tundra'
      }

      if(random > define.plain) {
        return 'plain'
      }
      
      if(random > define.forest) {
        return 'forest'
      } 

      return 'water'
    }

    return 'plain'
  }

  const hexTerrain = (options: HistoryMapHexagonCreateOptions): HistoryContainer => {
    const toFixedPosition = (pos: { x: number, y: number }) => {
      const newP = { x: 0, y: 0 };
      let xIdx = Math.round(pos.x / (options.radius * (3 / 2)));
      newP.x = xIdx * (options.radius * (3 / 2));
      if (xIdx % 2) {
        newP.y = Math.floor(pos.y / (hexagonHeight)) * hexagonHeight + hexagonHeight / 2; 
      } else {
        newP.y = Math.round(pos.y / (hexagonHeight)) * hexagonHeight;
      }
      
      return newP;
    }

    const target: HistoryContainer = new Container();

    const bg: HistoryGraphics = new Graphics();
    bg.beginFill(Number(options.typeDefine.backgroundColor));

    const hexagonHeight = options.radius * Math.sqrt(3);
    bg.drawPolygon([
      -options.radius, 0,
      -options.radius/2, hexagonHeight/2,
      options.radius/2, hexagonHeight/2,
      options.radius, 0,
      options.radius/2, -hexagonHeight/2,
      -options.radius/2, -hexagonHeight/2,
    ])
    bg.endFill();
    target.addChild(bg);

    const { x, y } = toFixedPosition({ x: options.x, y: options.y })
    target.x = x;
    target.y = y;
    target.id = options.id
    target.interactive = true;
    target.buttonMode = true;
    target.on('click', async (e) => {
      APP.actives.terrain = e.target.id

      await nextTick

      APP.absolute.terrainInfo = true
    })

    if(options.type === 'forest') {
      const tree1: HistoryGraphics = new Graphics();

      tree1.beginFill(Number(options.typeDefine.borderColor), 1);
      tree1.lineStyle(0, Number(options.typeDefine.borderColor), 1);
      tree1.moveTo(30, 0);
      tree1.lineTo(15, 30); 
      tree1.lineTo(0, 0);
      tree1.lineTo(15, 0);
      tree1.endFill();
      tree1.rotation = 3
      tree1.x = 30
      tree1.y = 30

      const tree2: HistoryGraphics = new Graphics();

      tree2.beginFill(Number(options.typeDefine.borderColor), 1);
      tree2.lineStyle(0, Number(options.typeDefine.borderColor), 1);
      tree2.moveTo(30, 0);
      tree2.lineTo(15, 30); 
      tree2.lineTo(0, 0);
      tree2.lineTo(15, 0);
      tree2.endFill();
      tree2.rotation = 3
      tree2.x = -20
      tree2.y = 0

      const tree3: HistoryGraphics = new Graphics();

      tree3.beginFill(Number(options.typeDefine.borderColor), 1);
      tree3.lineStyle(0, Number(options.typeDefine.borderColor), 1);
      tree3.moveTo(30, 0);
      tree3.lineTo(15, 30); 
      tree3.lineTo(0, 0);
      tree3.lineTo(15, 0);
      tree3.endFill();
      tree3.rotation = 3
      tree3.x = 40
      tree3.y = -20

      const tree4: HistoryGraphics = new Graphics();

      tree4.beginFill(Number(options.typeDefine.borderColor), 1);
      tree4.lineStyle(0, Number(options.typeDefine.borderColor), 1);
      tree4.moveTo(30, 0);
      tree4.lineTo(15, 30); 
      tree4.lineTo(0, 0);
      tree4.lineTo(15, 0);
      tree4.endFill();
      tree4.rotation = 3
      tree4.x = 10
      tree4.y = 0

      const tree5: HistoryGraphics = new Graphics();

      tree5.beginFill(Number(options.typeDefine.borderColor), 1);
      tree5.lineStyle(0, Number(options.typeDefine.borderColor), 1);
      tree5.moveTo(30, 0);
      tree5.lineTo(15, 30); 
      tree5.lineTo(0, 0);
      tree5.lineTo(15, 0);
      tree5.endFill();
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
    // @ts-expect-error
    const productionIcon = Sprite.from(loader.resources['icon_production'].texture)
    productionIcon.x = -26
    productionIcon.tint = 0xFFFFFF
    production.addChild(productionIcon)
    const productionValue = new Text(String(options.resources.production), {
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0xE0B14A,
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
      fontSize: 16,
      fill: 0xE0B14A,
      align: 'center',
    })
    food.addChild(foodValue)

    target.addChild(production)
    target.addChild(food)

    if(OPTIONS.debug) {
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
    const toFixedPosition = (pos: { x: number, y: number }) => {
      const newP = { x: 0, y: 0 };
      let xIdx = Math.round(pos.x / (OPTIONS.map.radius * (3 / 2)));
      newP.x = xIdx * (OPTIONS.map.radius * (3 / 2));
      if (xIdx % 2) {
        newP.y = Math.floor(pos.y / (hexagonHeight)) * hexagonHeight + hexagonHeight / 2; 
      } else {
        newP.y = Math.round(pos.y / (hexagonHeight)) * hexagonHeight;
      }
      
      return newP;
    }

    const target: HistoryContainer = new Graphics();

    const bg: HistoryGraphics = new Graphics();
    bg.beginFill(options.backgroundColor);
    bg.filters = [new filters.AlphaFilter(0.4)]

    const hexagonHeight = OPTIONS.map.radius * Math.sqrt(3);
    bg.drawPolygon([
      -OPTIONS.map.radius, 0,
      -OPTIONS.map.radius/2, hexagonHeight/2,
      OPTIONS.map.radius/2, hexagonHeight/2,
      OPTIONS.map.radius, 0,
      OPTIONS.map.radius/2, -hexagonHeight/2,
      -OPTIONS.map.radius/2, -hexagonHeight/2,
    ])
    bg.endFill();
    target.addChild(bg);

    const { x, y } = toFixedPosition({ x: options.x, y: options.y })
    target.x = x;
    target.y = y;
    target.id = options.id
    target.type = 'territory'
    target.interactive = true;
    target.buttonMode = true;
    target.on('click', async (e) => {
      APP.actives.terrain = e.target.id

      await nextTick

      APP.absolute.terrainInfo = true
    })

    return target
  }

  const create = (opts: HistoryMapCreateOptions) => {
    let counterX = 0
    let counterY = 0
    let ID = 0

    const terrain = new Container();

    for(let y = opts.radius * 2; counterY < opts.height; y += opts.radius * 1.8) {
      for(let x = opts.radius * 2; counterX < opts.width; x += opts.radius * 1.5) {
        const type = generateType({ x: counterX, y: counterY })
        const typeDefine = defines.getTerrainDefine(type)

        const resourcesSet = utils.getRandomInArray(typeDefine.resources)
        const hex = hexTerrain({ type, id: ID, radius: opts.radius, x, y, typeDefine, resources: resourcesSet })

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
          troops: {}
        })

        ID++
        counterX++
      }

      counterY++
      counterX = 0
    }

    counterY = 0

    APP.viewport?.addChild(terrain);
    APP.terrainContainer = terrain;
  }

  return { generateType, hexTerrain, hexOwner, create }
}