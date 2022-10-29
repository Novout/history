import { useToast } from 'vue-toastification'
import { useApplicationStore } from '../store/application'
import { usePlayer } from './player'

export const useEvents = () => {
  const APP = useApplicationStore()

  const player = usePlayer()
  const toast = useToast()

  const setKnownPlayers = () => {
    player.getAllAdjacentTerritories(APP.player).forEach((t) => {
      if (t.owner && !APP.player?.knownPlayers.includes(t.owner)) {
        APP.player?.knownPlayers.push(t.owner)
      }
    })
  }

  const defeatedPlayer = () => {
    APP.IA.forEach((p) => {
      if (player.getCityTerritories(p).length === 0) {
        p.isAlive = false

        APP.terrain.forEach((t) => {
          if (t.owner === p.name) {
            t.owner = undefined
            t.structure = undefined
            t.city = undefined
          }
        })

        toast.success(`Jogador ${p.name} foi derrotado!`)
      }
    })
  }

  return { setKnownPlayers, defeatedPlayer }
}
