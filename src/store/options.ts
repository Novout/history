import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'

export const useOptionsState = defineStore('options', {
  state: (): OptionsState => ({
    map: {
      height: import.meta.env.PROD ? 8 : 8,
      width: import.meta.env.PROD ? 30 : 10,
      type: 'pangea',
      radius: 100,
    },
    game: {
      players: import.meta.env.PROD ? 5 : 3,
    },
    debug: import.meta.env.DEV,
  }),
})
