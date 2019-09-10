import { DatatableFilteredData } from './datatable-filtered-data.interfaces';
import { DatatableFilteredDataActions } from './datatable-filtered-data.actions';

export function datatableFilteredDataReducer(
  state: DatatableFilteredData,
  action: DatatableFilteredDataActions
): DatatableFilteredData {
  switch (action.type) {
    case 'ADD_DATATABLE_FILTER_DATA': {
      console.log(state);
      console.log(action.payload);
      state = { ...action.payload };
      return state;
    }
    case 'DELETE_DATATABLE_FILTER_DATA': {
      console.log(state);
      console.log(action.payload);
      state = {
        searchDatatableData: ''
      };
      return state;
    }
    default: {
      return state;
    }
  }
}
