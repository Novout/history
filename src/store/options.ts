import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'

export const useOptionsState = defineStore('options', {
  state: (): OptionsState => ({
    map: { height: 8, width: 8, type: 'default', radius: 100 },
    game: {
      players: 3
    },
    debug: import.meta.env.DEV
  }),
})