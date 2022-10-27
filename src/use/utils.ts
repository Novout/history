import { BaseTexture, Texture } from 'pixi.js'
import { useApplicationStore } from '../store/application'
import { HistoryTerrain } from '../types/map'

export const useUtils = () => {
  const APP = useApplicationStore()

  const getRandomTerrainID = (
    forceOwner: boolean = false,
    ignoreNotColonizableTerrain: boolean = true
  ): number => {
    const terrain = APP.terrain[Math.floor(Math.random() * APP.terrain.length)]

    if (!forceOwner) {
      if (terrain.owner) return getRandomTerrainID()
    }

    if (ignoreNotColonizableTerrain && !terrain.isColonizable) {
      return getRandomTerrainID()
    }

    return terrain.id
  }

  const getRandomInArray = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const getRandomColor = (): number => {
    const hex = Math.floor(Math.random() * 16777215)
      .toString(16)
      .replace('#', '')

    const hexToNumber = '0x' + hex

    return Number(hexToNumber)
  }

  const loadImage = (url: string) => {
    const img = new Image()
    img.src = url

    const base = new BaseTexture(img)
    const texture = new Texture(base)

    return texture
  }

  const isAdjacentHex = (
    hex1: HistoryTerrain,
    hex2: HistoryTerrain
  ): boolean => {
    const case1 = hex1.x === hex2.x && hex1.y - 1 === hex2.y
    const case2 = hex1.x + 1 === hex2.x && hex1.y === hex2.y
    const case3 = hex1.x + 1 === hex2.x && hex1.y + 1 === hex2.y
    const case4 = hex1.x === hex2.x && hex1.y + 1 === hex2.y
    const case5 = hex1.x - 1 === hex2.x && hex1.y + 1 === hex2.y
    const case6 = hex1.x - 1 === hex2.x && hex1.y === hex2.y

    return case1 || case2 || case3 || case4 || case5 || case6
  }

  const getRandomPercentage = (): number => {
    return Math.round(Math.random() * 99) + 1
  }

  return {
    loadImage,
    getRandomTerrainID,
    getRandomInArray,
    getRandomColor,
    isAdjacentHex,
    getRandomPercentage,
  }
}
