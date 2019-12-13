export interface AddSearchHistoryFormAction {
  type: 'ADD_SEARCH_HISTORY-FORM';
  payload: {
    SuiviPar: string;
    TitreEpisodeVO: string;
    TitreEpisodeVF: string;
    isarchived: number;
    distributeur: string;
    numficheachat: string;
  };
}

export interface ResetSearchHistoryFormAction {
  type: 'RESET_SEARCH_HISTORY-FORM';
  payload: {};
}

export type SearchHistoryFormAction = AddSearchHistoryFormAction | ResetSearchHistoryFormAction;

