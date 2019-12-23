export interface AddDatatableColumnsOrder {
  type: 'ADD_DATATABLE_COLUMS_ORDER';
  payload: {
    columnsDatatableOrder: [
      {
        column: 0,
        order: 'asc'
      }
    ]
  };
}

export interface DeleteDatatableColumnsOrder {
  type: 'DELETE_DATATABLE_COLUMNS_ORDER';
  payload: {};
}

export type DatatableColumnsOrderActions = AddDatatableColumnsOrder | DeleteDatatableColumnsOrder;

