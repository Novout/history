export type HistoryActions =
  | '_'
  | 'ANNEX'
  | 'COLONIZE'
  | 'CREATE_OR_UPGRADE_CITY'
  | 'NEW_STRUCTURE'
  | 'CREATE_SQUAD'
  | 'RECRUIT_UNITS'

export type HistoryActionsItem = [HistoryActions, number]
