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
      if (player.getTerritories(p).length === 0) {
        toast.success(`Jogador ${p.name} foi derrotado!`)

        p.isAlive = false
      }
    })
  }

  return { setKnownPlayers, defeatedPlayer }
}
