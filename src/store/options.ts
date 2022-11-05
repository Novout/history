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
      playersCount: 3,
      player: {
        name: 'Player 1',
        color: useUtils().getRandomColor(),
        capital: useDefines().getRandomCityName(),
      },
      barbarians: 1,
    },
    debug: import.meta.env.DEV,
  }),
})
