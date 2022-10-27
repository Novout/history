import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'

export const useOptionsState = defineStore('options', {
  state: (): OptionsState => ({
    map: {
      height: import.meta.env.PROD ? 8 : 6,
      width: import.meta.env.PROD ? 30 : 6,
      type: 'pangea',
      radius: 100,
    },
    game: {
      players: import.meta.env.PROD ? 5 : 3,
    },
    debug: import.meta.env.DEV,
  }),
})
