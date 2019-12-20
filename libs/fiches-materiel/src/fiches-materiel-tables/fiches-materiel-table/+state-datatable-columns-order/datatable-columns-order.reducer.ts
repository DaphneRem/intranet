import { DatatableColumnsOrder } from './datatable-columns-order.interface';
import { DatatableColumnsOrderActions } from './datatable-columns-order.actions';

export function datatableColumnsOrderReducer(
  state: DatatableColumnsOrder,
  action: DatatableColumnsOrderActions
): DatatableColumnsOrder {
  switch (action.type) {
    case 'ADD_DATATABLE_COLUMS_ORDER': {
      console.log(state);
      console.log(action.payload);
      state = { ...action.payload };
      return state;
    }
    case 'DELETE_DATATABLE_COLUMNS_ORDER': {
      console.log(state);
      console.log(action.payload);
      state = {
        columnsDatatableOrder: [],
      };
      return state;
    }
    default: {
      return state;
    }
  }
}
