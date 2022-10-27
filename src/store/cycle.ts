import { defineStore } from 'pinia'
import { CycleState } from '../types/stores'

export const useCycleState = defineStore('cycle', {
  state: (): CycleState => ({
    started: false,
    round: 1,
  }),
})
