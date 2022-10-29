import { defineStore } from 'pinia'
import { OptionsState } from '../types/stores'
import { useDefines } from '../use/defines'
import { useUtils } from '../use/utils'

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
        color: useUtils().getRandomColor()[0],
        capital: useDefines().getRandomCityName(),
      },
    },
    debug: import.meta.env.DEV,
  }),
})
