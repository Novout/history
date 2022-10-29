export type HistoryActions =
  | '_'
  | 'ANNEX'
  | 'COLONIZE'
  | 'CREATE_OR_UPGRADE_CITY'
  | 'NEW_STRUCTURE'
export type HistoryActionsItem = [HistoryActions, number]
