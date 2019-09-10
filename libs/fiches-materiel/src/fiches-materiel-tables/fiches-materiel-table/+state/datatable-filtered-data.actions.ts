export interface AddDatatableFilteredData {
  type: 'ADD_DATATABLE_FILTER_DATA';
  payload: {
    searchDatatableData: ''
  };
}

export interface DeleteDatatableFilteredData {
  type: 'DELETE_DATATABLE_FILTER_DATA';
  payload: {};
}

export type DatatableFilteredDataActions = AddDatatableFilteredData | DeleteDatatableFilteredData;

