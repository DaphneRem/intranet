import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import swal from 'sweetalert2';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

// fiches achat service & model import
import { FicheAchat } from '@ab/fiches-achat';
import { FicheAchatDetails } from '@ab/fiches-achat';
import { FichesAchatService } from '@ab/fiches-achat';

// fiches matériel service & model import
import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';
import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';

@Component({
  selector: 'fiches-materiel-table',
  templateUrl: './fiches-materiel-table.component.html',
  styleUrls: ['./fiches-materiel-table.component.scss'],
  providers : [
    FichesMaterielService,
    FichesAchatService,
    Store
  ]
})
export class FichesMaterielTableComponent implements OnInit, OnDestroy {
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public globalStore;
  public storeFichesToModif;
  public selectedId = [];
  public selectedOeuvre;
  public idFicheAchatArray = [];
  public idFicheAchatDetailArray = [];
  public uniqValuesIdFicheAchat;
  public uniqValuesIdFicheAchatDetail;
  public table;
  public ctrlKeyActive = false;
  public showModifBtn = false;
  public showModifAllEps = false;

  // activatedRoute parameters
  private sub: any;
  public columnParams;
  public orderParams;

  public today;
  public todayDate: Date;
  public todayTime: number;

  public selectedRows = [];
  public sortingData;
  public deadline;
  public livraison;
  public acceptation;
  public creation;
  public dataReady = false;
  public render: boolean;
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
    theme: 'blue theme',
    responsive : true,
    defaultOrder: [],
    // importantData : [
    //   {
    //     index : 0,
    //     className: 'warning',
    //     cellData: []
    //   }
    // ],
    renderOption: true,
    dbClickActionExist: true,
    multiSelection: true,
    selectionBtn: true,
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
    private fichesMaterielService: FichesMaterielService,
    private fichesAchatService: FichesAchatService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<FicheMaterielModification>
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.columnParams = +params['columnIndex'];
      this.orderParams = params['order'];
    });
    this.today = new Date().toJSON().slice(0, 19);
    this.todayDate = new Date(this.today);
    this.todayTime = this.todayDate.getTime();
    console.log(this.columnParams);
    console.log(this.orderParams);
    this.getFichesMateriel();
    this.checkLinks();
    this.displayAction();
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    console.log(this.storeFichesToModif);
    this.displaySwalModalActions();
  }

  checkDeadline(data, fm) { // check DeadLine && display important data
    if (fm.Deadline) {
      const fmDeadline = new Date(fm.Deadline);
      const fmTime = fmDeadline.getTime();
      if (this.todayTime > fmTime) {
        this.customdatatablesOptions.importantData[0].cellData.push(new Date(fm.Deadline).toLocaleString());
      }
    }
    if (data.indexOf(fm) === (data.length - 1)) {
      console.log(fm);
      console.log('terminée');
      this.dataReady = true;
    }
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  getUniqValues(array) {
    return array.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
  }

  AllSelectedRows(e) {
    this.selectedRows = e;
    for (let i = 0; i < this.selectedRows.length; i++) {
      this.idFicheAchatArray.push(this.selectedRows[i].IdFicheAchat);
      this.idFicheAchatDetailArray.push(this.selectedRows[i].IdFicheDetail);
      this.selectedId.push(
          {
            idFicheMateriel: this.selectedRows[i].IdFicheMateriel,
            idFicheAchat: this.selectedRows[i].IdFicheAchat,
            idFicheAchatDetail: this.selectedRows[i].IdFicheDetail
          }
      );
    }
    if (this.selectedRows.length > 1) {
      this.uniqValuesIdFicheAchat = this.getUniqValues(this.idFicheAchatArray);
      this.uniqValuesIdFicheAchatDetail = this.getUniqValues(this.idFicheAchatDetailArray);
      this.store.dispatch({
        type: 'ADD_FICHE_MATERIEL_IN_MODIF',
        payload: {
          modificationType: 'multi',
          multiFicheAchat: this.uniqValuesIdFicheAchat.length > 1 ? true : false,
          multiOeuvre: this.uniqValuesIdFicheAchatDetail.length > 1 ? true : false,
          selectedFichesMateriel: this.selectedId
        }
      });
      this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
    } else {
      swal({
          title : 'Options de modification',
          text: `Modifier uniquement la fiche Matériel n°
                ${this.selectedRows[0].IdFicheMateriel} 
                ou bien toutes les fiches Matériel associées à l'oeuvre`,
          html :
          `<div>Modifier uniquement la fiche Matériel n° ${this.selectedRows[0].IdFicheMateriel} ou bien toutes les fiches Matériel associées à l'oeuvre</div>` +
          `<button type="button" role="button" tabindex="0" class="SwalBtn1 customSwalBtn" id="btnCoucou">Toutes</button>` +
          `<button type="button" role="button" tabindex="0" class="SwalBtn2 customSwalBtn">Fiches  n° ${this.selectedRows[0].IdFicheMateriel} </button>`,
          showCancelButton: true,
          showConfirmButton: false,
          showCloseButton: true,
          type: 'warning',
          cancelButtonText: 'Annuler',
        }).then(result => {
          if (result.value) { // confirm button
            this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
          }
        });
    }
  }

  displaySwalModalActions() {
    const that = this;
    $(document).on('click', '.SwalBtn1', function() {
      console.log('Coucou2');
      that.selectedOeuvre = [];
      that.customdatatablesOptions.data.map((item) => {
        console.log(item);
        if (item.IdFicheDetail === that.selectedRows[0].IdFicheDetail) {
          console.log(item.IdFicheDetail);
          that.selectedOeuvre.push(
            {
              idFicheMateriel: item.IdFicheMateriel,
              idFicheAchat: item.IdFicheAchat,
              idFicheAchatDetail: item.IdFicheDetail
            }
          );
        }
      });
      that.store.dispatch({
        type: 'ADD_FICHE_MATERIEL_IN_MODIF',
        payload: {
          modificationType: 'multi',
          multiFicheAchat: false,
          multiOeuvre: false,
          selectedFichesMateriel: that.selectedOeuvre
        }
      });
      swal.clickConfirm();
    });
    $(document).on('click', '.SwalBtn2', function() {
      console.log('Coucou1');
      that.store.dispatch({
        type: 'ADD_FICHE_MATERIEL_IN_MODIF',
        payload: {
          modificationType: 'one',
          multiFicheAchat: false,
          multiOeuvre: false,
          selectedFichesMateriel: that.selectedId
        }
      });
      swal.clickConfirm();
    });
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      this.router.navigate([`/material-sheets/my-material-sheets/details/${dataRow.IdFicheMateriel}/${dataRow.IdFicheAchat}`]);
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
    console.log('display action ok');
  }

  getFichesMateriel() {
    this.fichesMaterielService
      .getFichesMateriel()
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
          this.displayColumns();
          this.dataReady = true;
        } else {
          // data.map(e => {
          //   this.checkDeadline(data, e);
          // });
          this.customdatatablesOptions.data = data;
          this.customdatatablesOptions.defaultOrder = [[this.columnParams, this.orderParams]];
          this.displayColumns();
        }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getFichesAchat(number) {
    this.fichesAchatService
      .getFichesAchat(number)
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
        } else {
          this.customdatatablesOptions.data = data;
        }
        this.dataReady = true;
    });
  }

  displayColumns() {
    this.customdatatablesOptions.columns = [
      {
        title : 'Deadline',
        data: 'Deadline'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.Deadline).toLocaleString();
        // }
      },
      {
        title : 'Suivi',
        data : function ( data, type, row, meta ) {
          return '<span class="label bg-info">' + 'En cours' + '</span>'; // change 'En cours' to real data
        }
      },
      {
        title : 'type fiche achat',
        data : 'NumEpisodeProd' // data manquante
      },
      {
        title : 'distributeur',
        data : 'NumEpisodeProd' // data manquante
      },
      {
        title : 'titre vf', // pour les tests
        data : 'TitreEpisodeVF' // pour les tests
      },
      {
        title : 'titre vo', // pour les tests
        data : 'TitreEpisodeVO' // pour les tests
      },
      {
        title : 'date création', // pour les tests
        data : 'DateCreation'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.DateCreation).toLocaleString();
        // }
      },
      {
        title : 'IdFicheAchat', // delete after tests ok
        data : 'IdFicheAchat'
      },
      {
        title : 'IdFicheMateriel', // delete after tests ok
        data : 'IdFicheMateriel'
      },
      {
        title : 'N° eps AB',
        data : 'NumEpisode',
      },
      {
        title : 'N° eps Prod',
        data : 'NumEpisodeProd',
      },
      {
        title : 'Date Livraison',
        data : 'DateLivraison'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.DateLivraison).toLocaleString();
        // }
      },
      {
        title : 'Version',
        data : 'Fiche_Mat_Version',
      },
      {
        title : 'Qualite',
        data : 'Fiche_Mat_Qualite',
      },
      {
        title : 'Date Acceptation',
        data : 'DateAcceptation'
        // data : function ( data, type, row, meta ) {
        //   return new Date(data.DateAcceptation).toLocaleString();
        // }
      },


    ];
    console.log('display columns ok');
    this.dataReady = true;

  }

}
