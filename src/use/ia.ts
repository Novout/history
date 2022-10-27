import { useApplicationStore } from '../store/application'
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

  const getFactor = (arr: any[]) => {
    return arr.reduce(
      (t, val) => {
        const max = Math.max(t[1], val[1])

        return max === val[1] ? val : t
      },
      ['_', -Infinity]
    )
  }

  const runFactors = (p: HistoryPlayer) => {
    if (!p.isIA) return

    let arr = Object.entries(defines.getIAType(p.isIA as HistoryPlayerIA))

    while (arr.length !== 0) {
      const factor = getFactor(arr)
      const index = arr.indexOf(factor)

      arr.splice(index, 1)

      switch (factor[0]) {
        case 'COLONIZE_TERRAIN':
          const terrain: HistoryTerrain = utils.getRandomInArray(
            player.getAllAdjacentTerritories(p)
          )
          APP.annex(p, terrain)
          break
        case 'CREATE_CITY':
          break
        case 'UPGRADE_CITY':
          break
      }
    }
  }

  return { getFactor, runFactors }
}
