import { AfterViewInit, Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

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

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  public render: boolean;



  @Output()
  change = new EventEmitter();


  @Input() customdatatablesOptions: CustomDatatablesOptions;


  public renderOption: boolean;
  public finalData: any = [];
  public dtOptions: any = {};

  public idSelectedData: string;
  public themeName: string;
  public theme: any;

  public data: any = [] ;
  public headerColor: string;
  public firstColumnColor: string;
  public alertColor;
  public paging: boolean;
  public search: boolean;
  public tableTitle: string;
  public headerTableLinkExist: boolean;
  public headerTableLink: string;
  public buttons: any;
  // public colvisButton = 'colvis';
  // public copyButton = 'copy';
  // public printButton = 'print';
  // public excelButton = 'excel';

  public colvisButton =  {
            extend: 'colvis',
            text: 'Colonnes'
        };
  public copyButton = {
            extend: 'copy',
            text: 'Copier'
        };
  public printButton =  {
            extend: 'print',
            text: 'Imprimer'
        };
  public excelButton =  {
            extend: 'excel',
            text: 'Excel'
        };


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
      }
  };

  constructor(
    private customThemesService: CustomThemesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.displayDatatables();
    this.displayCustomOptions();
    this.displayTheme(this.themeName);
  }


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
    const options = this.customdatatablesOptions;
    if (options.data.length) {
      this.dtOptions = {
        data: options.data,
        columns: this.dispplayColumns(),
        scrollX: true,
        paging: options.paging,
        searching: options.search,
        language : this.frenchLanguage,
        select : 'single',
        pageLength : options.rowsMax,
        lengthMenu : options.lenghtMenu,
        dom: 'Bfrtip',
        buttons: [],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
            const self = this;
            $('td', row).unbind('click');
            $('td', row).bind('dblclick', () => {
              self.someClickHandler(data);
            });
          return row;
        }
      };
      console.log(options.data);
      this.displayButtons();
      console.log(this.dtOptions.buttons);
    }
  }

  displayButtons() {
    const options = this.customdatatablesOptions;
    if (options.buttons.buttons) {
      if (options.buttons.allButtons) {
                    console.log('ok1');

        return this.dtOptions.buttons
            .push(
              {
                extend: 'collection',
                text: 'Options',
                buttons: [
                  this.colvisButton,
                  this.copyButton,
                  this.printButton,
                  this.excelButton
                ]
              }
            );
      } else {
        this.buttons.map(item => {
          if (item.exist) {
            console.log('ok');
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

  displayTheme(customTheme) {
    this.theme = this.customThemesService.getTheme(customTheme);
    this.headerColor = this.theme.headerColor;
    this.firstColumnColor = this.theme.firstColumnColor;
    this.alertColor = this.theme.alertColor;
  }

  someClickHandler(dataRow: any): void {
    this.idSelectedData = dataRow.id;
    console.log(dataRow);
    if (dataRow.id && (dataRow.noseg >= 0)) {
      this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
    }
  }

  dispplayColumns() {
    if (this.customdatatablesOptions.customColumn) {
      // add custom columns
      this.customdatatablesOptions.columns.map(item =>
        this.finalData.push({
          title: item.title.toUpperCase(),
          data: item.data
        })
      );
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
