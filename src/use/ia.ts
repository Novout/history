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
    if (!p.isIA) return

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
            player.getTerritories(p).filter((p) => !p.city)
          )
          if (cc) APP.createCity(p, cc.id, false)
          break
        case 'UPGRADE_CITY':
          const uc: HistoryTerrain = utils.getRandomInArray(
            player.getTerritories(p).filter((p) => p.city)
          )
          if (uc) APP.upgradeCity(p, uc)
          break
      }
    }
  }

  return { getFactor, runFactors }
}
