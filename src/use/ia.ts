import { useApplicationStore } from '../store/application'
import { HistoryActionsItem } from '../types/actions'
import { HistoryTerrain } from '../types/map'
import { HistoryPlayer, HistoryPlayerIA } from '../types/player'
import { useDefines } from './defines'
import { usePlayer } from './player'
import { useUtils } from './utils'

export const useIA = () => {
  const APP = useApplicationStore()

  const utils = useUtils()
  const player = usePlayer()
  const defines = useDefines()

  const getFactor = (arr: HistoryActionsItem[]): HistoryActionsItem => {
    return arr.reduce(
      (t, val) => {
        if (t[1] === val[1]) return utils.getRandomInArray([t, val])

        const max = Math.max(t[1], val[1])

        return max === val[1] ? val : t
      },
      ['_', -Infinity]
    )
  }

  const runFactors = (p: HistoryPlayer) => {
    if (!p.isIA || p.isBarbarian) return

    const arr = Object.entries(
      defines.getIAType(p.isIA as HistoryPlayerIA)
    ) as HistoryActionsItem[]

    while (arr.length !== 0) {
      const factor = getFactor(arr)
      const index = arr.indexOf(factor)

      arr.splice(index, 1)

      switch (factor[0]) {
        case 'ANNEX':
          const territories = player
            .getAllAdjacentTerritories(p)
            ?.filter((t) => t.isAttachable && !t.owner)

          if (territories) {
            const bestCase = territories[0]
              ? player.getBestCaseTerritory(territories)
              : false

            if (bestCase) APP.annex(p, bestCase)
          }
          break
        case 'COLONIZE':
          const cc: HistoryTerrain = utils.getRandomInArray(
            player.getTerritories(p).filter((pc) => !pc.city && !pc.owner)
          )
          if (cc) APP.createCity(p, cc.id, false)
          break
        case 'CREATE_OR_UPGRADE_CITY':
          const uc: HistoryTerrain = utils.getRandomInArray(
            player.getTerritories(p).filter((p) => p.city)
          )
          if (uc) APP.upgradeCity(p, uc)
          break
        case 'NEW_STRUCTURE':
          const ns: HistoryTerrain = utils.getRandomInArray(
            player.getTerritories(p).filter((p) => !p.city && !p.structure)
          )
          if (ns)
            APP.setStructure(
              p,
              utils.getRandomInArray(['farm', 'lumber', 'academic_center']),
              ns
            )
          break
        case 'CREATE_SQUAD':
          const cs = utils.getRandomInArray(
            player.getTerritories(p).filter((p) => p.city && !p.units)
          )

          // Only terrain cities and no units edge case
          if (!cs) return

          APP.createSquad(p, cs)
          break
        case 'RECRUIT_UNITS':
          const ru = utils.getRandomInArray(
            player
              .getTerritories(p)
              .filter((t) => t.city && t.units && t.units.owner === p.name)
          )

          const food = player.getFood(p)
          const production = player.getFood(p)

          if (food >= 2.0 && production >= 2.0 && ru) {
            APP.recruitUnits(p, ru, {
              spearman: Math.floor(Math.random() * 3),
              archer: Math.floor(Math.random() * 2),
              catapult: Math.floor(Math.random() * 1),
              dragon: 0,
            } as any)
          }

          break
      }
    }
  }

  return { getFactor, runFactors }
}
