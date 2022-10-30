import { HistoryResourcesBase } from '../types/map'
import { HistoryUnitType } from '../types/units'
import UNIT_ARCHER_DEFINE from '../defines/units/archer.json'
import UNIT_SPEARMAN_DEFINE from '../defines/units/spearman.json'
import UNIT_DRAGON_DEFINE from '../defines/units/dragon.json'
import UNIT_CATAPULT_DEFINE from '../defines/units/catapult.json'

export const useUnits = () => {
  const getRecruitCost = (
    units: Record<HistoryUnitType, number>
  ): HistoryResourcesBase => {
    const cost = {
      influence: 0,
      production: 0,
      food: 0,
      science: 0,
    } as HistoryResourcesBase

    cost.influence +=
      units.spearman * UNIT_SPEARMAN_DEFINE.cost.influence +
      units.archer * UNIT_ARCHER_DEFINE.cost.influence +
      units.catapult * UNIT_CATAPULT_DEFINE.cost.influence +
      units.dragon * UNIT_DRAGON_DEFINE.cost.influence
    cost.production +=
      units.spearman * UNIT_SPEARMAN_DEFINE.cost.production +
      units.archer * UNIT_ARCHER_DEFINE.cost.production +
      units.catapult * UNIT_CATAPULT_DEFINE.cost.production +
      units.dragon * UNIT_DRAGON_DEFINE.cost.production
    cost.food +=
      units.spearman * UNIT_SPEARMAN_DEFINE.cost.food +
      units.archer * UNIT_ARCHER_DEFINE.cost.food +
      units.catapult * UNIT_CATAPULT_DEFINE.cost.food +
      units.dragon * UNIT_DRAGON_DEFINE.cost.food
    cost.science +=
      units.spearman * UNIT_SPEARMAN_DEFINE.cost.science +
      units.archer * UNIT_ARCHER_DEFINE.cost.science +
      units.catapult * UNIT_CATAPULT_DEFINE.cost.science +
      units.dragon * UNIT_DRAGON_DEFINE.cost.science

    return cost
  }

  return { getRecruitCost }
}
