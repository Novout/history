import { defineStore } from 'pinia'
import { HistoryBattle } from '../types/battle'
import { BattleState } from '../types/stores'
import { useBattle } from '../use/battle'
import { useApplicationStore } from './application'

export const useBattleStore = defineStore('battle', {
  state: (): BattleState => ({
    battles: [],
  }),
  actions: {
    runBattles() {
      this.battles?.forEach((battle) => {
        if (!battle.isActive) return

        if (!battle.round) {
          const attacker = useBattle().getUnitsCounter(battle.attacker)
          const defender = useBattle().getUnitsCounter(battle.defender)

          battle.round = {
            value: 1,
            attacker,
            defender,
          }
        }

        const asWall = useBattle().asType(battle.round.defender, 'wall')

        const attackerDmg = asWall
          ? useBattle().damageInWall(battle.round.attacker)
          : useBattle().damageInUnits(battle.round.attacker)
        const defenderDmg = asWall
          ? useBattle().damageInUnitsWithWall(battle.round.defender)
          : useBattle().damageInUnits(battle.round.defender)

        if (asWall) {
          const result = useBattle().wallSet(
            battle.round.defender[0],
            attackerDmg,
            battle.defender.city!.structure.wall
          )

          if (result === true) {
            battle.round.defender = battle.round.defender.filter(
              (d) => d[1] !== 'wall'
            )
          } else {
            battle.round.defender.map((d) => {
              if (d[1] === 'wall') {
                let _ = d

                _[2] -= result

                return _
              }
            })
          }
        } else {
          battle.round.defender = useBattle().killUnits(
            attackerDmg,
            battle.round.defender
          )
        }

        battle.round.attacker = useBattle().killUnits(
          defenderDmg,
          battle.round.attacker
        )

        if (battle.round.attacker.length === 0) {
          battle.isActive = false
          battle.owner = battle.defender.units?.owner

          useApplicationStore().terrain[battle.attacker.id].units = undefined

          return
        }

        if (battle.round.defender.length === 0) {
          battle.isActive = false
          battle.owner = battle.attacker.units?.owner

          useApplicationStore().terrain[battle.defender.id].units = undefined

          return
        }

        battle.round.value++
      })
    },
  },
  getters: {
    getPlayerBattles(state) {
      return state.battles.filter(
        ({ attacker, defender }) =>
          attacker.units?.owner === useApplicationStore().player?.name ||
          defender.units?.owner === useApplicationStore().player?.name
      )
    },
  },
})
