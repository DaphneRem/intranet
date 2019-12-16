import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';

@Component({
  selector: 'fiches-achat-table',
  templateUrl: './fiches-achat-table.component.html',
  styleUrls: ['./fiches-achat-table.component.scss'],
  providers : [
    FichesAchatService
  ]
})
export class FichesAchatTableComponent implements OnInit,  OnChanges {

  @Input() stateFIcheAchat;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;
  @Input() displayActionType?: string;
  @Input() modalName?: string;

  public rerenderData;
  public rerenderTitle;
  public dataReloadReady;
  public creationDate;
  public modificationDate;
  public refreshDatatable;
  public myFicheAchat: any = {};
  public dataReady = false;
  public init = 0;
  public noData = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Fiches Materiel',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    defaultOrder: [[7, 'desc']],
    theme: 'blue theme',
    renderOption: true,
    reRenderOption: true,
    dbClickActionExist: true,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true
    }
  };

  constructor(
    private fichesAchatService: FichesAchatService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.stateFIcheAchat);
    console.log(this.customdatatablesOptions.tableTitle);
    this.displayDatatable();
    this.dataReloadReady = true;
    this.customdatatablesOptions.tableTitle = 'coucou';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.init) {
      console.log('function onchange from table call');
      const stateFIcheAchat: SimpleChange = changes.stateFIcheAchat;
      this.refreshDatatable = stateFIcheAchat;
      console.log(this.stateFIcheAchat);
      this.displayDatatable();
      console.log(this.customdatatablesOptions.tableTitle);
      // console.log(this.rerenderData);
    } else {
      this.init++;
    }
  }

  displayDatatable() {
    this.getFichesAchat(this.stateFIcheAchat.id);
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  checkDataReloadReady(event) {
    this.dataReloadReady = event;
  }

  openMyModal() {
    document.querySelector(this.modalName).classList.add('md-show');
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      // this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
      if (this.displayActionType === 'modal') {
        this.openMyModal();
      }
    };
    this.customdatatablesOptions.tableTitle = this.stateFIcheAchat.name;
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur une fiche Achat pour avoir une vue détaillée';
  }

  selectedFicheAchat(event) {
    console.log(event);
    this.myFicheAchat = event;
    console.log(this.myFicheAchat);
  }

  checkDataReady() {
    return this.dataReady;
  }

  getFichesAchat(state: number) {
    let imp: number;
    let title: string;
    if (state === 0) { // ALL
      imp = -1;
      this.rerenderTitle = 'Toutes les fiches Achats';
    } else if (state === 1) { // TRAITEE
      imp = 1;
      this.rerenderTitle = 'fiches Achats traitées';
    } else { // NON TRAITEE
      imp = 0;
      this.rerenderTitle = 'fiches Achats non traitées';
    }
    console.log('current tttttt id = ' + this.stateFIcheAchat.id);
    this.fichesAchatService
      .getFicheAchatByImport(-1, imp)
      .subscribe(data => {
        console.log(data);
        if (!data) {
          this.customdatatablesOptions.data = [];
          this.dataReady = true;
        } else if (!data.length) {
          console.log('no data => [] ');
          this.customdatatablesOptions.tableTitle = this.rerenderTitle;
          this.customdatatablesOptions.data = data;
          this.dataReady = false;
          this.noData = true;
        } else {
            console.log('requête sur les fiches => "non traitée"');
            // data.map(e => {
            //   this.creationDate = new Date(e.Date_Creation);
            //   this.modificationDate = new Date(e.Date_Modif);
            //   e.Date_Creation = this.creationDate.toLocaleString();
            //   e.Date_Modif = this.modificationDate.toLocaleString();
            // });
            this.customdatatablesOptions.data = data;
            this.customdatatablesOptions.tableTitle = 'Fiches Achat non traitées';
            this.noData = false;
            this.dataReady = true;
            this.displayColumns();
            this.rerenderData =  data;
            console.log(this.rerenderData);
            console.log(this.customdatatablesOptions.data);
            this.displayAction();
            this.checkLinks();
        }
      });
    }

            // this.customdatatablesOptions.data = [];
          //   this.customdatatablesOptions.data = [
          //         {
          //           'id_fiche': 13,
          //           'numero_fiche': 'clone fiche',
          //           'idad_lib_nom_ad': 0,
          //           'nom_ad': '',
          //           'vieux_fiche': false,
          //           'code_storage': 0,
          //           'nom_fichier': '',
          //           'id_type_fiche': 5,
          //           'libelle_type_fiche': 'Vidéo',
          //           'commentaire': '',
          //           'Nom_Gem': '',
          //           'ResumeTitre': '',
          //           'id_statut': 0,
          //           'Date_Creation': '2018-09-01T17:43:15.507',
          //           'Acheteur': 'AB-1206-010-W8 (BAUDON-H)',
          //           'Producteur': '',
          //           'Distributeur': null,
          //           'User_Modif': '',
          //           'Date_Modif': null,
          //           'num_cessionnaire': null,
          //           'chaines': null
          //         },
          //         {
          //           'id_fiche': 56,
          //           'numero_fiche': 'FA-2018-00021',
          //           'idad_lib_nom_ad': 75859,
          //           'nom_ad': 'IMAGISSIME',
          //           'vieux_fiche': false,
          //           'code_storage': 0,
          //           'nom_fichier': '',
          //           'id_type_fiche': 1,
          //           'libelle_type_fiche': 'Chaîne',
          //           'commentaire': 'sdfsdfsd',
          //           'Nom_Gem': '',
          //           'ResumeTitre': '',
          //           'id_statut': 0,
          //           'Date_Creation': '2018-02-05T14:50:43.55',
          //           'Acheteur': '',
          //           'Producteur': '',
          //           'Distributeur': null,
          //           'User_Modif': 'ZAIGOUCHE-A',
          //           'Date_Modif': '2018-07-10T11:38:43.647',
          //           'num_cessionnaire': null,
          //           'chaines': null
          //         }
          // ];


  displayColumns() {
    // console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'n° Fiche Achat',
        data : 'numero_fiche',
        // className: 'long-data'
      },
      {
        title : 'Type fiche',
        data : 'libelle_type_fiche',
        // className: 'small-data'
      },
      {
        title : 'Date publication',
        // data : 'Date_Publication'
        data : function  (data, type, row, meta ) {
          // return new Date(data.DateCreation).toLocaleString();
          if  (data.Date_Publication !== null) {
            return data.Date_Publication.slice(0, 10);
          } else {
            return data.Date_Publication;
          }
        }
      },
      {
        title : 'Distributeur', // ayant droit
        data : 'Distributeur',
        className: 'datatable-fa-distributeur'
      },
      {
        title : 'chaines',
        data : 'lib_chaines',
        className: 'datatable-fa-chaines'
        // data: 'id_fiche'
      },
      {
        title : 'Acheteur',
        data : 'Acheteur'
      },
      {
        title : 'Nom Cessionnaire',
        data : 'nom_cessionnaire',
        className: 'datatable-fa-cessionnaire'
      },
      {
        title : 'Date Modif',
        // data : 'Date_Modif',
        data : function  (data, type, row, meta ) {
          // return new Date(data.DateCreation).toLocaleString();
          if  (data.Date_Modif !== null) {
            return data.Date_Modif.slice(0, 10);
          } else {
            return data.Date_Modif;
          }
        }
      },
    ];
    this.customdatatablesOptions.defaultOrder = [[this.customdatatablesOptions.columns.length - 1, 'desc']];
  }

}




