import { defineStore } from 'pinia'
import { BattleState } from '../types/stores'
import { useApplicationStore } from './application'

export const useBattleStore = defineStore('battle', {
  state: (): BattleState => ({
    battles: [],
  }),
  getters: {
    getPlayerBattles(state) {
      return state.battles.filter(
        ({ attacker, defender }) =>
          attacker === useApplicationStore().player?.name ||
          defender === useApplicationStore().player?.name
      )
    },
  },
})
