import { defineStore } from 'pinia'
import { CycleState } from '../types/stores'

export const useCycleState = defineStore('cycle', {
  state: (): CycleState => ({
    exists: true,
    started: false,
    round: 1,
  }),
})
