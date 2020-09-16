export class CustomDatatablesOptions {
  tableTitle: string;
  data: any;
  headerTableLinkExist: boolean;
  headerTableLink?: string;
  customColumn: boolean;
  columns?: Columns[];
  // columnDefs?: ColumnDefs[];
  // createdRow?: any;
  importantData?:  ImportantData[];
  paging: boolean;
  search: boolean;
  rowsMax: number;
  lenghtMenu: any;
  buttons: Buttons;
  theme: string;
  renderOption: boolean;
  responsive?: boolean;
  defaultOrder?: any; // [[0, 'asc']]
  reRenderOption?: boolean;
  tooltipHeader?: string;
  clickActionExist?: boolean;
  clickAction?: any;
  dbClickActionExist?: boolean;
  dbClickAction?: any;
  multiSelection?: boolean;
  selectionBtn?: boolean;
  selectionBtnAction?: any;
  getSearchData?: boolean;
  searchRecordedOption?: boolean;
  searchRecordedData?: string;
  getColumnsOrders?: boolean;
}

export class Columns {
  title: string;
  data: any;
  class?: string;
  className?: string;
  // createdCell?: any;
  render?: any;
  width?: string;
  type?: string;
}

export class ColumnDefs {
  targets: number;
  createdCell?: any;
}

export class Buttons {
  buttons: boolean;
  allButtons: boolean;
  colvisButtonExiste: boolean;
  copyButtonExiste: boolean;
  printButtonExiste: boolean;
  excelButtonExiste: boolean;
  pageLengthButton?: boolean;
}

export class ImportantData {
  cellData: any;
  className: string;
  index: number;
}
