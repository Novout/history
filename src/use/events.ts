import { useToast } from 'vue-toastification'
import { useApplicationStore } from '../store/application'
import { useCycleState } from '../store/cycle'
import { useMap } from './map'
import { usePlayer } from './player'

export const useEvents = () => {
  const APP = useApplicationStore()
  const CYCLE = useCycleState()

  const player = usePlayer()
  const toast = useToast()
  const map = useMap()

  const setKnownPlayers = () => {
    player.getAllAdjacentTerritories(APP.player).forEach((t) => {
      if (t.owner && !APP.player?.players.known.includes(t.owner)) {
        APP.player?.players.known.push(t.owner)
      }
    })
  }

  const defeatedPlayer = () => {
    player.getAllPlayers().forEach((p) => {
      if (player.getCityTerritories(p).length === 0 && p.isAlive) {
        p.isAlive = false

        APP.terrain.forEach((t) => {
          if (t.owner === p.name) {
            t.owner = undefined
            t.structure = undefined
            t.city = undefined
            t.units = t.units?.owner !== p.name ? t.units : undefined

            APP.resetTerrain(t)
          }
        })

        if (p.isIA) toast.success(`Jogador ${p.name} foi derrotado!`)

        map.load()

        setWinnerPlayer()
      }
    })
  }

  const setWinnerPlayer = () => {
    const lives = player.getAllPlayers().filter(p => p.isAlive && !p.isBarbarian)

    if(lives.length === 1) {
      const [target] = lives

      toast.success(`Jogador ${target.name} venceu!`)

      CYCLE.exists = false
    }
  }

  return { setKnownPlayers, defeatedPlayer }
}
