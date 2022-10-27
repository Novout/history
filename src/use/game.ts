import { useApplicationStore } from '../store/application'
import { useCycleState } from '../store/cycle'
import { useOptionsState } from '../store/options'
import { HistoryPlayer } from '../types/player'
import { useMap } from './map'
import { usePlayer } from './player'
import { useUtils } from './utils'
import { useIA } from './ia'

export const useGame = () => {
  const APP = useApplicationStore()
  const OPTIONS = useOptionsState()
  const CYCLE = useCycleState()

  const utils = useUtils()
  const map = useMap()
  const player = usePlayer()
  const ia = useIA()

  const start = () => {
    map.create(OPTIONS.map)

    APP.setNewPlayer({
      name: 'Player 1',
      color: 0xff0000,
      isIA: false,
      isAlive: true,
      resources: {
        influence: 5,
        food: 5,
        production: 5,
        science: 2,
      },
      militaryCapability: 0,
      cityLimit: 2,
      influenceBase: 2,
    })

    for (let i = 1; i < OPTIONS.game.players; i++) {
      APP.setNewPlayer({
        name: `Player ${i + 1}`,
        color: utils.getRandomColor(),
        isIA: 'default',
        isAlive: true,
        resources: {
          influence: 5,
          food: 5,
          production: 5,
          science: 2,
        },
        militaryCapability: 0,
        cityLimit: 2,
        influenceBase: 2,
      })
    }
  }

  const next = () => {
    APP.IA.forEach((p) => {
      ia.runFactors(p)

      runActions(p)
    })

    runActions(APP.player as HistoryPlayer)

    CYCLE.round++
  }

  const runActions = (p: HistoryPlayer) => {
    p.resources.food += player.getFood(p)
    p.resources.production += player.getProduction(p)
    p.resources.influence += player.getInfluence(p)
    p.resources.science += player.getScience(p)
  }

  return { start, next }
}
