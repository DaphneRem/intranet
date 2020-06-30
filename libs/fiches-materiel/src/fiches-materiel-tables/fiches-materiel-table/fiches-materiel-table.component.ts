import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutingState } from '../../services/routing-state.service';

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
  styleUrls: [
    './fiches-materiel-table.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    FichesMaterielService,
    AnnexElementsService,
    FichesAchatService,
    StatusLibService,
    StepsLibService,
    Store
  ]
})
export class FichesMaterielTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;
  @Input() tableTitle?: string;
  @Input() tableTheme?: string;
  @Input() multiColumnsOrderExist?: boolean;
  @Input() multiColumnsOrder?: any;
  @Input() data;
  @Input() responsive?: boolean;

  private onDestroy$: Subject<any> = new Subject();
  public displayOptionsBtnModif = false;

  public rerenderData;
  public globalStore;
  public searchValue: string;
  public storeFichesToModif;
  public storeDatatableSearchData;
  public storeDatatableColumnsOrder;
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
  // public allDatarows = [];
  public previousUrl;
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
    lenghtMenu: [10, 50, 100, 500, 1000],
    theme: 'blue theme',
    responsive : false,
    defaultOrder: [],
    reRenderOption: true,
    renderOption: true,
    dbClickActionExist: true,
    multiSelection: true,
    selectionBtn: true,
    getSearchData: true,
    searchRecordedOption: true,
    searchRecordedData: '',
    getColumnsOrders: true,
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
    private annexElementsService: AnnexElementsService,
    private routingState: RoutingState
  ) {
  }

  ngOnInit() {
    console.log('multiColumnsOrderExist => ', this.multiColumnsOrderExist);
    this.customdatatablesOptions.responsive = this.responsive;
    if (this.tableTheme) {
      this.customdatatablesOptions.theme = this.tableTheme;
    }
    this.customdatatablesOptions.renderOption = true;
    this.previousUrl = this.routingState.getPreviousUrl();
    console.log('this.previousUrl => ', this.previousUrl);
    this.customdatatablesOptions.tableTitle = this.tableTitle;
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
    this.displayDatatable();

    // this.displaySwalModalActions(); // OLD VERSION
    // this.displayBtnModifActions(); // OLD VERSION

  }

  displayDatatable() {
    this.store.subscribe(data => (this.globalStore = data));
    this.customdatatablesOptions.selectionBtn = this.globalStore.app.user.rights.modification;
    this.getElementsAnnexesStatusLib();
    this.getStatusLib();
    this.checkLinks();
    this.displayAction();
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    this.storeDatatableSearchData = this.globalStore.datatableFilteredData;
    this.storeDatatableColumnsOrder = this.globalStore.datatableColumnsOrder;
    this.displayFilterData();
    console.log(this.storeFichesToModif);
    this.customdatatablesOptions.data = this.data;
  }

  public init = 0;
  ngOnChanges(changes: SimpleChanges) {
    console.log('this.data before => ', this.data);
    if (this.init) {
      this.dataReady = false;
      console.log('function onchange from table call');
      const data: SimpleChange = changes.data;
      console.log('data.currentValue ngOnChanges => ', data.currentValue);
      console.log('this.data after => ', this.data);
      this.rerenderData = this.data;
      this.customdatatablesOptions.data = this.data;
      console.log('this.customdatatablesOptions.data => ', this.customdatatablesOptions.data);
      //this.customdatatablesOptions.defaultOrder = [
      //  [this.columnParams, this.orderParams]
      //];
      this.displayColumns();
      this.displayColumnsOrder();
      //this.displayColumns();
      // this.getFichesMateriel();

    } else {
      this.init++;
    }
  }


  displayFilterData() {
    let detailUrl = 'details';
    let modifUrl = 'modification';
    let creationUrl = 'creation';
    console.log(this.previousUrl);
    if ((typeof this.previousUrl !== 'undefined') || (this.previousUrl)) {
      if (
        this.previousUrl.includes(detailUrl)
        || this.previousUrl.includes(modifUrl)
        || this.previousUrl.includes(creationUrl)
      ) {
        this.customdatatablesOptions.searchRecordedData = this.storeDatatableSearchData.searchDatatableData;
      } else {
        this.customdatatablesOptions.searchRecordedData = '';
        if (this.storeDatatableSearchData.searchDatatableData !== '') {
          this.store.dispatch({ type: 'DELETE_DATATABLE_FILTER_DATA' });
        }
      }
    }
  }

  displayColumnsOrder() {
    let detailUrl = 'details';
    let modifUrl = 'modification';
    let creationUrl = 'creation';
    console.log(this.previousUrl);
    if ((typeof this.previousUrl !== 'undefined') || (this.previousUrl)) {
      if (
        this.previousUrl.includes(detailUrl)
        || this.previousUrl.includes(modifUrl)
      ) {
        console.log('this.storeDatatableColumnsOrder => ', this.storeDatatableColumnsOrder);
        let storeColumnsOrder = this.storeDatatableColumnsOrder.columnsDatatableOrder;
        console.log('storeColumnsOrder => ', storeColumnsOrder);
        this.customdatatablesOptions.defaultOrder = storeColumnsOrder;
      } else {
        this.displayDefaultColumnsOrder();
      }
    } else {
      this.displayDefaultColumnsOrder();
    }
    this.displayColumns();
  }

  displayDefaultColumnsOrder() {
    if (this.multiColumnsOrderExist) {
      this.customdatatablesOptions.defaultOrder = this.multiColumnsOrder;
      // this.customdatatablesOptions.defaultOrder = [
      //    [10, 'desc'], // n°FA du plus récent au plus ancien
      //    [5, 'asc'], // TF par ordre alphabétique
      //    [7, 'asc'], // n° épidose AB par ordre croissant
      // ];
    } else {
      this.customdatatablesOptions.defaultOrder = [[0, 'asc']];
    }
    this.store.dispatch({
      type: 'ADD_DATATABLE_COLUMS_ORDER',
      payload: {
        columnsDatatableOrder: this.customdatatablesOptions.defaultOrder
      }
    });
  }

  checkColumnsOrder(event) {
    console.log('event order columns => ', event);
    let order = [];
    console.log('event.length order => ', event.length);
    if (event.length) {
      event.map(item => {
        order.push([item[0], item[1]]);
      });
    }
    console.log('order array after map modif => ', order);
    this.customdatatablesOptions.defaultOrder = order;
    this.store.dispatch({
      type: 'ADD_DATATABLE_COLUMS_ORDER',
      payload: {
        columnsDatatableOrder: this.customdatatablesOptions.defaultOrder
      }
    });
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
        console.log('step lib get from table component : data => ', data);
        this.stepLibReady = true;
        // this.getFichesMateriel();
        this.customdatatablesOptions.data = this.data;
        this.displayColumnsOrder();
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

  checkSearchData(searchValue) {
    this.searchValue = searchValue;
    console.log('search value => ', this.searchValue);
    this.store.dispatch({
      type: 'ADD_DATATABLE_FILTER_DATA',
      payload: {
        searchDatatableData: this.searchValue
      }
    });
  }

  AllSelectedRows(e) {
    this.selectedRows = e;
    console.log('this.selectedRows => ', this.selectedRows);
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
      console.log('this.selectedRow => ', this.selectedRows);
      console.log('this.idFicheAchatArray => ', this.idFicheAchatArray);
      console.log('this.idFicheAchatDetailArray => ', this.idFicheAchatDetailArray);
      this.displayOptionsBtnModif = false;
      this.uniqValuesIdFicheAchat = this.getUniqValues(this.idFicheAchatArray);
      this.uniqValuesIdFicheAchatDetail = this.getUniqValues(this.idFicheAchatDetailArray);
      console.log('this.uniqValuesIdFicheAchat => ', this.uniqValuesIdFicheAchat);
      console.log('this.uniqValuesIdFicheAchatDetail => ', this.uniqValuesIdFicheAchatDetail);
      this.store.dispatch({
        type: 'ADD_FICHE_MATERIEL_IN_MODIF',
        payload: {
          modificationType: 'multi',
          multiFicheAchat: this.uniqValuesIdFicheAchat.length > 1 ? true : false,
          multiOeuvre: this.uniqValuesIdFicheAchatDetail.length > 1 ? true : false,
          allOeuvres: this.uniqValuesIdFicheAchatDetail,
          allFichesAchat: this.uniqValuesIdFicheAchat,
          selectedFichesMateriel: this.selectedId
        }
      });
      this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
    } else {
      // OLD VERSION
      // swal({
      //     title : 'Options de modification',
      //     text: `Modifier uniquement la fiche Matériel n°
      //           ${this.selectedRows[0].IdFicheMateriel} 
      //           ou bien toutes les fiches Matériel associées à l'oeuvre`,
      //     html :
      //     `<div>Modifier uniquement la fiche Matériel n° ${this.selectedRows[0].IdFicheMateriel} ou bien toutes les fiches Matériel associées à l'oeuvre</div>` +
      //     `<button type="button" role="button" tabindex="0" class="SwalBtn1 customSwalBtn" id="btnCoucou">Toutes</button>` +
      //     `<button type="button" role="button" tabindex="0" class="SwalBtn2 customSwalBtn">Fiches  n° ${this.selectedRows[0].IdFicheMateriel} </button>`,
      //     showCancelButton: true,
      //     showConfirmButton: false,
      //     showCloseButton: true,
      //     type: 'warning',
      //     cancelButtonText: 'Annuler',
      //   }).then(result => {
      //     if (result.value) { // confirm button
      //       this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
      //     }
      //   });
      
      // console.log('heeeeere !!!');
      // if (!this.displayOptionsBtnModif) {
      //   let tableCustom = document.getElementsByClassName('add-btn');
      //   tableCustom[0].innerHTML = `<div class="modif-fm-btn one-selection">Modifier la fiche</div><div class="modif-fm-btn all-oeuvres-selection">Modifier fiches de l'oeuvre</div>`;
      //   this.displayOptionsBtnModif = true;
      // }
      /***************** PERMET UNIQUEMENT L'AFFICHAGE DE L4OPTION "MODIFIER" : ****************/ // code à conserver
      this.oneSelectionAction();
      /*****************************************************************************************/
      /****** PERMET L'AFFICHAGE DE L'OPTION DE MODIF "TOUTES LES FICHES DE L'OEUVRES" : *******/ // code à conserver
      // let oneSelectionBtn = document.getElementById('one-selection');
      // let multiSelectionBtn = document.getElementById('all-oeuvres-selection');
      // oneSelectionBtn.style.display = 'flex';
      // multiSelectionBtn.style.display = 'flex';
      /*****************************************************************************************/
    }
  }

  oneSelectionAction() {
    console.log('selected id => ', this.selectedId);
    console.log('all-oeuvres-selection');
    this.store.dispatch({
      type: 'ADD_FICHE_MATERIEL_IN_MODIF',
      payload: {
        modificationType: 'one',
        multiFicheAchat: false,
        multiOeuvre: false,
        selectedFichesMateriel: this.selectedId
      }
    });
    this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
  }

  // allOeuvresSelection() {
  //   this.checkOtherFmInOeuvre();
  //   console.log('this.selectedOeuvre => ', this.selectedOeuvre);
  //   if (this.selectedOeuvre.length > 1) {
  //     this.store.dispatch({
  //       type: 'ADD_FICHE_MATERIEL_IN_MODIF',
  //       payload: {
  //         modificationType: 'multi',
  //         multiFicheAchat: false,
  //         multiOeuvre: false,
  //         selectedFichesMateriel: this.selectedOeuvre
  //       }
  //     });
  //     this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
  //   } else {
  //     this.store.dispatch({
  //       type: 'ADD_FICHE_MATERIEL_IN_MODIF',
  //       payload: {
  //         modificationType: 'one',
  //         multiFicheAchat: false,
  //         multiOeuvre: false,
  //         selectedFichesMateriel: this.selectedId
  //       }
  //     });
  //     this.router.navigate([`/material-sheets/my-material-sheets/modification`]);
  //   }
  // }

  checkOtherFmInOeuvre() {
    this.selectedOeuvre = [];
    this.customdatatablesOptions.data.map(item => {
      console.log(item);
      // console.log(that.selectedRows[0].IdFicheDetail);
      console.log(item.IdFicheDetail);
      console.log(this.selectedRows[0].IdFicheDetail);
      if (item.IdFicheDetail === this.selectedRows[0].IdFicheDetail) {
        console.log(item.IdFicheDetail);
        this.selectedOeuvre.push({
          idFicheMateriel: item.IdFicheMateriel,
          idFicheAchat: item.IdFicheAchat,
          idFicheAchatDetail: item.IdFicheDetail
        });
      }
    });
  }

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      console.log('this.route => ', this.route);
      let paths = this.route.snapshot.routeConfig.path;
      console.log('paths => ', paths);
    //  let path = paths.split('/');
    //  path.splice(-2, 2);
    //  console.log(path);
    //  let value;
    //  if (path.length > 1) {
    //    value = path.join('/');
    //  } else {
    //    value = path[0];
    //  }
    //  console.log('value => ', value);
    //  console.log('path => ', path);
      this.router.navigate([`/material-sheets/${paths}/details/${dataRow.IdFicheMateriel}/${dataRow.IdFicheAchat}/${dataRow.IdFicheDetail}`]);
    //  this.router.navigate([`/material-sheets/${value}/details/${dataRow.IdFicheMateriel}/${dataRow.IdFicheAchat}/${dataRow.IdFicheDetail}`]);
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
    console.log('display action ok');
  }

  getFichesMateriel() {
    this.customdatatablesOptions.data = this.data;
    console.log('this.customdatatablesOptions.data => ', this.customdatatablesOptions.data);
    this.customdatatablesOptions.defaultOrder = [
      [this.columnParams, this.orderParams]
    ];
    this.displayColumns();
    // this.customdatatablesOptions.data = this.data;
    // console.log('this.customdatatablesOptions.data => ', this.customdatatablesOptions.data);
// ICI ORDER
    // this.displayColumns();
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
        data : function ( data, type, row, meta ) {
          if (data.Deadline !== null) {
            let date = moment(data.Deadline).format('YYYY-MM-DD');
            let isBefore = moment(date).isBefore(today);
            if (data.Isurgence) {
              return `<span class="label bg-danger" style="font-size: 0.9em">${data.Deadline.slice(0, 10)}</span>`;
            } else if (isBefore && !data.Isurgence) {
              return `<span style="color: red">${data.Deadline.slice(0, 10)}</span>`;
            } else {
              return data.Deadline.slice(0, 10);
            }
          } else {
            return '<span><span style="color: transparent">9</span>Aucune</span>';
          }
        },
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
            if (data.IdLibEtape === 1) {
              return `<span class="label label-default">${currentItemLib.Libelle}</span>`;
            } else {
              return `<span class="label label-info">${currentItemLib.Libelle}</span>`;
            }
          } else if (data.IdLibstatut === 2) {
            return `<span class="label label-canceled">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 3) {
            return `<span class="label label-success">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 4) {
            return `<span class="label bg-danger">${currentItemLib.Libelle}</span>`;
          } else if (data.IdLibstatut === 5) {
            let shortLibelle = currentItemLib.Libelle.substring(14, currentItemLib.Libelle.length);
            return '<span class="label label-other">' + shortLibelle + '</span>'; // color : #774aa4
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
                return '<span class="label label-info">' + currentItemLib.Libelle + '</span>'; // color : blue; #0040FF
            } else if (currentItemLib.IdLibEtape === 25 || currentItemLib.IdLibEtape === 18) {
                return '<span class="label bg-danger">' + currentItemLib.Libelle + '</span>'; // color : red;
            } else if (currentItemLib.IdLibEtape === 26) {
              return '<span class="label label-EA">' + currentItemLib.Libelle + '</span>'; // color: #a8a8a8 && #FFFFFF
            }
          } else if (currentItemLib.IdLibstatut === 3) { // ACCEPTE
            return '<span class="label label-success">' + currentItemLib.Libelle + '</span>'; // color : green; #04B404
          } else if (currentItemLib.IdLibstatut === 2) { // ANNULE
            return '<span class="label label-canceled">' + currentItemLib.Libelle + '</span>';
          } else if (currentItemLib.IdLibstatut === 5) { // TRAITE PAR AUTRES SERVICES
            if (currentItemLib.IdLibEtape === 24) {
              let shortLibelle = currentItemLib.Libelle.substring(14, currentItemLib.Libelle.length);
              return '<span class="label label-other">' + shortLibelle + '</span>'; // color : #774aa4
            } else {
              return '<span class="label label-other">' + currentItemLib.Libelle + '</span>'; // color : #774aa4
            }
          } else {
            return '/';
          }
        }
      },
      {
        title : 'Annexes',
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
            return '<span class="label label-info">' + currentItemLib.Libelle + '</span>';
          } else if (currentItemLib.IdStatutElementsAnnexes === 3) {
            return '<span class="label label-success">' + currentItemLib.Libelle + '</span>';
          }
        }
      },
      {
        title : 'distributeur',
        className: 'datatble-fm-distributeur',
        data: function (data, type, row, meta) {
            if (data.Isurgence && data.distributeur) {
              return `<span class="label bg-danger" style="font-size: 0.9em">${data.distributeur}</span>`;
            } else {
              return data.distributeur;
            }
          }
      },
      {
        title : 'titre vf',
        className: 'datatable-fm-title',
        data: function (data, type, row, meta) {
          if (data.Isurgence && data.TitreEpisodeVF) {
            return `<span class="label bg-danger" style="font-size: 0.9em">${data.TitreEpisodeVF}</span>`;
          } else {
            return data.TitreEpisodeVF;
          }
        }
      },
      {
        title : 'titre vo',
        className: 'datatable-fm-title',
        data: function (data, type, row, meta) {
          if (data.Isurgence && data.TitreEpisodeVO) {
            return `<span class="label bg-danger" style="font-size: 0.9em">${data.TitreEpisodeVO}</span>`;
          } else {
            return data.TitreEpisodeVO;
          }
        }
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
        data: function (data, type, row, meta) {
          if (data.Isurgence && data.NumEpisodeAB) {
            return `<span class="label bg-danger" style="font-size: 0.9em">${data.NumEpisodeAB}</span>`;
          } else {
            return data.NumEpisodeAB;
          }
        }
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
        title : 'Accept.',
        data : function ( data, type, row, meta ) {
          if (data.DateAcceptation !== null && data.DateAcceptation !== undefined) {
            return '<span class="label label-success acceptation">' + data.DateAcceptation.slice(0, 10) + '</span>'; // color : green; #04B404
          } else if (data.Renouvellement !== null && data.Renouvellement !== 0 && data.DateAcceptation !== undefined) {
            return '<span class="label label-success acceptation">Renouv.</span>'; // color : green; #04B404
          } else {
            return data.DateAcceptation;
          }
        }
      },
      {
        title : 'fiche achat',
        data : 'numficheachat'
      },
      {
        title : 'type FA',
        data : 'typefiche'
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
      {
        title: 'Chaînes',
        data: function (data, type, row, meta) {
          if (data.chaines !== null && data.chaines !== undefined && data.chaines !== '') {
            return data.chaines;
          } else {
            return '/';
          }
        }
      },
    ];
    console.log('display columns ok => ', this.customdatatablesOptions.columns);
    this.dataReady = true;

  }

  /****************************************************************************************/
  /****************************** MODIF SELECTION BTN STYLE *******************************/
  /****************************************************************************************/

    // displaySwalModalActions() { // OLD VERSION WITH SWAL MODAL
    //   const that = this;
    //   let coco = this.selectedRows;
    //   console.log(coco);
    //   $(document).on('click', '.SwalBtn1', function() {
    //         console.log(coco);
    //     console.log('Coucou2');
    //     that.selectedOeuvre = [];
    //     that.customdatatablesOptions.data.map((item) => {
    //       console.log(item);
    //       // console.log(that.selectedRows[0].IdFicheDetail);
    //       console.log(item.IdFicheDetail);
    //       console.log(that.selectedRows[0].IdFicheDetail);
    //       if (item.IdFicheDetail === that.selectedRows[0].IdFicheDetail) {
    //         console.log(item.IdFicheDetail);
    //         that.selectedOeuvre.push(
    //           {
    //             idFicheMateriel: item.IdFicheMateriel,
    //             idFicheAchat: item.IdFicheAchat,
    //             idFicheAchatDetail: item.IdFicheDetail
    //           }
    //         );
    //       }
    //     });
    //     if (that.selectedOeuvre.length > 1) {
    //       that.store.dispatch({
    //         type: 'ADD_FICHE_MATERIEL_IN_MODIF',
    //         payload: {
    //           modificationType: 'multi',
    //           multiFicheAchat: false,
    //           multiOeuvre: false,
    //           selectedFichesMateriel: that.selectedOeuvre
    //         }
    //       });
    //     } else {
    //       that.store.dispatch({
    //         type: 'ADD_FICHE_MATERIEL_IN_MODIF',
    //         payload: {
    //           modificationType: 'one',
    //           multiFicheAchat: false,
    //           multiOeuvre: false,
    //           selectedFichesMateriel: that.selectedId
    //         }
    //       });
    //     }
    //     swal.clickConfirm();
    //   });
    //   $(document).on('click', '.SwalBtn2', function() {
    //     console.log('Coucou1');
    //     that.store.dispatch({
    //       type: 'ADD_FICHE_MATERIEL_IN_MODIF',
    //       payload: {
    //         modificationType: 'one',
    //         multiFicheAchat: false,
    //         multiOeuvre: false,
    //         selectedFichesMateriel: that.selectedId
    //       }
    //     });
    //     swal.clickConfirm();
    //   });
    // }

    // displayBtnModifActions() { // OLD VERSION WITH SWAL MODAL
    //   const that = this;
    //   let coco = this.selectedRows;
    //   let router = this.router;
    //   console.log(coco);
    //   $(document).on('click', '.all-oeuvres-selection', function () {
    //     console.log(coco);
    //     console.log('one-selection');
    //     that.selectedOeuvre = [];
    //     that.customdatatablesOptions.data.map((item) => {
    //       console.log(item);
    //       // console.log(that.selectedRows[0].IdFicheDetail);
    //       console.log(item.IdFicheDetail);
    //       console.log(that.selectedRows[0].IdFicheDetail);
    //       if (item.IdFicheDetail === that.selectedRows[0].IdFicheDetail) {
    //         console.log(item.IdFicheDetail);
    //         that.selectedOeuvre.push(
    //           {
    //             idFicheMateriel: item.IdFicheMateriel,
    //             idFicheAchat: item.IdFicheAchat,
    //             idFicheAchatDetail: item.IdFicheDetail
    //           }
    //         );
    //       }
    //     });
    //     if (that.selectedOeuvre.length > 1) {
    //       that.store.dispatch({
    //         type: 'ADD_FICHE_MATERIEL_IN_MODIF',
    //         payload: {
    //           modificationType: 'multi',
    //           multiFicheAchat: false,
    //           multiOeuvre: false,
    //           selectedFichesMateriel: that.selectedOeuvre
    //         }
    //       });
    //       router.navigate([`/material-sheets/my-material-sheets/modification`]);
    //     } else {
    //       that.store.dispatch({
    //         type: 'ADD_FICHE_MATERIEL_IN_MODIF',
    //         payload: {
    //           modificationType: 'one',
    //           multiFicheAchat: false,
    //           multiOeuvre: false,
    //           selectedFichesMateriel: that.selectedId
    //         }
    //       });
    //       router.navigate([`/material-sheets/my-material-sheets/modification`]);
    //     }
    //   });
    //   // $(document).on('click', '.one-selection', function() {
    //   //   console.log('all-oeuvres-selection');
    //   //   that.store.dispatch({
    //   //     type: 'ADD_FICHE_MATERIEL_IN_MODIF',
    //   //     payload: {
    //   //       modificationType: 'one',
    //   //       multiFicheAchat: false,
    //   //       multiOeuvre: false,
    //   //       selectedFichesMateriel: that.selectedId
    //   //     }
    //   //   });
    //   //   router.navigate([`/material-sheets/my-material-sheets/modification`]);
    //   // });
    // }


    checkDataRow(dataRow) {
      console.log('dataRow => ', dataRow);
      let oneSelectionBtn = document.getElementById('one-selection');
      let multiSelectionBtn = document.getElementById('all-oeuvres-selection');
      oneSelectionBtn.style.display = 'none';
      multiSelectionBtn.style.display = 'none';
      // let divToRemove = document.getElementsByClassName('modif-fm-btn');
      // let dblFm = [];
      // this.allDatarows.map(item => {
      //   if (item.IdFicheMateriel === dataRow.IdFicheMateriel) {
      //     dblFm.push(item);
      //   }
      // });
      // if (dblFm.length === 0) {
      //   this.allDatarows.push(dataRow);
      // } else {
      //   this.allDatarows = this.allDatarows.filter(item => item.IdFicheMateriel !== dataRow.IdFicheMateriel);
      // }
      // console.log('this.allDatarows after filter or push => ', this.allDatarows);
    }

}
