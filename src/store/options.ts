import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'

export const useOptionsState = defineStore('options', {
  state: (): OptionsState => ({
    map: { height: 6, width: 6, type: 'pangea', radius: 100 },
    game: {
      players: 3,
    },
    debug: import.meta.env.DEV,
  }),
})
