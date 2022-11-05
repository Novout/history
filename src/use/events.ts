import { useToast } from 'vue-toastification'
import { useApplicationStore } from '../store/application'
import { usePlayer } from './player'

export const useEvents = () => {
  const APP = useApplicationStore()

  const player = usePlayer()
  const toast = useToast()

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
            t.units = t.units?.owner === p.name ? t.units : undefined
          }
        })

        if (p.isIA) toast.success(`Jogador ${p.name} foi derrotado!`)
      }
    })
  }

  return { setKnownPlayers, defeatedPlayer }
}
