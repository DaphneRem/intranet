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
  tooltipHeader?: string;
  dbClickActionExist?: boolean;
  dbClickAction?: any;
}

export class Columns {
  title: string;
  data: string;
  className?: string;
  // createdCell?: any;
  render?: any;
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
