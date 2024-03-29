import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Router } from '@angular/router';

// imports external libs
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

import { CustomDatatablesOptions } from '../models/custom-datatables-options';
import { CustomThemesService } from '../services/custom-datatables-themes.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { setTimeout } from 'timers';

@Component({
  selector: 'custom-datatables',
  templateUrl: './custom-datatables.component.html',
  styleUrls: ['./custom-datatables.component.scss'],
  providers: [
    CustomThemesService,
    CustomDatatablesOptions
  ]
})
export class CustomDatatablesComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() customdatatablesOptions: CustomDatatablesOptions;
  @Input() rerenderData; // data to observe (customDatatblesOptions.data from parent element)

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  @Output() dataRow = new EventEmitter();
  @Output() row = new EventEmitter();
  @Output() selectRows = new EventEmitter();
  @Output() searchData = new EventEmitter();
  @Output() columnsOrder = new EventEmitter();

  // rerender onchange variables
  public init = 0;
  public dataReady = true;
  public newData;

  // datatable const
  public renderOption: boolean;
  public dtOptions: any = {};

  // my const
  public idSelectedData: string;
  public themeName: string;
  public theme: any;

public test = 'ookok';

  public rows;
  public finalData: any = [];
  public data: any = [] ;
  public headerColor: string;
  public firstColumnColor: string;
  public alertColor;
  public buttonViewMore;
  public buttonViewHover;
  public hovered = false;
  public paging: boolean;
  public search: boolean;
  public tableTitle: string;
  public headerTableLinkExist: boolean;
  public headerTableLink: string;
  public buttons: any;
  public tooltipHeader: string;
  public checkDataFilterReady: boolean = false;
  public trTagName;

  // custom the text of the buttons
  public colvisButton =  {
            extend: 'colvis',
            text: 'Gérer les Colonnes'
        };
  public copyButton = {
            extend: 'copy',
            text: 'Tout copier'
        };
  public printButton =  {
            extend: 'print',
            text: 'Imprimer'
        };
  public excelButton =  {
            extend: 'csv',
            text: 'Export csv',
            fieldSeparator: ';',
            bom: true
        };
  public pageLengthButton =  {
            extend: 'pageLength',
        };


  // custom datatable language
  public frenchLanguage = {
      processing: 'Traitement en cours...',
      search: 'Rechercher&nbsp;:',
      lengthMenu: 'Afficher _MENU_ &eacute;l&eacute;ments',
      info: 'Affichage de l\'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
      infoEmpty: 'Affichage de l\'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments',
      infoFiltered: '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
      infoPostFix: '',
      loadingRecords: 'Chargement en cours...',
      zeroRecords: 'Aucun &eacute;l&eacute;ment &agrave; afficher',
      emptyTable: 'Aucune donnée disponible dans le tableau',
      paginate: {
          first: 'Premier',
          previous: 'Pr&eacute;c&eacute;dent',
          next: 'Suivant',
          last: 'Dernier'
      },
      buttons: {
            pageLength: {
                // _: 'Afficher %d éléments',
                 _: 'Options d\'affichage',
                '-1': 'Tout afficher'
            },
            copyTitle: 'Ajouté au presse-papiers',
            copySuccess: {
              _: '%d lignes copiées',
              1: '1 ligne copiée'
            }
        },
        select : {
          rows : {
            _: '%d lignes sélectionnées',
            1: '1 ligne sélectionnée'
          }
        }
  };

  constructor(
    private customThemesService: CustomThemesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('this.customdatatablesOptions.getColumnsOrders => ', this.customdatatablesOptions.getColumnsOrders);
    // this.dataReady = true;
    this.checkFilterData();
    //if (this.customdatatablesOptions.getColumnsOrders) {
    //  this.getColumnClick();
    //}
    this.initializeDatatable();
  }

  // TODO : voir https://stackoverflow.com/questions/37966718/datatables-export-to-excel-button-is-not-showing pour les options des boutons

  checkFilterData() {
    if (this.customdatatablesOptions.getSearchData) {
      let that = this;
      $('#datatable').on('search.dt', function () {
        let value = $('.dataTables_filter input').val();
        console.log('.dataTables_filter input value => ', value);
        that.searchData.emit(value);
        that.checkDataFilterReady = true;
      });
    } else {
      this.checkDataFilterReady = true;
    }
  }

  getColumnClick() {
    let that = this;
    $('#datatable').on('order.dt', function(event, settings) {
      console.log('order click detected');
      console.log('event => ', event);
      console.log('settings => ', settings);
      console.log('order => ', settings.aaSorting);
      that.columnsOrder.emit(settings.aaSorting);
    });

  }

  initializeDatatable() {
    this.displayDatatables(); // display datatables if data.length
    this.displayCustomOptions();
    this.displayTheme(this.themeName);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    console.log('rerender function');
    // this.dataReady = false;
    document.querySelector('#datatable').classList.add('hiden');
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy(); // Destroy the table first
      this.initializeDatatable();
      setTimeout(() => {
        this.dtTrigger.next(); // Call the dtTrigger to rerender again
        this.dataReady = true;
        document.querySelector('#datatable').classList.remove('hiden');
      }, 0);
    });
  }

 ngOnChanges(changes: SimpleChanges) { // observe @Input() rerenderData
    const changeData: SimpleChange = changes.rerenderData;
   console.log('this.customdatatablesOptions.renderOption => ', this.customdatatablesOptions.renderOption);
    if (this.customdatatablesOptions.renderOption) { // execute function if renderOptions from customDatatablesOptions is true
      if (this.init) { // does not execute rerender function onInit
        this.newData = changeData.currentValue;
        console.log('newData => ', this.newData);
        this.dataReady = false;
        this.rerender();
      } else {
        this.init++;
      }
    }
  }

  displayDatatables() {
    // console.log(this.customdatatablesOptions.createdRow[0]);
    const options = this.customdatatablesOptions;
    const that = this;
    if (options.data.length) { // if data != 0 or data != []
      this.dtOptions = {
        data: options.data,
        columns: this.dispplayColumns(), // check if customColumn exist
        scrollX: true,
        paging: options.paging,
        searching: options.search,
        autoWidth: false,
        language : this.frenchLanguage,
        // createdRow: this.displayCreatedRow(),
        select : options.multiSelection ? true : 'single',
        // select : {
        //   style : options.multiSelection ? 'multi' : 'single',
        // },
        order: options.defaultOrder,
        pageLength : options.rowsMax,
        lengthMenu : options.lenghtMenu,
        responsive : options.responsive,

        dom: 'Bfrtip',
        search: {
          search: options.searchRecordedOption ? options.searchRecordedData : ''
        },
        buttons: options.selectionBtn ?
          [{
            extend: 'selected',
            text: 'Modifier',
            className: '',
            action: function (e, dt, node, config) {
                      const rows = dt.rows( { selected: true } ).data() ;
                      console.log(rows);
                      that.selectRows.emit(rows);
                    }
          },
          // {
          //   text: 'Enlever le filtre',
          //   className: 'btn-clear-filter',
          //   action: function (e, dt, node, config) {
          //     let inputFields = dt.$('tr').closest('div.dataTables_scroll').find('div.dataTables_scrollHead').find('input');
          //     dt.search('').columns().search('').draw(); // remove filters from table
          //     inputFields.val('');
          //   }
          // }
        ]
         : [],
        rowCallback: (row: Node, data: any[] | Object, index: number) => { // datatable function to display action on double click
            const self = this;
            //  var rows = this.dtOptions.rows( { selected: true } ).data();
            if (options.importantData) {
              options.importantData.map( item => this.displayImportantData(item, row));
            } else {
              // this.dataReady = true;
            }
            $('td', row).unbind('click');
            $('td', row).bind('click', () => {
              self.someClickHandler(data, row);
            });
            $('td', row).bind('dblclick', () => {
              self.someDblClickHandler(data); // go to file-detail with autoPath when double click on row
            });
          return row;
        }
      };
      this.displayButtons();
      console.log(this.dtOptions.buttons);
    }
  }

  displayImportantData(data, row) {
    // console.log(data.index);
    // console.log(data.className);
    // console.log(data.cellData);
    const importantData = $('td', row).eq(data.index).text().toLowerCase();
    data.cellData.map(item => {
      if (item.toLowerCase().includes(importantData)) {
        $('td', row).eq(data.index).addClass(data.className);
      }
    });
    console.log('important data');
    // this.dataReady = true;
  }

  displayButtons() {
    const options = this.customdatatablesOptions;
    if (options.buttons.buttons) {
      if (options.buttons.allButtons) {
        // console.log('allButtons');
        return this.dtOptions.buttons
          .push(
            {
              extend: 'collection',
              text: 'Options',
              buttons: [
                this.pageLengthButton,
                // this.colvisButton,
                this.copyButton,
                this.printButton,
                this.excelButton,
              ]
            }
          );
      } else {
        this.buttons.map(item => {
          if (item.exist) {
            this.dtOptions.buttons
            .push(
              {
                extend: 'collection',
                text: 'Options',
                buttons: [
                  item.name
                ]
              }
            );
          }
        });
      }
    }
  }

  displayCustomOptions() {
    console.log('displayoptions');
    const options = this.customdatatablesOptions;
    console.log('options => ', options);
    // console.log('options.renderOption => ', options.renderOption);
      this.themeName = options.theme;
      this.data = options.data;
      this.paging = options.paging;
      this.search = options.search;
      this.tableTitle = options.tableTitle;
      this.headerTableLinkExist = options.headerTableLinkExist;
      this.headerTableLink = options.headerTableLink;
      this.renderOption = options.renderOption;
      this.tooltipHeader = options.tooltipHeader;
      this.buttons = [
            {
              name : this.colvisButton,
              exist : options.buttons.colvisButtonExiste
            },
            {
              name : this.copyButton,
              exist : options.buttons.copyButtonExiste
            },
            {
              name : this.printButton,
              exist : options.buttons.printButtonExiste
            },
            {
              name : this.excelButton,
              exist : options.buttons.excelButtonExiste
            }
        ];
  }

  // use service to recovers theme data which corresponds to argument
  displayTheme(customTheme) {
    this.theme = this.customThemesService.getTheme(customTheme);
    this.headerColor = this.theme.headerColor;
    this.firstColumnColor = this.theme.firstColumnColor;
    this.alertColor = this.theme.alertColor;
    this.buttonViewMore = this.theme.buttonViewMore;
    this.buttonViewHover = this.theme.buttonViewHover;
  }

  // go to file-detail with autoPath when double click on row
  someDblClickHandler(dataRow: any): void {
    this.idSelectedData = dataRow.id;
    this.dataRow.emit(dataRow);
    // if (dataRow.id && (dataRow.noseg >= 0)) {
    // this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
    // }
      if (this.customdatatablesOptions.dbClickActionExist) {
        this.customdatatablesOptions.dbClickAction(dataRow);
    }
  }
  someClickHandler(dataRow: any, row): void {
    this.idSelectedData = dataRow.id;
    this.dataRow.emit(dataRow);
    this.row.emit(row);
    // if (dataRow.id && (dataRow.noseg >= 0)) {
    // this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
    // }
      if (this.customdatatablesOptions.clickActionExist) {
        this.customdatatablesOptions.clickAction(dataRow, row);
    }
  }

  // adjust title of columns if customComlumn exist
  dispplayColumns() {
    this.finalData = [];
    if (this.customdatatablesOptions.customColumn) {
      // add custom columns
      this.customdatatablesOptions.columns.map(item =>
        this.finalData.push({
          title: item.title.toUpperCase(),
          data: item.data,
          type: item.type,
          className: item.className
        })
      );
      // console.log(this.finalData);
      return this.finalData;
    } else {
      Object.keys(this.customdatatablesOptions.data[0]).map(item =>
        this.finalData.push({
          title: item.toUpperCase(),
          data: item
        })
      );
      return this.finalData;
    }
  }
}
