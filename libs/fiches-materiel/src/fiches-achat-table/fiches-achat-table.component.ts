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
  public dataReloadReady;
  public creationDate;
  public modificationDate;
  public refreshDatatable;
  public myFicheAchat: any = {};
  public dataReady = false;
  public init = 0;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Fiches Achat non traitées',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
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
    this.displayDatatable();
    this.dataReloadReady = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.init) {
      console.log('function onchange from table call');
      const stateFIcheAchat: SimpleChange = changes.stateFIcheAchat;
      this.refreshDatatable = stateFIcheAchat;
      console.log(this.stateFIcheAchat);
      this.displayDatatable();
      console.log(this.customdatatablesOptions);
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

  displayHeaderTitle() {
    if (this.stateFIcheAchat.id === 0) {
      this.customdatatablesOptions.tableTitle = 'Toutes les fiches Achat';
    } else if (this.stateFIcheAchat.id === 1) {
      this.customdatatablesOptions.tableTitle = 'Fiches Achat traitées';
    } else {
      this.customdatatablesOptions.tableTitle = 'Fiches Achat non traitées';
    }
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
    console.log('current tttttt id = ' + this.stateFIcheAchat.id);
    if (this.stateFIcheAchat.id === 2) {
    this.fichesAchatService
      .getFichesAchat(state)
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
        } else {
            console.log('requête sur 4 fiches => "non traitée"');
            data.map(e => {
              this.creationDate = new Date(e.Date_Creation);
              this.modificationDate = new Date(e.Date_Modif);
              e.Date_Creation = this.creationDate.toLocaleString();
              e.Date_Modif = this.modificationDate.toLocaleString();
            });
            this.customdatatablesOptions.data = data;
            this.dataReady = true;
            this.displayColumns(data);
            this.rerenderData =  data;
            console.log(this.rerenderData);
            console.log(this.customdatatablesOptions.data);
            this.displayHeaderTitle();
            this.displayAction();
            this.checkLinks();
        }
      });
    } else {
      this.fichesAchatService
        .getGlobalFIcheAchat(12)
        .subscribe( data => {
          if (!data) {
          this.customdatatablesOptions.data = [];
          } else {
            console.log('requête sur une fiche => différent de "non traitée"');
            // this.creationDate = new Date(data.Date_Creation);
            // this.modificationDate = new Date(data.Date_Modif);
            // data.Date_Creation = this.creationDate.toLocaleString();
            // data.Date_Modif = this.modificationDate.toLocaleString();
            this.customdatatablesOptions.data = [data];
            this.dataReady = true;
            this.displayColumns(data);
            this.rerenderData = data;
            console.log(this.rerenderData);
            console.log(this.customdatatablesOptions.data);
            this.displayHeaderTitle();
            this.displayAction();
            this.checkLinks();
          }
        });
      }
      console.log(this.customdatatablesOptions.data);
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


  displayColumns(data) {
    // console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'num fiche',
        data : 'numero_fiche',
        // className: 'long-data'
      },
      {
        title : 'Date Modif',
        data : 'Date_Modif',
      },
      {
        title : 'chaines',
        data : 'chaines'
      },
      {
        title : 'Date Creation',
        data : 'Date_Creation'
      },
      {
        title : 'type fiche',
        data : 'libelle_type_fiche',
        // className: 'small-data'
      },
      // {
      //   title : 'Resume Titre',
      //   data : 'ResumeTitre'
      // },
      {
        title : 'Acheteur',
        data : 'Acheteur'
      },
      {
        title : 'distributeur', // ayant droit
        data : 'nom_ad',
      },
      // {
      //   title : 'commentaire',
      //   data : 'commentaire'
      // },
      // {
      //   title : 'Producteur',
      //   data : 'Producteur'
      // },
      // {
      //   title : 'Ayant droit',
      //   data : 'Distributeur'
      // },
      {
        title : 'User Modif',
        data : 'User_Modif',
      },
      {
        title : 'num cessionnaire',
        data : 'num_cessionnaire'
      },

    ];
  }

}




