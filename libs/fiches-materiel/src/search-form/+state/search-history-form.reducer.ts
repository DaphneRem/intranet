import { SearchHistoryFormInterface } from './search-history-form.interfaces';
import { SearchHistoryFormAction } from './search-history-form.actions';
import { SearchHistoryFormInitialState } from './search-history-form.init';

export function searchHistoryFormReducer(
  state: SearchHistoryFormInterface,
  action: SearchHistoryFormAction
): SearchHistoryFormInterface {
  switch (action.type) {
    case 'ADD_SEARCH_HISTORY-FORM': {
      console.log(state);
      console.log(action.payload);
      state = { ...action.payload };
      return state;
    }
    case 'RESET_SEARCH_HISTORY-FORM': {
      console.log(state);
      console.log(action.payload);
      state = SearchHistoryFormInitialState;
      return state;
    }
    default: {
      return state;
    }
  }
}
