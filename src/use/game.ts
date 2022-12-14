import { useApplicationStore } from '../store/application'
import { useCycleState } from '../store/cycle'
import { useOptionsState } from '../store/options'
import { HistoryPlayer } from '../types/player'
import { useMap } from './map'
import { usePlayer } from './player'
import { useUtils } from './utils'
import { useIA } from './ia'
import { computed, watch } from 'vue'
import { useEvents } from './events'
import { watchThrottled } from '@vueuse/core'
import { useBattleStore } from '../store/battle'
import { useToast } from 'vue-toastification'
import { useNProgress } from '@vueuse/integrations/useNProgress'

export const useGame = () => {
  const APP = useApplicationStore()
  const OPTIONS = useOptionsState()
  const CYCLE = useCycleState()
  const BATTLE = useBattleStore()

  const utils = useUtils()
  const map = useMap()
  const player = usePlayer()
  const ia = useIA()
  const events = useEvents()
  const toast = useToast()
  const progress = useNProgress()

  const start = () => {
    map.create(OPTIONS.map)

    APP.setNewPlayer({
      name: OPTIONS.game.player.name,
      color: OPTIONS.game.player.color,
      isIA: false,
      isAlive: true,
      isBarbarian: false,
      players: {
        known: [],
        allies: [],
        enemies: [],
      },
      resources: {
        influence: import.meta.env.DEV ? 99999 : 5,
        food: import.meta.env.DEV ? 99999 : 30,
        production: import.meta.env.DEV ? 99999 : 30,
        science: import.meta.env.DEV ? 99999 : 2,
        multipliers: {
          influence: 1.0,
          food: 1.0,
          production: 1.0,
          science: 1.0,
        },
      },
      militaryCapability: import.meta.env.DEV ? 100 : 0,
      cityLimit: import.meta.env.DEV ? 100 : 3,
      influenceBase: import.meta.env.DEV ? 100 : 3,
    })

    for (let i = 0; i < OPTIONS.game.barbarians; i++) {
      APP.setNewPlayer({
        name: `Bárbaros ${i + 1}`,
        color: '#4A341C',
        isIA: 'barbarian',
        isBarbarian: true,
        isAlive: true,
        players: {
          known: [],
          allies: [],
          enemies: [],
        },
        resources: {
          influence: 5,
          food: 30,
          production: 30,
          science: 2,
          multipliers: {
            influence: 1.0,
            food: 1.0,
            production: 1.0,
            science: 1.0,
          },
        },
        militaryCapability: 0,
        cityLimit: 3,
        influenceBase: 3,
      })
    }

    for (let i = 1; i < OPTIONS.game.playersCount; i++) {
      APP.setNewPlayer({
        name: `Player ${i + 1}`,
        color: utils.getRandomColor(),
        isIA: 'default',
        isBarbarian: false,
        isAlive: true,
        players: {
          known: [],
          allies: [],
          enemies: [],
        },
        resources: {
          influence: 5,
          food: 30,
          production: 30,
          science: 2,
          multipliers: {
            influence: 1.0,
            food: 1.0,
            production: 1.0,
            science: 1.0,
          },
        },
        militaryCapability: 0,
        cityLimit: 3,
        influenceBase: 3,
      })
    }

    map.load()

    watchers()
  }

  const next = () => {
    if (!CYCLE.exists) {
      toast.error('O jogo já terminou!')

      return
    }

    progress.start()

    runEvents()

    BATTLE.runBattles()

    APP.IA.forEach((p) => {
      ia.runFactors(p)

      runActions(p)
    })

    runActions(APP.player as HistoryPlayer)

    CYCLE.round++

    runTerrainSets()

    if (progress.isLoading) progress.done()
  }

  const runEvents = () => {
    events.setKnownPlayers()
    events.defeatedPlayer()
  }

  const runActions = (p: HistoryPlayer) => {
    p.resources.food += player.getFood(p)
    p.resources.production += player.getProduction(p)
    p.resources.influence += player.getInfluence(p)
    p.resources.science += player.getScience(p)
  }

  const runTerrainSets = () => {
    APP.terrain.forEach((tr) => {
      if (tr.units) tr.units.wasMoved = false
    })
  }

  const watchers = () => {
    watchThrottled(
      APP.terrain,
      () => {
        map.load()
      },
      { deep: true, throttle: 500 }
    )

    watch(
      computed(() => CYCLE.round),
      () => {
        map.load()
      }
    )
  }

  return { start, next }
}
