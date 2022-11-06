import { useToast } from 'vue-toastification'
import { useApplicationStore } from '../store/application'
import { useMap } from './map'
import { usePlayer } from './player'

export const useEvents = () => {
  const APP = useApplicationStore()

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
      }
    })
  }

  return { setKnownPlayers, defeatedPlayer }
}
