import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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

// Elements Annexes import
import { AnnexElementsService } from '../../services/annex-elements.service';
import { AnnexElementStatus } from '../../models/annex-element';

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
    AnnexElementsService,
    FichesAchatService,
    StatusLibService,
    StepsLibService,
    Store
  ]
})
export class FichesMaterielTableComponent implements OnInit, OnDestroy {
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;
  @Input() tableTitle?: string;
  @Input() data;

  private onDestroy$: Subject<any> = new Subject();

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
  public columnParams = 0;
  public orderParams = 'asc';

  public today;
  public todayDate: Date;
  public todayTime: number;

  public stepLib: Step[];
  public stepLibReady: Boolean = false;
  public statusLib: Status[];
  public statusLibReady: Boolean = false;
  public elementsAnnexesStatusLib: AnnexElementStatus[];
  public elementsAnnexesStatusLibReady: Boolean = false;

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
    rowsMax: 500,
    lenghtMenu: [10, 50, 100, 500],
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
    private statusLibService: StatusLibService,
    private annexElementsService: AnnexElementsService
  ) {}

  ngOnInit() {
    this.customdatatablesOptions.tableTitle = this.tableTitle;
    console.log(this.route);
    this.sub = this.route.params.subscribe(params => {
      console.log(params);
      if (params.hasOwnProperty('columnIndex') && params.hasOwnProperty('order')) {
        this.columnParams = +params['columnIndex'];
        this.orderParams = params['order'];
      }
    });
    this.today = new Date().toJSON().slice(0, 19);
    this.todayDate = new Date(this.today);
    this.todayTime = this.todayDate.getTime();
    console.log(this.columnParams);
    console.log(this.orderParams);
    this.getElementsAnnexesStatusLib();
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
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.stepLib = data;
        console.log(data);
        this.stepLibReady = true;
        this.getFichesMateriel();
      });
  }

  getStatusLib() {
    this.statusLibService
      .getStatusLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.statusLib = data;
        console.log(data);
        this.statusLibReady = true;
        this.getStepsLib();
      });
  }

  getElementsAnnexesStatusLib() {
    this.annexElementsService
      .getAnnexElementsStatus()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.elementsAnnexesStatusLib = data;
        this.elementsAnnexesStatusLibReady = true;
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
        console.log(item.IdFicheDetail);
        console.log(that.selectedRows[0].IdFicheDetail);
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
      console.log(this.route);
      let paths = this.route.snapshot.routeConfig.path;
      let path = paths.split('/');
      path.splice(-2, 2);
      console.log(path);
      let value;
      if (path.length > 1) {
        value = path.join('/');
      } else {
        value = path[0];
      }
      console.log(path);
      this.router.navigate([`/material-sheets/${value}/details/${dataRow.IdFicheMateriel}/${dataRow.IdFicheAchat}/${dataRow.IdFicheDetail}`]);
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
    console.log('display action ok');
  }

  getFichesMateriel() {
    this.customdatatablesOptions.data = this.data;
    this.customdatatablesOptions.defaultOrder = [[this.columnParams, this.orderParams]];
    this.displayColumns();
    // this.fichesMaterielService
    //   .getFichesMateriel()
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(data => {
    //     if (!data) {
    //       this.customdatatablesOptions.data = [];
    //       this.displayColumns();
    //       this.dataReady = true;
    //     } else {
    //       // data.map(e => {
    //       //   this.checkDeadline(data, e);
    //       // });
    //       console.log(data);
    //       this.customdatatablesOptions.data = data;
    //       this.customdatatablesOptions.defaultOrder = [[this.columnParams, this.orderParams]];
    //       this.displayColumns();
    //     }
    // });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.onDestroy$.next();
  }

  displayColumns() {
    let that = this;
    let today = moment().format('YYYY-MM-DD');
    this.customdatatablesOptions.columns = [
      {
        title : 'Deadline',
        // data: 'Deadline'
        data : function ( data, type, row, meta ) {
          if (data.Deadline !== null) {
            let date = moment(data.Deadline).format('YYYY-MM-DD');
            let isBefore = moment(date).isBefore(today);
            if (isBefore) {
              return `<span style="color: red">${data.Deadline.slice(0, 10)}</span>`;
            } else {
              return data.Deadline.slice(0, 10);
            }
          } else {
            return '<span style="color: red"><span style="color: transparent">9</span>Aucune Deadline</span>';
          }
        },
        // className: 'red'
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
            return `<span class="label bg-info">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 2) {
            return `<span class="label label-canceled">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 3) {
            return `<span class="label bg-success">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 4) {
            return `<span class="label bg-danger">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 5) {
            return `<span class="label label-other">${currentItemLib.Libelle}</span>`;
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
          if (currentItemLib.IdLibstatut === 1) { // EN COURS
            if (currentItemLib.IdLibEtape <= 6) {
              return '<span class="label label-default">' + currentItemLib.Libelle + '</span>'; // color: #a8a8a8 && #FFFFFF
            }  else if (currentItemLib.IdLibEtape > 6 && currentItemLib.IdLibEtape <= 10) {
                return '<span class="label bg-info">' + currentItemLib.Libelle + '</span>'; // color : blue;
            } else if (currentItemLib.IdLibEtape === 25 || currentItemLib.IdLibEtape === 18) {
                return '<span class="label bg-danger">' + currentItemLib.Libelle + '</span>'; // color : red;
            } else if (currentItemLib.IdLibEtape === 26) {
              return '<span class="label label-default">' + currentItemLib.Libelle + '</span>'; // color: #a8a8a8 && #FFFFFF
            }
          } else if (currentItemLib.IdLibstatut === 3) { // ACCEPTE
            return '<span class="label bg-success">' + currentItemLib.Libelle + '</span>'; // color : green;
          } else if (currentItemLib.IdLibstatut === 2) { // ANNULE
            return '<span class="label label-canceled">' + currentItemLib.Libelle + '</span>';
          } else if (currentItemLib.IdLibstatut === 5) { // TRAITE PAR AUTRES SERVICES
            return '<span class="label label-other">' + currentItemLib.Libelle + '</span>'; // color : #774aa4
          } else {
            return '/';
          //                 return '<span class="label label-default">' + currentItemLib.Libelle + '</span>'; // color: #a8a8a8
          //   }  else if (currentItemLib.IdLibEtape > 6 && currentItemLib.IdLibEtape <= 10) {
          //       return '<span class="label bg-primary">' + currentItemLib.Libelle + '</span>'; // color : red;
          //   } else if (currentItemLib.IdLibEtape === 25 || currentItemLib.IdLibEtape === 18) {
          //       return '<span class="label bg-danger">' + currentItemLib.Libelle + '</span>'; // color : red;
          //   } else if (currentItemLib.IdLibEtape === 26) {
          //     return '<span class="label label-default">' + currentItemLib.Libelle + '</span>'; // color: #a8a8a8
          //   }
          // } else if (currentItemLib.IdLibstatut === 2) { // ACCEPTE
          //   return '<span class="label bg-info">' + currentItemLib.Libelle + '</span>'; // color : green;
          // } else if (currentItemLib.IdLibstatut === 3) { // ANNULE
          //   return '<span class="label bg-primary">' + currentItemLib.Libelle + '</span>';
          // } else if (currentItemLib.IdLibstatut === 5) { // TRAITE PAR AUTRES SERVICES
          //   return '<span class="label bg-success">' + currentItemLib.Libelle + '</span>';
          }
        }
      },
      {
        title : 'E-Annexes',
        data : function ( data, type, row, meta ) {
          let currentItemLib;
          that.elementsAnnexesStatusLib.map(item => {
            if (item.IdStatutElementsAnnexes === data.IdStatutElementsAnnexes) {
              currentItemLib = item;
            }
          });
          if (currentItemLib.IdStatutElementsAnnexes === 1) {
            return '<span class="label label-default">' + currentItemLib.Libelle + '</span>';
          } else if (currentItemLib.IdStatutElementsAnnexes === 2) {
            return '<span class="label bg-info">' + currentItemLib.Libelle + '</span>';
          } else if (currentItemLib.IdStatutElementsAnnexes === 3) {
            return '<span class="label bg-success">' + currentItemLib.Libelle + '</span>';
          }
        }
      },
      {
        title : 'distributeur',
        data : 'distributeur',
        className: 'datatble-fm-distributeur'
      },
      {
        title : 'titre vf',
        data : 'TitreEpisodeVF',
        className: 'datatable-fm-title'
      },
      {
        title : 'titre vo',
        data : 'TitreEpisodeVO',
        className: 'datatable-fm-title'
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
        title : 'ep. AB',
        data : 'NumEpisode',
      },
      {
        title : 'Livraison',
        data : function ( data, type, row, meta ) {
          if  (data.DateLivraison !== null && data.DateLivraison !== undefined) {
            return data.DateLivraison.slice(0, 10);
          } else {
            return data.DateLivraison;
          }
        }
      },
      {
        title : 'Acceptation',
        data : function ( data, type, row, meta ) {
          if (data.DateAcceptation !== null && data.DateAcceptation !== undefined) {
            return data.DateAcceptation.slice(0, 10);
          } else {
            return data.DateAcceptation;
          }
        }
      },
      {
        title : 'n°fiche achat',
        data : 'numficheachat'
      },
      {
        title : 'type FA',
        data : 'typefiche' // data manquante
      },
      {
        title : 'n° oeuvre',
        data : function ( data, type, row, meta ) {
          if (data.NumProgram !== null && data.NumProgram !== undefined && data.NumProgram !== '') {
            return data.NumProgram;
          } else {
            return '/';
          }
        }
      },
    ];
    console.log('display columns ok');
    this.dataReady = true;

  }

}
