import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'

export const useOptionsState = defineStore('options', {
  state: (): OptionsState => ({
    map: {
      height: import.meta.env.PROD ? 8 : 6,
      width: import.meta.env.PROD ? 30 : 8,
      type: 'pangea',
      radius: 100,
    },
    game: {
      playersCount: import.meta.env.PROD ? 5 : 3,
      player: {
        name: 'Player 1',
        color: '#00CCCC',
        capital: 'Alexandria',
      },
    },
    debug: import.meta.env.DEV,
  }),
})
