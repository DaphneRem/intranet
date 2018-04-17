export class CustomDatatablesOptions {
  tableTitle: string;
  data: any;
  headerTableLinkExist: boolean;
  headerTableLink?: string;
  customColumn: boolean;
  columns?: Columns[];
  paging: boolean;
  search: boolean;
  rowsMax: number;
  lenghtMenu: any;
  buttons: Buttons;
  theme: string;
  renderOption: boolean;
  dbClickActionExist?: boolean;
  dbClickAction?: any;
}

export class Columns {
  title: string;
  data: string;
  className?: string;
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

