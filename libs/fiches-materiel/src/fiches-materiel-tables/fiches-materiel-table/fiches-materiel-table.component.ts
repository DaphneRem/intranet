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

// Steps import
import { StepsLibService } from '../../services/steps-lib.service';
import { Step } from '../../models/step';

// Status import
import { StatusLibService } from '../../services/status-lib.service';
import { Status } from '../../models/status';

@Component({
  selector: 'fiches-materiel-table',
  templateUrl: './fiches-materiel-table.component.html',
  styleUrls: ['./fiches-materiel-table.component.scss'],
  providers : [
    FichesMaterielService,
    FichesAchatService,
    StatusLibService,
    StepsLibService,
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

  public stepLib: Step[];
  public stepLibReady: Boolean = false;
  public statusLib: Status[];
  public statusLibReady: Boolean = false;

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
    rowsMax: 50,
    lenghtMenu: [10, 50, 100],
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
    private store: Store<FicheMaterielModification>,
    private stepsLibService: StepsLibService,
    private statusLibService: StatusLibService
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
    this.getStepsLib();
    this.getStatusLib();
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

  getStepsLib() {
    this.stepsLibService.getStepsLib()
      .subscribe(data => {
        this.stepLib = data;
        console.log(data);
        this.stepLibReady = true;
      });
  }

  getStatusLib() {
    this.statusLibService
      .getStatusLib()
      .subscribe(data => {
        this.statusLib = data;
        console.log(data);
        this.statusLibReady = true;
      });
  }

  getUniqValues(array) {
    return array.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
  }

  AllSelectedRows(e) {
    this.selectedRows = e;
    console.log(this.selectedRows);
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
    let coco = this.selectedRows;
    console.log(coco);
    $(document).on('click', '.SwalBtn1', function() {
          console.log(coco);
      console.log('Coucou2');
      that.selectedOeuvre = [];
      that.customdatatablesOptions.data.map((item) => {
        console.log(item);
        // console.log(that.selectedRows[0].IdFicheDetail);
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
      if (that.selectedOeuvre.length > 1) {
        that.store.dispatch({
          type: 'ADD_FICHE_MATERIEL_IN_MODIF',
          payload: {
            modificationType: 'multi',
            multiFicheAchat: false,
            multiOeuvre: false,
            selectedFichesMateriel: that.selectedOeuvre
          }
        });
      } else {
        that.store.dispatch({
          type: 'ADD_FICHE_MATERIEL_IN_MODIF',
          payload: {
            modificationType: 'one',
            multiFicheAchat: false,
            multiOeuvre: false,
            selectedFichesMateriel: that.selectedId
          }
        });
      }

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
          console.log(data);
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
    let that = this;
    this.customdatatablesOptions.columns = [
      {
        title : 'Deadline',
        // data: 'Deadline'
        data : function ( data, type, row, meta ) {
          // return new Date(data.Deadline).toLocaleString();
          // console.log(typeof data.Deadline);
          return data.Deadline.slice(0, 10);
        }
      },
      {
        title : 'Statut',
        data : function ( data, type, row, meta ) {
          let currentItemLib;
          that.statusLib.map(item => {
            if (item.IdLibstatut === data.IdLibstatut) {
              currentItemLib = item;
            }
          });
          if (data.IdLibstatut === 1) {
            return '<span class="label bg-info">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibstatut === 2) {
            return '<span class="label label-default">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibstatut === 3) {
            return '<span class="label bg-succes">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibstatut === 4) {
            return '<span class="label bg-danger">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibstatut === 5) {
            return '<span class="label label-default">' + currentItemLib.Libelle + '</span>';
          } else {
            return '/';
          }
        }
      },
      {
        title : 'Etape',
        data : function ( data, type, row, meta ) {
          let currentItemLib;
          that.stepLib.map(item => {
            if (item.IdLibEtape === data.IdLibEtape) {
              currentItemLib = item;
            }
          });
          if (data.IdLibEtape < 7) {
            return '<span class="label label-default">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibEtape >= 7 && data.IdLibEtape < 14) {
            return '<span class="label bg-info">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibEtape === 14) {
            return '<span class="label bg-primary">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibEtape === 15 || data.IdLibEtape === 16) {
            return '<span class="label bg-success">' + currentItemLib.Libelle + '</span>';
          } else if (data.IdLibEtape === 17) {
            return '<span class="label bg-danger">' + currentItemLib.Libelle + '</span>';
          } else {
            return '/';
          }
        }
      },
      {
        title : 'distributeur',
        data : 'distributeur'
      },
      {
        title : 'titre vf',
        data : 'TitreEpisodeVF'
      },
      {
        title : 'titre vo',
        data : 'TitreEpisodeVO'
      },
      // {
      //   title : 'IdFicheAchat', // delete after tests ok
      //   data : 'IdFicheAchat'
      // },
      // {
      //   title : 'IdFicheMateriel', // delete after tests ok
      //   data : 'IdFicheMateriel'
      // },
      {
        title : 'N° eps AB',
        data : 'NumEpisode',
      },
      {
        title : 'Date Livraison',
        // data : 'DateLivraison'
        data : function ( data, type, row, meta ) {
          // return new Date(data.DateLivraison).toLocaleString();
          if  (data.DateLivraison !== null) {
            return data.DateLivraison.slice(0, 10);
          } else {
            return data.DateLivraison;
          }
        }
      },
      {
        title : 'n°fiche achat',
        data : 'NumEpisodeProd' // data manquante
      },
      {
        title : 'type fiche achat',
        data : 'typefiche' // data manquante
      },
    ];
    console.log('display columns ok');
    this.dataReady = true;

  }

}
