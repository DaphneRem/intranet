import { AfterViewInit, Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// imports external libs
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

import { CustomDatatablesOptions } from '../models/custom-datatables-options';
import { CustomThemesService } from '../services/custom-datatables-themes.service';

@Component({
  selector: 'custom-datatables',
  templateUrl: './custom-datatables.component.html',
  styleUrls: ['./custom-datatables.component.scss'],
  providers: [
    CustomThemesService,
    CustomDatatablesOptions
  ]
})
export class CustomDatatablesComponent implements OnInit, AfterViewInit {

  @Input() customdatatablesOptions: CustomDatatablesOptions;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  public render: boolean;

  @Output()
  change = new EventEmitter();

  // datatable const
  public renderOption: boolean;
  public dtOptions: any = {};

  // my const
  public idSelectedData: string;
  public themeName: string;
  public theme: any;

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
            fieldSeparator: ','
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
                _: 'Afficher %d éléments',
                '-1': 'Tout afficher'
            },
            copyTitle: 'Ajouté au presse-papiers',
            copySuccess: {
              _: '%d lignes copiées',
              1: '1 ligne copiée'
            }
        }
  };

  constructor(
    private customThemesService: CustomThemesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.displayDatatables(); // display datatables if data.length
    this.displayCustomOptions();
    this.displayTheme(this.themeName);
  }

  // TODO : voir https://stackoverflow.com/questions/37966718/datatables-export-to-excel-button-is-not-showing pour les options des boutons

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  renderMyData() {
    this.render = true;
    this.change.emit(this.render);
    this.render = false;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  displayDatatables() {
    // console.log(this.customdatatablesOptions.createdRow[0]);
    const options = this.customdatatablesOptions;
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
        select : 'single',
        pageLength : options.rowsMax,
        lengthMenu : options.lenghtMenu,
        dom: 'Bfrtip',
        buttons: [],
        rowCallback: (row: Node, data: any[] | Object, index: number) => { // datatable function to display action on double click
            const self = this;
            if (options.importantData) {
              options.importantData.map( item => this.displayImportantData(item, row));
            }
            $('td', row).unbind('click');
            $('td', row).bind('dblclick', () => {
              self.someClickHandler(data); // go to file-detail with autoPath when double click on row
            });
          return row;
        }
      };
      this.displayButtons();
      console.log(this.dtOptions.buttons);

    }

  }

  displayImportantData(data, row) {
    console.log(data.index);
    console.log(data.className);
    console.log(data.cellData);
    const importantData = $('td', row).eq(data.index).text().toLowerCase();
    data.cellData.map(item => {
      if (item.toLowerCase().includes(importantData)) {
        $('td', row).eq(data.index).addClass(data.className);
      }
    });
  }

  displayButtons() {
    const options = this.customdatatablesOptions;
    if (options.buttons.buttons) {
      if (options.buttons.allButtons) {
        console.log('allButtons');
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
    const options = this.customdatatablesOptions;
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
  someClickHandler(dataRow: any): void {
    this.idSelectedData = dataRow.id;
    // if (dataRow.id && (dataRow.noseg >= 0)) {
    // this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
    // }
      if (this.customdatatablesOptions.dbClickActionExist) {
        this.customdatatablesOptions.dbClickAction(dataRow);
    }
  }

  // adjust title of columns if customComlumn exist
  dispplayColumns() {
    if (this.customdatatablesOptions.customColumn) {
      // add custom columns
      this.customdatatablesOptions.columns.map(item =>
        this.finalData.push({
          title: item.title.toUpperCase(),
          data: item.data,
          className: item.className
        })
      );
      console.log(this.finalData);
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
