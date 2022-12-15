import {
  HistoryBattle,
  HistoryBattleRoundPlayer,
  HistoryBattleRoundPlayerItem,
} from '../types/battle'
import { HistoryTerrain } from '../types/map'
import { HistoryUnitLineType, HistoryUnitType } from '../types/units'
import { useDefines } from './defines'

export const useBattle = () => {
  const defines = useDefines()

  const generateRandomBattle = (): HistoryBattle => {
    const battle: HistoryBattle = {
      terrainId: 0,
      isActive: true,
      attacker: {
        id: 1,
        x: 1,
        y: 1,
        isColonizable: true,
        isAccessible: true,
        isAttachable: true,
        isSpecialHex: true,
        owner: 'Player 1',
        type: 'forest',
        structure: undefined,
        city: undefined,
        resources: {
          food: 0,
          production: 0,
          science: 0,
          influence: 0,
          multipliers: {
            food: 0,
            production: 0,
            science: 0,
            influence: 0,
          },
        },
        units: defines.getUnits(),
      },
      defender: {
        id: 1,
        x: 1,
        y: 1,
        isColonizable: true,
        isAccessible: true,
        isAttachable: true,
        isSpecialHex: true,
        owner: 'Player 2',
        type: 'forest',
        structure: undefined,
        city: {
          name: defines.getRandomCityName(),
          resources: {
            influence: 0,
            food: 1,
            production: 1,
            science: 1,
            multipliers: {
              influence: 1.0,
              food: 1.0,
              production: 1.0,
              science: 1.0,
            },
          },
          structure: {
            townHall: 1,
            wall: 0,
            militaryAcademy: 1,
          },
        },
        resources: {
          food: 0,
          production: 0,
          science: 0,
          influence: 0,
          multipliers: {
            food: 0,
            production: 0,
            science: 0,
            influence: 0,
          },
        },
        units: defines.getUnits(),
      },
    }

    battle.attacker.units!.spearman.count = 24
    battle.attacker.units!.archer.count = 0
    battle.attacker.units!.catapult.count = 10
    battle.attacker.units!.dragon.count = 2

    battle.defender.units!.spearman.count = 40
    battle.defender.units!.archer.count = 60
    battle.defender.units!.catapult.count = 10
    battle.defender.units!.dragon.count = 10

    return battle
  }

  const splitUnitsByStack = (count: number, stack: number): number[] => {
    const arr: number[] = []
    let counter = 0

    while (count > 0) {
      if (counter >= stack) {
        arr.push(counter)

        counter = 0
      }

      count--
      counter++
    }

    if (counter > 0) arr.push(counter)

    return arr
  }

  const getUnitsCounter = (
    terrain: HistoryTerrain,
    type: 'attacker' | 'defender'
  ): HistoryBattleRoundPlayer => {
    const units =
      type === 'attacker'
        ? [
            ['dragon', 'extra', terrain.units!.dragon.count],
            ['catapult', 'destruction_line', terrain.units!.catapult.count],
            ['archer', 'back_line', terrain.units!.archer.count],
            ['spearman', 'front_line', terrain.units!.spearman.count],
          ]
        : [
            ['spearman', 'front_line', terrain.units!.spearman.count],
            ['archer', 'back_line', terrain.units!.archer.count],
            ['catapult', 'destruction_line', terrain.units!.catapult.count],
            ['dragon', 'extra', terrain.units!.dragon.count],
          ]

    if (type === 'defender' && terrain.city)
      units.unshift([
        terrain.city.structure.wall > 0 ? 'wall' : 'barrier',
        'wall',
        3,
      ])

    return units as HistoryBattleRoundPlayer
  }

  const getLineSequence = (
    context: HistoryBattleRoundPlayer
  ): HistoryUnitLineType | false => {
    const asFrontLine = asType(context, 'front_line')

    if (!asFrontLine) {
      const asBackLine = asType(context, 'back_line')

      if (!asBackLine) {
        const asDestructionLine = asType(context, 'destruction_line')

        if (!asDestructionLine) {
          const asExtraLine = asType(context, 'destruction_line')

          if (!asExtraLine) {
            return false
          } else {
            return 'extra'
          }
        } else {
          return 'destruction_line'
        }
      } else {
        return 'back_line'
      }
    }

    return 'front_line'
  }

  const asType = (
    context: HistoryBattleRoundPlayer,
    type: HistoryUnitLineType
  ) => {
    return context.find(([_, target]) => {
      if (target === type) return true

      return false
    })
  }

  const damageInWall = (
    context: HistoryBattleRoundPlayer,
    isBarrier: boolean
  ) => {
    let val = 0

    context.forEach((c) => {
      const [type, line, count] = c

      const maxCount = getMaxCountByStack(count, type)

      if (line === 'destruction_line') {
        if (type === 'catapult') {
          const dmg = defines.getUnits().catapult.attack * maxCount

          isBarrier ? (val += dmg * 2) : (val += dmg)
        }
      } else {
        if (isBarrier) {
          if (type === 'spearman')
            val += (defines.getUnits().spearman.attack * maxCount) / 2
          if (type === 'archer')
            val += (defines.getUnits().archer.attack * maxCount) / 2
          if (type === 'dragon')
            val += (defines.getUnits().dragon.attack * maxCount) / 2
        } else {
          val += maxCount
        }
      }
    })

    return val
  }

  const damageInUnits = (context: HistoryBattleRoundPlayer) => {
    let val = 0

    context.forEach((c) => {
      const [type, line, count] = c

      const maxCount = getMaxCountByStack(count, type)

      if (line === 'destruction_line') {
        val += maxCount
      } else {
        if (type === 'spearman')
          val += defines.getUnits().spearman.attack * maxCount
        if (type === 'archer')
          val += defines.getUnits().archer.attack * maxCount
        if (type === 'dragon')
          val += defines.getUnits().dragon.attack * maxCount
      }
    })

    return val
  }

  const damageInUnitsWithWall = (context: HistoryBattleRoundPlayer) => {
    let val = 0

    context.forEach((c) => {
      const [type, line, count] = c

      const maxCount = getMaxCountByStack(count, type)

      if (line === 'destruction_line') {
        val += maxCount
      } else {
        if (type === 'spearman')
          val += defines.getUnits().spearman.attack * maxCount
        if (type === 'archer')
          val += defines.getUnits().archer.attack * maxCount
        if (type === 'dragon')
          val += defines.getUnits().dragon.attack * maxCount
      }
    })

    return val
  }

  const wallSet = (
    [type, line, count]: HistoryBattleRoundPlayerItem,
    damage: number,
    wallLevel: number
  ) => {
    const define =
      wallLevel > 0 ? defines.getWallDefine() : defines.getBarrierDefine()

    const kill = Number((damage / define.HP[wallLevel]).toFixed(0))

    if (kill >= count) {
      return true
    }

    return kill
  }

  const getHPByType = (type: HistoryUnitType) => {
    const units = defines.getUnits()

    // @ts-expect-error
    const target: HistoryUnit<type> = units[type]

    return target.HP
  }

  const killUnits = (damage: number, context: HistoryBattleRoundPlayer) => {
    let [[type, line, count]] = context

    const total = damage / getHPByType(type)

    if (total >= count) {
      context.splice(0, 1)
    } else {
      const newValue = (count -= total)

      context.splice(0, 1)
      context.unshift([type, line, newValue])
    }

    return context
  }

  const getStack = (type: HistoryUnitType): number => {
    const unit = defines.getUnits() as Record<any, any>

    if (type === 'wall' || type === 'barrier') return 1

    return unit[type].stack
  }

  const getMaxCountByStack = (count: number, type: HistoryUnitType) => {
    const stack = getStack(type) * 3

    return count <= stack ? count : stack
  }

  const getCounterUnitsInContext = (context: HistoryBattleRoundPlayer) => {
    return context.reduce((sum, val) => {
      return (sum += val[2])
    }, 0)
  }

  return {
    generateRandomBattle,
    splitUnitsByStack,
    getUnitsCounter,
    getLineSequence,
    asType,
    damageInWall,
    damageInUnits,
    damageInUnitsWithWall,
    wallSet,
    killUnits,
    getStack,
    getMaxCountByStack,
    getCounterUnitsInContext,
  }
}
