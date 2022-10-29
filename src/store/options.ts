import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'

export const useOptionsState = defineStore('options', {
  state: (): OptionsState => ({
    map: {
      size: 'small',
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
