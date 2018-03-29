import { LastSearch } from './support-search.interfaces';
import { LastSearchAction } from './support-search.actions';

export function lastSearchReducer(
  state: LastSearch,
  action: LastSearchAction
) {
  //  console.log('ACTION:', action.type, action.payload, state);
  switch (action.type) {
    case 'ERROR_SEARCH': {
      console.log('error=true');
      return (state = {...action.payload, error : true});
    }
    case 'NO_ERROR_SEARCH': {
      console.log('error=false');
      return (state = { ...action.payload, error: false });
    }
    default: {
      return state;
    }
  }
}
