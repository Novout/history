import { defineStore } from 'pinia'
import { GlobalState } from '../types/stores'
import { useBattleStore } from './battle'
import { useCycleState } from './cycle'
import { useOptionsState } from './options'
import { useApplicationStore } from './application'

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({}),
  actions: {
    reset() {
      useCycleState().$reset()
      useBattleStore().$reset()
      useOptionsState().$reset()
      useApplicationStore().$reset()
    },
  },
})
