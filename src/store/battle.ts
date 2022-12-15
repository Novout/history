import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { HistoryBattle } from '../types/battle'
import { HistoryPlayer } from '../types/player'
import { BattleState } from '../types/stores'
import { useBattle } from '../use/battle'
import { usePlayer } from '../use/player'
import { useUtils } from '../use/utils'
import { useApplicationStore } from './application'

export const useBattleStore = defineStore('battle', {
  state: (): BattleState => ({
    battles: [],
  }),
  actions: {
    runBattles() {
      this.battles?.forEach((battle) => {
        if (!battle.isActive || !battle.round) return

        const asWall = useBattle().asType(battle.round.defender, 'wall')

        const attackerDmg = asWall
          ? useBattle().damageInWall(
              battle.round.attacker,
              battle.defender.city!.structure.wall === 0
            )
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

        const isADefeatedAttacker =
          useBattle().getCounterUnitsInContext(battle.round.attacker) === 0
        const isADefeatedDefender =
          useBattle().getCounterUnitsInContext(battle.round.defender) === 0

        if (isADefeatedAttacker) {
          battle.isActive = false
          battle.winner = battle.defender.units?.owner

          useApplicationStore().terrain[battle.attacker.id].units = undefined
          useApplicationStore().removeSquadSprite(battle.attacker)

          useApplicationStore().terrain[battle.defender.id].units!.inCombat =
            false

          if (battle.defender.owner === useApplicationStore().player?.name)
            useToast().success(`Você ganhou a batalha ${battle.defender.id}!`)
          if (battle.attacker.owner === useApplicationStore().player?.name)
            useToast().error(`Você perdeu a batalha em ${battle.defender.id}!`)

          return
        }

        if (isADefeatedDefender) {
          battle.isActive = false
          battle.winner = battle.attacker.units?.owner

          useApplicationStore().terrain[battle.defender.id].units = undefined
          useApplicationStore().removeSquadSprite(battle.defender)

          useApplicationStore().terrain[battle.attacker.id].units!.inCombat =
            false

          if (battle.defender.owner === useApplicationStore().player?.name)
            useToast().error(`Você perdeu a batalha em ${battle.defender.id}!`)
          if (battle.attacker.owner === useApplicationStore().player?.name)
            useToast().success(
              `Você ganhou a batalha em ${battle.defender.id}!`
            )

          if (useUtils().isAdjacentHex(battle.attacker, battle.defender))
            useApplicationStore().setTerrainOwner(
              usePlayer().getPlayer(battle.winner as string) as HistoryPlayer,
              battle.terrainId,
              false
            )

          useApplicationStore().moveSquad(battle.attacker, battle.defender)

          return
        }

        battle.round.value++
      })
    },
  },
  getters: {
    getPlayerBattles(state) {
      return state.battles.filter(
        ({ attacker, defender, winner }) =>
          (attacker.units?.owner === useApplicationStore().player?.name ||
            defender.units?.owner === useApplicationStore().player?.name) &&
          !winner
      )
    },
  },
})
