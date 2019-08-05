import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// import { browserRefresh } from '../../../../apps/fiches-materiel/src/app/app.component';
import { urlDetailedReportFicheAchat } from '../../../../.privates-url';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat, FicheAchatDetails } from '@ab/fiches-achat';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';

import { StepsLibService } from '../services/steps-lib.service';
import { Step } from '../models/step';
import { StatusLibService } from '../services/status-lib.service';
import { Status } from '../models/status';

import { AnnexElementsService } from '../services/annex-elements.service';
import {
  AnnexElementStatus,
  AnnexElementCategory,
  AnnexElementSubCategory,
  AnnexElementFicheMAteriel
} from '../models/annex-element';
import { AnnexElementCommentsFicheMAteriel } from '../models/annex-elements-comments';

import { QualiteService } from '../services/qualite.service';
import { QualiteLib, QualiteFM } from '../models/qualite';

import { VersionService } from '../services/version.service';
import { VersionFM, VersionLib } from '../models/version';

import { RetourOriLibService } from '../services/retour-ori-lib.service';

import { CustomDatepickerI18n, I18n } from '../services/custom-datepicker-i18n';
import { NgbDatepickerI18n, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../services/custom-parser-formatter-datepiker';

import { NewObject } from './fiche-materiel-new-object';

import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'fiches-materiel-modification-interface',
  templateUrl: './fiches-materiel-modification-interface.component.html',
  styleUrls: [
    './fiches-materiel-modification-interface.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    AnnexElementsService,
    FichesAchatService,
    FichesMaterielService,
    RetourOriLibService,
    StatusLibService,
    StepsLibService,
    VersionService,
    QualiteService,
    Store,
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class FichesMaterielModificationInterfaceComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();

  // public browserRefresh: boolean;
  public sameComments = {};
  public sameEAComments = [];

  public sameOriginalProperties = [];
  public refreshEACommentModel = -1;
  public comments: AnnexElementCommentsFicheMAteriel[];
  public allEACommentsMultiSelect = [];

  public user;
  public initialFichesMateriel = [];

  public reload = false;

  public modificationMessage: string = 'Modifications';
  public disabledDateAcceptation = false;
  public deadLineNgFormat: NgbDateStruct;
  public deadlineNewStringFormat;
  public livraisonDateNgFormat: NgbDateStruct;
  public diffDateNgFormat: NgbDateStruct;
  public acceptationDateNgFormat: NgbDateStruct;
  public accLaboDateNgFormat: NgbDateStruct;
  public retourDateOriNgFormat: NgbDateStruct;

  public ficheAchat: FicheAchat[];
  public ficheAchatReady: Boolean = false;

  public ficheAchatDetail: FicheAchatDetails;
  public ficheAchatDetailReady: Boolean = false;

  public globalStore;
  public storeFichesToModif;

  public selectionType: string;
  public multiOeuvre: boolean;
  public multiFichesAchat: boolean;

  public steps: any;
  public allSteps: Step[];
  public stepsReady: Boolean = false;
  public initValueSteps: Boolean = true;
  public firstClick = false;

  public status: any;
  public statusReady: Boolean = false;
  public activeStatusLibelle;
  public initValueStatus: Boolean = true;

  public annexElementsStatus: any;
  public annexElementsReady: Boolean = false;
  public annexElementsCategories;
  public initAnnexElements: Boolean = true;
  public annexElementsFicheMateriel: any;
  public annexElementsAllSubCategories;

  public retourOri: any;
  public retourOriReady: Boolean = false;
  public initValueRetourOri: Boolean = true;

  public lendingDurationDate;
  public lendingDurationDatepicker;

  public qualiteLib: any;
  public qualiteReady: Boolean = false;
  public qualiteFM;
  public qualiteFmReady: Boolean = false;

  public versionFicheMateriel = [];
  public versionLib: any;
  public versionFmReady: Boolean = false;

  public valueNotToChangeLibelle = 'Valeur d\'origine';
  public resetTooltipMessage = 'Vider le champs';
  public replyTooltipMessage = 'Retour aux valeurs d\'origines';
  public arrayDateFicheMateriel = [
    'Deadline',
    'DateRetourOri',
    'DateLivraison',
    'DatePremiereDiff',
    'DateAcceptation',
    'ReceptionAccesLabo'
  ];
  public annexElementsNgModel: Object;
  public allAnnexElementsFicheMateriel = [];

  public detailedReportLink;

  public deadlineIsValid: boolean = true;
  public livraisonIsValid: boolean = true;
  public acceptationIsValid: boolean = true;
  public premiereDiff: boolean = true;
  public accesLabo: boolean = true;

  public allFichesMateriel = [];
  public allIdSelectedFichesMateriel = [];
  public dataIdFicheMaterielReady = false;
  public newObject: NewObject = {
    IdFicheMateriel: this.valueNotToChangeLibelle,
    IdFicheAchat: this.valueNotToChangeLibelle,
    IdFicheDetail: this.valueNotToChangeLibelle,
    Deadline: this.valueNotToChangeLibelle,
    SuiviPar: this.valueNotToChangeLibelle,
    IdLibstatut: this.valueNotToChangeLibelle,
    IdLibEtape: this.valueNotToChangeLibelle,
    NumEpisodeProd: this.valueNotToChangeLibelle,
    NumEpisodeAB: this.valueNotToChangeLibelle,
    TitreEpisodeVF: this.valueNotToChangeLibelle,
    TitreEpisodeVO: this.valueNotToChangeLibelle,
    IdSupport: this.valueNotToChangeLibelle,
    NumProgram: this.valueNotToChangeLibelle,
    NumEpisode: this.valueNotToChangeLibelle,
    ReceptionAccesLabo: this.valueNotToChangeLibelle,
    Renouvellement: this.valueNotToChangeLibelle,
    NomLabo: this.valueNotToChangeLibelle,
    CoutLabo: this.valueNotToChangeLibelle,
    DateLivraison: this.valueNotToChangeLibelle,
    DelaiLivraison: this.valueNotToChangeLibelle,
    DateRetourOri: this.valueNotToChangeLibelle,
    UniteDelaiLivraison: this.valueNotToChangeLibelle,
    DateAcceptation: this.valueNotToChangeLibelle,
    DatePremiereDiff: this.valueNotToChangeLibelle,
    AccesVF: this.valueNotToChangeLibelle,
    Commentaires: this.valueNotToChangeLibelle,
    RetourOri: this.valueNotToChangeLibelle,
    RetourOriDernierDelai: this.valueNotToChangeLibelle,
    IdStatutElementsAnnexes: this.valueNotToChangeLibelle,
    UserCreation: this.valueNotToChangeLibelle,
    UserModification: this.valueNotToChangeLibelle,
    DateCreation: this.valueNotToChangeLibelle,
    DateModification: this.valueNotToChangeLibelle,
    CommentairesDateLivraison: this.valueNotToChangeLibelle,
    CommentairesStatutEtape: this.valueNotToChangeLibelle,
    isarchived: this.valueNotToChangeLibelle
    // Fiche_Mat_ElementsAnnexes: [],
    // Fiche_Mat_LibRetourOri: this.valueNotToChangeLibelle,
    // Fiche_Mat_LibStatutElementsAnnexes: this.valueNotToChangeLibelle,
    // Fiche_Mat_HistoriqueDateLivraison: this.valueNotToChangeLibelle,
    // Fiche_Mat_HistoriqueStatutEtape: this.valueNotToChangeLibelle,
    // Fiche_Mat_Qualite: this.valueNotToChangeLibelle,
    // Fiche_Mat_StatutElementsAnnexes: this.valueNotToChangeLibelle,
    // Fiche_Mat_Version: this.valueNotToChangeLibelle
  };

  constructor(
    private annexElementsService: AnnexElementsService,
    private fichesAchatService: FichesAchatService,
    private fichesMaterielService: FichesMaterielService,
    private retourOriLibService: RetourOriLibService,
    private statusLibService: StatusLibService,
    private stepsLibService: StepsLibService,
    private qualiteService: QualiteService,
    private versionService: VersionService,
    private router: Router,
    private store: Store<FicheMaterielModification>
  ) {}

  ngOnInit() {
    // this.browserRefresh = browserRefresh;
    // if (browserRefresh) {
    //   this.router.navigate(['/material-sheets/my-material-sheets/0/asc']);
    // }
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    // if (this.storeFichesToModif.selectedFichesMateriel === []) {
    //   this.router.navigate(['/']);
    // }
    this.user = this.globalStore.app.user.shortUserName;
    this.checkAllIdSelected();
    this.getLibs();
    this.displaySelectionMode(this.storeFichesToModif);
    this.getAllFichesMateriel(this.storeFichesToModif.selectedFichesMateriel);
  }

  checkValidDate(date): boolean {
    if (date !== null) {
      if (typeof date === 'string') {
        if (date === 'dd-mm-yyyy' || date === this.valueNotToChangeLibelle) {
          return true;
        // } else if (date ===) {

        } else if (date.length === 10 && date[2] === '-' && date[5] === '-') {
          let arrDate = date.split('-');
          let day = arrDate[0];
          let month = arrDate[1];
          let year = arrDate[2];
          let dayInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
          if (
            +day <= +dayInMonth &&
            year.length === 4 &&
            +month <= 12 &&
            +month > 0 &&
            month.length === 2
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        let month = date.month < 10 ? `0${date.month}` : date.month.toString();
        let dayInMonth = moment(
          `${date.year}-${month}`,
          'YYYY-MM'
        ).daysInMonth();
        let yearLenght = date.year.toString().length;
        if (
          +date.day <= +dayInMonth &&
          date.year.toString().length === 4 &&
          +date.month <= 12 &&
          +date.month > 0 &&
          month.length === 2
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  displayValidDate(date, type) {
    // console.log(this.selectionType);
    if (type === 'deadline') {
      this.deadlineIsValid = this.checkValidDate(date);
    } else if (type === 'livraison') {
      this.livraisonIsValid = this.checkValidDate(date);
    } else if (type === 'acceptation') {
      this.acceptationIsValid = this.checkValidDate(date);
    } else if (type === 'diff') {
      this.premiereDiff = this.checkValidDate(date);
    } else if (type === 'labo') {
      this.accesLabo = this.checkValidDate(date);
    }
  }

  ngOnDestroy() {
    this.store.dispatch({
      type: 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF',
      payload: {}
    });
    this.onDestroy$.next();
  }

  displayStateElementsAnnexNgModel(event) {
    this.annexElementsNgModel = event;
    console.log('event from modal elements annexes : ', event);
    console.log(
      'this.annexElementsNgModel from modal elements annexes : ',
      this.annexElementsNgModel
    );
  }
  displayModificationMessage(event) {
    this.dataIdFicheMaterielReady = false;
    this.modificationMessage = event;
    this.allAnnexElementsFicheMateriel = [];
    this.allEACommentsMultiSelect = [];
    console.log(this.storeFichesToModif.selectedFichesMateriel);
    this.getAllFichesMateriel(this.storeFichesToModif.selectedFichesMateriel);
    this.reload = true;
    this.initValueSteps = true;
    // this.changeDateFormat(event);
    // this.ngOnInit();
    // this.arrayDateFicheMateriel.forEach(item => this.changeDateFormat(item));
    // this.newObject = new NewObject();
    console.log('this.newObject = new NewObject ==>',  this.newObject);
  }

  resetPropertiesChanged(event) {
    // let propertiesToReset = event;
    // let datesInFM = ['DateAcceptation', 'DateLivraison', 'DatePremiereDiff', 'DateRetourOri', 'Deadline', 'ReceptionAccesLabo'];
    // console.log('Properties changed to RESET ====> ', event);
    //  Object.keys(this.newObject).map(item => {
    //     this.newObject[item] = this.valueNotToChangeLibelle;
    //  });
    // Object.keys(propertiesToReset).map(item => {
      // this.newObject[item] = this.valueNotToChangeLibelle;
      // for (let key in this.newObject) {
      //   if (key === item) {
      //       this.newObject[key] = propertiesToReset[item];
      //   }
      // }
      // if (datesInFM.includes(item)) {
      //   console.log('date item to change format ====>', item);
      //   this.changeDateFormat(item);
      // }
    // });
    console.log('newObject ==> ', this.newObject);
  }
  public fmInRecording = false;
  checkCurrentRecord(event) {
    console.log('FM in recording ====> ', event);
    this.fmInRecording = event;
  }

  displaynewEAComments(event) {
    console.log('displaynewEAComments EVENT COMMENTS FROM ANNEXES ELEMENTS MODIF COMPONENT => ', event);
    this.comments = event;
  }

  disabledDeadline() {
    // A MODIFIER PAR LA SUITE => LA CONDITION CHANGE CAR LES ID CHANGENT
    // console.log('this.newObject.IdLibEtape => ', this.newObject.IdLibEtape);
    if (
      this.newObject.IdLibEtape === 20 || // Terminé (accepté)
      this.newObject.IdLibEtape === 21 || // Terminé (annulé)
      this.newObject.IdLibEtape === 24 // traité par un autre service
    ) {
      if (this.selectionType === 'multi') {
        this.newObject.Deadline = null;
      }
      return true;
    } else {
      // if (this.selectionType === 'multi') {
      //   this.newObject.Deadline = this.valueNotToChangeLibelle;
      // }
      return false;
    }
  }

  displayOriLastDeadline(deliveryDate) {
    // console.log(deliveryDate);
    if (deliveryDate !== null && deliveryDate !== undefined) {
      const duree = this.ficheAchatDetail.duree_du_pret;
      let month, day;
      if (deliveryDate.month < 10) {
        month = `0${deliveryDate.month}`;
      } else {
        month = deliveryDate.month;
      }
      if (deliveryDate.day < 10) {
        day = `0${deliveryDate.day}`;
      } else {
        day = deliveryDate.day;
      }

      const dateString = new Date(deliveryDate.year + '-' + month + '-' + day);
      const addDureeLendingDuration = dateString.setDate(
        dateString.getDate() + duree
      );
      this.lendingDurationDate = new Date(addDureeLendingDuration);
      this.newObject.RetourOriDernierDelai = {
        year: new Date(this.lendingDurationDate).getFullYear(),
        month: new Date(this.lendingDurationDate).getMonth() + 1,
        day: new Date(this.lendingDurationDate).getDate()
      };
    }
  }

  displaySelectionMode(storeFichesToModif) {
    this.selectionType = storeFichesToModif.modificationType;
    this.multiOeuvre = storeFichesToModif.multiOeuvre;
    this.multiFichesAchat = storeFichesToModif.multiFicheAchat;
    console.log('selection Type : ' + this.selectionType);
    console.log('multi oeuvre : ' + this.multiOeuvre);
    console.log('multi fiches achat : ' + this.multiFichesAchat);
  }

  checkAllIdSelected() {
    this.storeFichesToModif.selectedFichesMateriel.map(item => {
      this.allIdSelectedFichesMateriel.push({
        IdFicheMateriel: item.idFicheMateriel,
        IdFicheAchat: item.idFicheAchat,
        IdFicheDetail: item.idFicheAchatDetail
      });
    });
    console.log(this.allIdSelectedFichesMateriel);
  }

  getFicheAchat(id) {
    this.fichesAchatService.getGlobalFIcheAchat(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.ficheAchat = data;
        console.log('ficheAchat => ', this.ficheAchat);
        this.ficheAchatReady = true;
      });
  }

  getFicheAchatDetail(id) {
    this.fichesAchatService.getFichesAchatDetails(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.ficheAchatDetail = data[0];
        console.log('ficheAchatDetail => ',this.ficheAchatDetail);
        this.ficheAchatDetailReady = true;
        this.displayOriLastDeadline(this.livraisonDateNgFormat);
      });
  }

  getAllFichesMateriel(allIdFichesMateriel) {
    this.initialFichesMateriel = [];
    this.allVersionFm = [];
    this.allQualitiesFm = [];
    allIdFichesMateriel.map(item => {
      console.log(item);
      this.getFicheMateriel(
        item.idFicheMateriel,
        allIdFichesMateriel.indexOf(item),
        allIdFichesMateriel.length
      );
    });
    this.getStatusLib();
    if (this.storeFichesToModif.modificationType !== 'multi') {
      console.log('CALL GET COMMENTS FUNCTION AFTER GETallFICHESMATERIEL !!!!!!!');
        this.getCommentaireAnnexElementsFicheMateriel(this.storeFichesToModif.selectedFichesMateriel[0]);
    } else {
      console.log('this.storeFichesToModif.modificationType === multi => ', this.storeFichesToModif);
      this.storeFichesToModif.selectedFichesMateriel.map(item => {
        this.getCommentaireAnnexElementsFicheMateriel(item);
      });
    }
  }

  /************************ Datepicker / Date functions ********************/

  changeDateFormat(originalDate) {
    let defaultFormat = 'dd-mm-yyyy';
    if (this.selectionType === 'one') {
      if (
        this.newObject.DateRetourOri !== undefined &&
        this.newObject.DateRetourOri !== null
      ) {
        // DATE RETOUR ORI
        this.newObject.DateRetourOri = this.changeToNgFormatDate(this.newObject.DateRetourOri);
      } else {
        this.newObject.DateRetourOri = defaultFormat;
      }
      if (
        this.newObject.Deadline !== undefined &&
        this.newObject.Deadline !== null
      ) {
        // DATE DEADLINE
        this.newObject.Deadline = this.changeToNgFormatDate(this.newObject.Deadline);
      } else {
        this.newObject.Deadline = defaultFormat;
      }
      if (
        this.newObject.DateLivraison !== undefined &&
        this.newObject.DateLivraison !== null
      ) {
        // DATE LIVRAISON
        this.newObject.DateLivraison = this.changeToNgFormatDate(this.newObject.DateLivraison);
      } else {
        this.newObject.DateLivraison = defaultFormat;
      }
      if (
        this.newObject.DatePremiereDiff !== undefined &&
        this.newObject.DatePremiereDiff !== null
      ) {
        // DATE PREMIERE DIFF
        this.newObject.DatePremiereDiff = this.changeToNgFormatDate(this.newObject.DatePremiereDiff);
      } else {
        this.newObject.DatePremiereDiff = defaultFormat;
      }
      if (
        this.newObject.DateAcceptation !== undefined &&
        this.newObject.DateAcceptation !== null
      ) {
        // DATE ACCEPTATION
        this.newObject.DateAcceptation = this.changeToNgFormatDate(this.newObject.DateAcceptation);
      } else {
        this.newObject.DateAcceptation = defaultFormat;
      }
      if (
        this.newObject.ReceptionAccesLabo !== undefined &&
        this.newObject.ReceptionAccesLabo !== null
      ) {
        // DATE RECEPTION ACCES LABO
        this.newObject.ReceptionAccesLabo = this.changeToNgFormatDate(this.newObject.ReceptionAccesLabo);
      } else {
        this.newObject.ReceptionAccesLabo = defaultFormat;
      }
    } else {
      if (this.newObject.DateRetourOri !== this.valueNotToChangeLibelle) {
        this.newObject.DateRetourOri = this.changeToNgFormatDate(this.newObject.DateRetourOri);
      }
      if (this.newObject.Deadline !== this.valueNotToChangeLibelle) {
        this.newObject.Deadline = this.changeToNgFormatDate(this.newObject.Deadline);
      }
      if (this.newObject.DateLivraison !== this.valueNotToChangeLibelle) {
        this.newObject.DateLivraison = this.changeToNgFormatDate(this.newObject.DateLivraison);
      }
      if (this.newObject.DatePremiereDiff !== this.valueNotToChangeLibelle) {
        this.newObject.DatePremiereDiff = this.changeToNgFormatDate(this.newObject.DatePremiereDiff);
      }
      if (this.newObject.DateAcceptation !== this.valueNotToChangeLibelle) {
        this.newObject.DateAcceptation = this.changeToNgFormatDate(this.newObject.DateAcceptation);
      }
      if (this.newObject.ReceptionAccesLabo !== this.valueNotToChangeLibelle) {
        this.newObject.ReceptionAccesLabo = this.changeToNgFormatDate(this.newObject.ReceptionAccesLabo);
      }
    }
  }

  addZeroToDate(date) {
    if (date.length === 1) {
      return `0${date}`;
    } else {
      return date;
    }
  }

  changeToNgFormatDate(originDate) {
    console.log('originDate => ', originDate);
    let newDate;
    if (originDate !== null) {
      newDate = {
        year: new Date(originDate).getFullYear(),
        month: new Date(originDate).getMonth() + 1,
        day: new Date(originDate).getDate()
      };
      console.log('newDate => ', newDate);
    } else {
      newDate = 'dd-mm-yyyy';
      console.log('newDate => ', newDate);
    }
    return newDate;
  }

  /*****************************************************************************/
  /**************************** GET Fiche Materiel *****************************/
  public equalObject = {};
  getFicheMateriel(id: number, index, length) {
    console.log(index);
    console.log(length);
    this.allFichesMateriel = [];
    this.fichesMaterielService.getOneFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (data) {
          this.allFichesMateriel.push(data[0]);
          this.initialFichesMateriel.push(data[0]);
          if (length === 1) {
            // selectionType === 'one
            this.getQualiteFicheMateriel(id);
            this.getVersionFicheMateriel(id);
            this.getAnnexElementsFicheMateriel(id, index, length);
          } else {
            this.getAnnexElementsFicheMateriel(id, index, length);
            this.getVersionFicheMateriel(id);
            this.getQualiteFicheMateriel(id);
          }
          if (index === length - 1) {
            console.log('call displayNewObject function !!!!!!!!!');
            this.displayNewObject(length, data[0]);
            // this.dataIdFicheMaterielReady = true;
          }
        }
      });
    console.log('allFichesMateriel => ', this.allFichesMateriel);
  }


  displayNewObject(length, ficheMateriel) {
    this.sameOriginalProperties = [];
    this.equalObject = {};
    console.log('this.newObject in displayNewObject() => ', this.newObject);
    if (length === 1) {
      this.newObject = ficheMateriel;
      this.detailedReportLink = `${urlDetailedReportFicheAchat}${
        ficheMateriel.IdFicheAchat
      }`;
      this.getFicheAchat(ficheMateriel.IdFicheAchat);
      this.getFicheAchatDetail(ficheMateriel.IdFicheAchat);
      this.changeDateFormat('arg');
      // this.arrayDateFicheMateriel.forEach(item => this.changeDateFormat(item));
      this.fmInRecording = false;
      this.dataIdFicheMaterielReady = true;
    } else {
      console.log('this.dataIdFicheMaterielReady ==> ', this.dataIdFicheMaterielReady);
      console.log('call displayNewObject function !!!!!!!!!');
      // CHECK ALL DATA TO FIND SAME PROPERTIES
      const allEqual = this.allFichesMateriel.every(item => item === this.allFichesMateriel[0]);
      console.log('allEqual ====>  ', allEqual);
      console.log('nombre de fiches materiel ==> ', this.allFichesMateriel.length);
      console.log('fiches matériel ==> ', this.allFichesMateriel);
      this.allFichesMateriel.map(item => {
        let index = this.allFichesMateriel.indexOf(item);
        for (let key in item) {
          if ((index + 1) < this.allFichesMateriel.length) {
            if (item[key] === this.allFichesMateriel[index + 1][key]) {
              console.log('keyyy same value (all)^^^^^^^ => ', key);
              console.log('same value ******** => ', item[key]);
              if (!this.equalObject[key] || this.equalObject[key].length === 0) {
                this.equalObject[key] = [];
                this.equalObject[key].push(item[key]);
              }
              this.equalObject[key].push(item[key]);
            } else {
              console.log('keyyy different value (all) ^^^^^^^ => ', key);
              console.log('different value ******** => ', item[key]);
            }
          }
        }
      });
      for (let key in this.equalObject) {
        if (this.equalObject[key].length === this.allFichesMateriel.length) {
          this.newObject[key] = this.equalObject[key][0];
          this.sameOriginalProperties.push(key);
        }
      }
      console.log('this.newObject before chengeDateFormat ====> ', this.newObject);
      this.changeDateFormat('arg');
      console.log('this.sameOriginalProperties => ', this.sameOriginalProperties);
      console.log('this.newObject ====> ', this.newObject);
      console.log('equalObject ==> ', this.equalObject);
      this.displayLibValueNotToChange();
      this.fmInRecording = false;
      this.dataIdFicheMaterielReady = true;
    }
  }

  checkIsOriginalProperty(property, value): boolean {
    console.log('property => ', property);
    console.log('value => ', value);
    console.log('this.sameOriginalProperties ==> ', this.sameOriginalProperties);
    console.log('this.sameOriginalProperties.includes(property) => ', this.sameOriginalProperties.includes(property));
    if (this.sameOriginalProperties.includes(property)) {
      // console.log('this.equalObject[property] => ', this.equalObject[property]);
      // console.log('value => ', value);
      // if (this.equalObject[property][0] === value) {
      //   return true;
      // } else {
      //   return false;
      // }
      return true;
    } else {
      return false;
    }
  }

  checkIfSameOriginalProperty(property, value): boolean {
    console.log('property => ', property);
    console.log('value => ', value);
    console.log('this.sameOriginalProperties => ', this.sameOriginalProperties);
    console.log('this.sameOriginalProperties.includes(property) => ', this.sameOriginalProperties.includes(property));
    if (this.sameOriginalProperties.includes(property)) {
      return true;
    } else {
      return false;
    }
  }

/****************************************************************/
/************************ VERSION MANAGEMENT ********************/
/****************************************************************/

  // versionArrayIdExist
  public allVersionFm = [];
  getVersionFicheMateriel(id) {
    // Get Version from Fiche Materiel
    this.versionService.getVersionFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (this.selectionType !== 'multi') {
          console.log('getVersionFicheMateriel() => data : ', data);
          this.versionFicheMateriel = data;
          
          // console.log(data);
        } else {
          this.allVersionFm.push(data);
          if (this.allVersionFm.length === this.allIdSelectedFichesMateriel.length) {
            console.log('this.allVersionFm => ', this.allVersionFm);
            this.checkSameValuesVersionMultiSelection();
          }
        }
        this.versionFmReady = true;
      });
  }

  public sameValuesVersionFm = {};
  public versionFmNgModel; // object with all values ('same', false and true)
  public originalsValuesVersionFm;
  public versionMultiReady: boolean = false;
  public originVersionValues;
  checkSameValuesVersionMultiSelection() { // TODO 08/07/2019
    console.log('this.allVersionFm => ', this.allVersionFm);
    this.sameValuesVersionFm = {};
    this.originVersionValues = this.allVersionFm[0].map(item => ({
      IdFicheAch_Lib_Versions: item.IdFicheAch_Lib_Versions,
      Isvalid: 'same'
    }));
    this.versionFmNgModel = this.allVersionFm[0].map(item => ({
      IdFicheAch_Lib_Versions: item.IdFicheAch_Lib_Versions,
      Isvalid: 'same'
    }));
    console.log('761 this.versionFmNgModel => ', this.versionFmNgModel);
    console.log('this.originalsValuesVersionFm =>', this.originalsValuesVersionFm);
    this.originalsValuesVersionFm = this.allVersionFm[0].map(item => item = {
      IdFicheAch_Lib_Versions: item.IdFicheAch_Lib_Versions,
      Isvalid: 'same'
    });
    console.log('coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
    console.log('this.originalsValuesVersionFm =>', this.originalsValuesVersionFm);
    console.log('this.allVersionFm => ', this.allVersionFm);
    this.sameValuesVersionFm = {};
    this.allVersionFm.map(item => {
      console.log('allVersionFm item => ', item);
      let index = this.allVersionFm.indexOf(item);
      console.log('index allVersionFm item => ', index);
      if (index < this.allFichesMateriel.length) {
        console.log('this.allVersionFm[index + 1] => ', this.allVersionFm[index + 1]);
         item.map(object => {
          let i = item.indexOf(object);
          let isPushed = false;
            console.log('index this.allVersionFm item object => ', i);
            console.log('this.allVersionFm item object => ', object);
            console.log('object.Isvalid => ', object.Isvalid);
            console.log('this.allVersionFm[0][i].Isvalid => ',this.allVersionFm[0][i].Isvalid);
            if (object.Isvalid === this.allVersionFm[0][i].Isvalid) {
              let key = object.IdFicheAch_Lib_Versions;
              console.log('this.sameValuesVersionFm[key] => ', this.sameValuesVersionFm[key]);
              if (!this.sameValuesVersionFm[key] || (this.sameValuesVersionFm[key].length === 0) || (!this.sameValuesVersionFm)) {
                  this.sameValuesVersionFm[key] = [];
                  this.sameValuesVersionFm[key].push(object.Isvalid);
                  isPushed = true;
                }
                console.log('isPushed =>', isPushed);
                console.log('!isPushed =>', !isPushed);
              if (!isPushed) {
                this.sameValuesVersionFm[key].push(object.Isvalid);
                isPushed = false;
              }
                console.log('object.Isvalid => ', object.Isvalid);
                console.log('this.sameValuesVersionFm ==> ', this.sameValuesVersionFm);
              }
            });
        }
    });
    for (let key in this.sameValuesVersionFm) {
      if (this.sameValuesVersionFm[key].length === this.allFichesMateriel.length) {
        console.log('same value to all keys in this.sameValuesVersionFm => ', key);
        for (let key2 in this.versionFmNgModel) {
          if (this.versionFmNgModel[key2].IdFicheAch_Lib_Versions === +key) {
            console.log('package attendu ==> ', this.versionFmNgModel[key2].IdFicheAch_Lib_Versions);
            console.log('this.originalsValuesVersionFm[key2].Isvalid BEFORE => ', this.originalsValuesVersionFm[key2].Isvalid);
            this.versionFmNgModel[key2].Isvalid = this.sameValuesVersionFm[key][0];
            this.originVersionValues[key2].Isvalid = this.sameValuesVersionFm[key][0];
            this.originalsValuesVersionFm[key2].Isvalid = this.sameValuesVersionFm[key][0];
            console.log('this.versionFmNgModel[key2].Isvalid => ', this.versionFmNgModel[key2].Isvalid);
            console.log('this.sameValuesVersionFm[key][0] => ', this.sameValuesVersionFm[key][0]);
          }
        }
      }
    }
    console.log('this.versionFmNgModel : end to function to display samevalues => ', this.versionFmNgModel);
    console.log('this.originVersionValues => ', this.originVersionValues);
    this.versionMultiReady = true;
  }

// ACTIONS FOR ICONS CLICK
  clearAllVersionsValue() {
    this.versionFmNgModel.map(item => {
      item.Isvalid = false;
    });
  }

  resetAllVersionsValue() {
    this.versionFmNgModel.map(item => {
      this.originVersionValues.map(oldVersion => {
        if (item.IdFicheAch_Lib_Versions === oldVersion.IdFicheAch_Lib_Versions) {
          item.Isvalid = oldVersion.Isvalid;
        }
      });
    });
  }

// DISPLAY ICONS

  displayClearVersionsIcon(): boolean {
    let itemIsvalid = [];
    this.versionFmNgModel.map(item => {
      if (item.Isvalid) {
        itemIsvalid.push(item);
      }
    });
    if (itemIsvalid.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  displayResetVersionsIcon(): boolean {
    let itemsChanged = [];
     this.versionFmNgModel.map(item => {
      this.originVersionValues.map(oldVersion => {
        if (item.IdFicheAch_Lib_Versions === oldVersion.IdFicheAch_Lib_Versions) {
          if (item.Isvalid !== oldVersion.Isvalid) {
            itemsChanged.push(item);
          }
        }
      });
    });
    if (itemsChanged.length > 0) {
      return true;
    } else {
      return false;
    }
  }

/****************************************************************/
/************************ QUALITY MANAGEMENT ********************/
/****************************************************************/

  public allQualitiesFm = [];
  getQualiteFicheMateriel(id) {
    this.qualiteService.getQualiteFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (this.selectionType !== 'multi') {
          this.qualiteFM = data;
          this.qualiteFmReady = true;
        } else {
          this.allQualitiesFm.push(data);
          if (this.allQualitiesFm.length === this.allIdSelectedFichesMateriel.length) {
            console.log('this.allQualitiesFm => ', this.allQualitiesFm);
            this.checkSameValuesQualitiesMultiSelection();
            this.qualiteFmReady = true;
          }
        }
        // console.log('qualité from FM :');
        // console.log(data);
      });
  }

  public sameValuesQualityFm = {};
  public qualityFmNgModel; // object with all values ('same', false and true)
  public originalsValuesQualityFm;
  public qualityMultiReady: boolean = false;
  public originQualityValues;

  checkSameValuesQualitiesMultiSelection() {
    console.log('this.allQualitiesFm => ', this.allQualitiesFm);
       console.log('this.allQualitiesFm => ', this.allQualitiesFm);
    this.sameValuesQualityFm = {};
    this.originQualityValues = this.allQualitiesFm[0].map(item => ({
      idLibQualiteSup: item.idLibQualiteSup,
      IsValid: 'same'
    }));
    this.qualityFmNgModel = this.allQualitiesFm[0].map(item => ({
      idLibQualiteSup: item.idLibQualiteSup,
      IsValid: 'same'
    }));
    console.log('761 this.qualityFmNgModel => ', this.qualityFmNgModel);
    console.log('this.originalsValuesQualityFm =>', this.originalsValuesQualityFm);
    this.originalsValuesQualityFm = this.allQualitiesFm[0].map(item => item = {
      idLibQualiteSup: item.idLibQualiteSup,
      IsValid: 'same'
    });
    console.log('coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
    console.log('this.originalsValuesQualityFm =>', this.originalsValuesQualityFm);
    console.log('this.allQualitiesFm => ', this.allQualitiesFm);
    this.sameValuesQualityFm = {};
    this.allQualitiesFm.map(item => {
      console.log('allQualitiesFm item => ', item);
      let index = this.allQualitiesFm.indexOf(item);
      console.log('index allQualitiesFm item => ', index);
      if (index < this.allFichesMateriel.length) {
        console.log('this.allQualitiesFm[index + 1] => ', this.allQualitiesFm[index + 1]);
         item.map(object => {
          let i = item.indexOf(object);
          let isPushed = false;
            console.log('index this.allQualitiesFm item object => ', i);
            console.log('this.allQualitiesFm item object => ', object);
            console.log('object.IsValid => ', object.IsValid);
            console.log('this.allQualitiesFm[0][i].IsValid => ', this.allQualitiesFm[0][i].IsValid);
            if (object.IsValid === this.allQualitiesFm[0][i].IsValid) {
              let key = object.idLibQualiteSup;
              console.log('this.sameValuesQualityFm[key] => ', this.sameValuesQualityFm[key]);
              if (!this.sameValuesQualityFm[key] || (this.sameValuesQualityFm[key].length === 0) || (!this.sameValuesQualityFm)) {
                  this.sameValuesQualityFm[key] = [];
                  this.sameValuesQualityFm[key].push(object.IsValid);
                  isPushed = true;
                }
                console.log('isPushed =>', isPushed);
                console.log('!isPushed =>', !isPushed);
              if (!isPushed) {
                this.sameValuesQualityFm[key].push(object.IsValid);
                isPushed = false;
              }
                console.log('object.IsValid => ', object.IsValid);
                console.log('this.sameValuesQualityFm ==> ', this.sameValuesQualityFm);
              }
            });
        }
    });
    for (let key in this.sameValuesQualityFm) {
      if (this.sameValuesQualityFm[key].length === this.allFichesMateriel.length) {
        console.log('same value to all keys in this.sameValuesQualityFm => ', key);
        for (let key2 in this.qualityFmNgModel) {
          if (this.qualityFmNgModel[key2].idLibQualiteSup === +key) {
            console.log('package attendu ==> ', this.qualityFmNgModel[key2].idLibQualiteSup);
            console.log('this.originalsValuesQualityFm[key2].IsValid BEFORE => ', this.originalsValuesQualityFm[key2].IsValid);
            this.qualityFmNgModel[key2].IsValid = this.sameValuesQualityFm[key][0];
            this.originQualityValues[key2].IsValid = this.sameValuesQualityFm[key][0];
            this.originalsValuesQualityFm[key2].IsValid = this.sameValuesQualityFm[key][0];
            console.log('this.qualityFmNgModel[key2].IsValid => ', this.qualityFmNgModel[key2].IsValid);
            console.log('this.sameValuesQualityFm[key][0] => ', this.sameValuesQualityFm[key][0]);
          }
        }
      }
    }
    console.log('this.qualityFmNgModel : end to function to display samevalues => ', this.qualityFmNgModel);
    console.log('this.originQualityValues => ', this.originQualityValues);
    this.qualityMultiReady = true;
  }

// ACTIONS FOR ICONS CLICK
  clearAllQualitiesValue() {
    this.qualityFmNgModel.map(item => {
      item.IsValid = false;
    });
  }

  resetAllQualitiesValue() {
    this.qualityFmNgModel.map(item => {
      this.originQualityValues.map(oldQuality => {
        if (item.idLibQualiteSup === oldQuality.idLibQualiteSup) {
          item.IsValid = oldQuality.IsValid;
        }
      });
    });
  }

// DISPLAY ICONS

  displayClearQualitiesIcon(): boolean {
    let itemIsValid = [];
    this.qualityFmNgModel.map(item => {
      if (item.IsValid) {
        itemIsValid.push(item);
      }
    });
    if (itemIsValid.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  displayResetQualitiesIcon(): boolean {
    let itemsChanged = [];
     this.qualityFmNgModel.map(item => {
      this.originQualityValues.map(oldQuality => {
        if (item.idLibQualiteSup === oldQuality.idLibQualiteSup) {
          if (item.IsValid !== oldQuality.IsValid) {
            itemsChanged.push(item);
          }
        }
      });
    });
    if (itemsChanged.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /************************** GET lib select Options ***************************/

  getLibs() {
    this.getAnnexStatus();
    this.getRetourOriLib();
    this.getQualiteLib();
    this.getVersionLib();
    // this.getAnnexElementsCategories();
    // this.getAnnexElementsAllSubCategories();
  }

  displayLibValueNotToChange() {
    // console.log(this.steps);
    // this.steps.push({
    //   IdLibEtape: this.valueNotToChangeLibelle,
    //   Libelle: this.valueNotToChangeLibelle
    // });
    // console.log(this.steps);
    // this.status.push({
    //   IdStatut: this.valueNotToChangeLibelle,
    //   Libelle: this.valueNotToChangeLibelle
    // });
    this.annexElementsStatus.push({
      IdStatutElementsAnnexes: this.valueNotToChangeLibelle,
      Libelle: this.valueNotToChangeLibelle
    });
    this.retourOri.push({
      IdLibRetourOri: this.valueNotToChangeLibelle,
      Libelle: this.valueNotToChangeLibelle
    });
  }

  displayCheckedQualite(id): boolean {
    if (this.selectionType !== 'multi') {
      let checked = [];
      // console.log(this.qualiteFM);
      this.qualiteFM.map(item => {
        if (item.idLibQualiteSup === id && item.IsValid) {
          // console.log(item);
          checked.push(item);
        }
      });
      if (checked.length > 0) {
        return true;
      } else {
        // console.log('non non non non qualité');
        return false;
      }
    } else {
      let checked = [];
      this.qualityFmNgModel.map(item => {
        console.log(item);
        if (item.idLibQualiteSup === id && item.IsValid ) {
          console.log(item);
          if (item.IsValid !== 'same') {
            console.log('item !== same => ', item);
            checked.push(item);
          }
        }
      });
      if (checked.length > 0) {
        return true;
      } else {
        console.log('non non non qualite');
        return false;
      }
    }
  }

  changeModelQualite(id) {
    if (this.selectionType !== 'multi') {
      this.qualiteFM.map(item => {
        if (item.idLibQualiteSup === id) {
          // console.log(item);
          item.IsValid = !item.IsValid;
          // console.log(item.isValid);
        }
      });
    } else {
      console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggggg');
      this.qualityFmNgModel.map(item => {
        if (item.idLibQualiteSup === id) {
          console.log(item);
          if (item.IsValid && item.IsValid !== 'same') {
            console.log('item.IsValid before (true)=> ', item.IsValid);
            item.IsValid = false;
          } else if (!item.IsValid || item.IsValid === 'same') {
            console.log('item.IsValid before => (false)', item.IsValid);
            item.IsValid = true;
          }
          console.log(item.IsValid);
        }
      });
    }
  }

  checkIfQualityValueIsNotValid(qualityCode): boolean {
    console.log(qualityCode);
    console.log('this.qualityFmNgModel ======> ', this.qualityFmNgModel);
    let itemIsNotValid: boolean;
    for (let key in this.qualityFmNgModel) {
      if (key) {
        console.log('key ==> ', this.qualityFmNgModel[key]);
        console.log('key IsValid ==> ', this.qualityFmNgModel[key]['IsValid']);
        if (this.qualityFmNgModel[key]['idLibQualiteSup'] === qualityCode ) {
          if ((this.qualityFmNgModel[key]['IsValid'] === 'same') || this.qualityFmNgModel[key]['IsValid'] === true) {
            itemIsNotValid = false;
          } else {
            itemIsNotValid = true;
          }
        }
      }
    }
    console.log('qualityCode => ', qualityCode, 'itemIsNotValid=> ', itemIsNotValid);
    return itemIsNotValid;
  }

  //   (click)='changeModelVersion(item.id_version)'
  // [checked]='displayCheckedVersion(item.id_version)'
  displayCheckedVersion(id) {
    if (this.selectionType !== 'multi') {
      let checked = [];
      console.log('this.versionFicheMateriel ==> ', this.versionFicheMateriel);
      this.versionFicheMateriel.map(item => {
        console.log(item);
        if (item.IdFicheAch_Lib_Versions === id && item.Isvalid) {
          console.log(item);
          checked.push(item);
        }
      });
      if (checked.length > 0) {
        return true;
      } else {
        console.log('non non non version');
        return false;
      }
    } else {
      let checked = [];
      console.log('this.versionFicheMateriel ==> ', this.versionFicheMateriel);
      this.versionFmNgModel.map(item => {
        console.log(item);
        if (item.IdFicheAch_Lib_Versions === id && item.Isvalid ) {
          console.log(item);
          if (item.Isvalid !== 'same') {
            console.log('item !== same => ', item);
            checked.push(item);
          }
        }
      });
      if (checked.length > 0) {
        return true;
      } else {
        console.log('non non non version');
        return false;
      }
    }

  }

  checkIfVersionValueIsNotValid(id_version): boolean {
    console.log(id_version);
    console.log('this.versionFmNgModel ======> ', this.versionFmNgModel);
    let itemIsNotValid: boolean;
    for (let key in this.versionFmNgModel) {
      if (key) {
        console.log('key ==> ', this.versionFmNgModel[key]);
        console.log('key Isvalid ==> ', this.versionFmNgModel[key]['Isvalid']);
        if (this.versionFmNgModel[key] ['IdFicheAch_Lib_Versions'] === id_version ) {
          if ((this.versionFmNgModel[key]['Isvalid'] === 'same') || this.versionFmNgModel[key]['Isvalid'] === true) {
            itemIsNotValid = false;
          } else {
            itemIsNotValid = true;
          }
        }
      }
    }
    console.log('id_version => ', id_version, 'itemIsNotValid=> ', itemIsNotValid);
    return itemIsNotValid;
  }

  changeModelVersion(id) {
    if (this.selectionType !== 'multi') {
      console.log('changeModelVersion()');
      this.versionFicheMateriel.map(item => {
        if (item.IdFicheAch_Lib_Versions === id) {
          console.log(item);
          item.Isvalid = !item.Isvalid;
          console.log(item.Isvalid);
        }
      });
    } else {
      console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggggg');
      this.versionFmNgModel.map(item => {
        if (item.IdFicheAch_Lib_Versions === id) {
          console.log(item);
          if (item.Isvalid && item.Isvalid !== 'same') {
            console.log('item.Isvalid before (true)=> ', item.Isvalid);
            item.Isvalid = false;
          } else if (!item.Isvalid || item.Isvalid === 'same') {
            console.log('item.Isvalid before => (false)', item.Isvalid);
            item.Isvalid = true;
          }
          console.log(item.Isvalid);
        }
      });
    }
  }

  getStepsLib() {
    this.stepsLibService.getStepsLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        // this.steps = data;
        this.allSteps = data;
        // console.log(data);
        data.map(item => {
          let id = `id${data[data.indexOf(item)].IdLibstatut}`;
          this.steps[id].push(item);
        });
        Object.keys(this.steps).map(item => {
          this.steps[item].sort((a, b) => a.ordre - b.ordre);
        });
        // console.log(this.steps);
        if (this.selectionType === 'multi') {
          let id = `id${this.valueNotToChangeLibelle}`;
          this.steps[id].unshift({
            IdLibEtape: this.valueNotToChangeLibelle,
            Libelle: this.valueNotToChangeLibelle
          });
        }
        this.stepsReady = true;
        // console.log('==============================> this.stepsReady :');
        // console.log(this.stepsReady);
        // console.log(this.steps);
      });
  }

  displayInitialStatus(newObject) {
    let libelle;
    this.status.map(item => {
      if (item.IdLibstatut === this.newObject.IdLibstatut) {
        libelle = item.Libelle;
      }
    });
    return libelle;
  }

  getStatusLib() {
    this.statusLibService.getStatusLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.status = data;
        this.status.sort((a, b) => a.ordre - b.ordre);
        // console.log(this.status);
        this.steps = {};
        if (this.selectionType === 'multi') {
          this.status.unshift({
            IdLibstatut: this.valueNotToChangeLibelle,
            Libelle: this.valueNotToChangeLibelle
          });
        }
        for (let i = 0; i < this.status.length; i++) {
          let id = `id${this.status[i].IdLibstatut}`;
          this.steps[id] = [];
          // Object.defineProperty(this.steps, id, {
          //   value: [],
          //   writable: true
          // });
          // console.log(this.steps);
          if (i === this.status.length - 1) {
            this.getStepsLib();
          }
        }
        this.statusReady = true;
        // console.log('==============================> this.statusReady :');
        // console.log(this.statusReady);
        // console.log(data);
        if (this.selectionType !== 'multi') {
          this.clickStepOptions();
        }
      });
  }

  getAnnexStatus() { // ISCALL
    console.log('getAnnexStatus CALL ');
    this.annexElementsService.getAnnexElementsStatus()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsStatus = data;
        console.log('this.annexElementsStatus => ', this.annexElementsStatus);
        this.annexElementsReady = true;
      });
  }

  getRetourOriLib() {
    this.retourOriLibService.getRetourOri()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.retourOri = data;
        // console.log(data);
        this.retourOriReady = true;
      });
  }

  getQualiteLib() {
    this.qualiteService.getQualiteLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.qualiteLib = data;
        // console.log('get qualité lib :');
        // console.log(data);
        this.qualiteReady = true;
        console.log('this.qualiteLib => ', this.qualiteLib);
      });
  }

  getVersionLib() {
    this.versionService.getVersionLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.versionLib = data;
        console.log('this.versionLib => ', this.versionLib);
      });
  }

  /***********************************************************************************/
  /***************************** ANNEXES ELEMENTS ************************************/

  getAnnexElementsFicheMateriel(IdFicheMateriel, index, length) { // ISCALL
    // lancée en même temps que le get FM
    console.log('IdFicheMateriel =>', IdFicheMateriel);
    console.log(
      'CALL GET ELEMENTS ANNEXES FICHES MATERIEL ------------------- !!!'
    );
    this.annexElementsService
      .getAnnexElementsFicheMateriel(IdFicheMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsFicheMateriel = data;
        console.log('this.annexElementsFicheMateriel => ', this.annexElementsFicheMateriel);
        this.allAnnexElementsFicheMateriel.push(data);
        if (index === length - 1) {
          console.log('this.allAnnexElementsFicheMateriel ==> ', this.allAnnexElementsFicheMateriel);
          console.log('iciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
          this.displayAnnexElementNgModel();
        }
      });
  }

  public sameValueElementsAnnexes = {};
  public originalsValuesElementsAnnexes;
  displayAnnexElementNgModel() { // iSCALL
    let sameValue = {};
    this.sameValueElementsAnnexes = {};
    this.annexElementsNgModel = this.annexElementsFicheMateriel.map(item => ({
      IdPackageAttendu: item.IdPackageAttendu,
      IsValid: 'same'
    }));
    this.originalsValuesElementsAnnexes = this.annexElementsFicheMateriel.map(item => ({
      IdPackageAttendu: item.IdPackageAttendu,
      IsValid: 'same'
    }));
    console.log('coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
    console.log('this.allAnnexElementsFicheMateriel =>', this.allAnnexElementsFicheMateriel);
    console.log('this.annexElementsFicheMateriel => ', this.annexElementsFicheMateriel);
    this.allAnnexElementsFicheMateriel.map(item => {
      console.log('item in this.allAnnexElementsFicheMateriel => ', item);
      let index = this.allAnnexElementsFicheMateriel.indexOf(item);
      console.log('index => ', index);
      if (index + 1 < this.allFichesMateriel.length) {
        console.log('this.allAnnexElementsFicheMateriel[index + 1] => ', this.allAnnexElementsFicheMateriel[index + 1]);
        item.map(object => {
          let i = item.indexOf(object);
          console.log('i => ', i);
          console.log('object => ', object);
            console.log(object);
            if (object.IsValid === this.allAnnexElementsFicheMateriel[0][i].IsValid) { // remplacer par this.allAnnexElementsFicheMateriel[index+1][i].IsValid
              let key = object.IdPackageAttendu;
              if (!this.sameValueElementsAnnexes[key] || this.sameValueElementsAnnexes[key].length === 0) {
                this.sameValueElementsAnnexes[key] = [];
                this.sameValueElementsAnnexes[key].push(object.IsValid);
              }
              this.sameValueElementsAnnexes[key].push(object.IsValid);
              console.log('object.IsValid => ', object.IsValid);
              console.log('this.sameValueElementsAnnexes ==> ', this.sameValueElementsAnnexes);
            }
        });
      }
    }); 
    for (let key in this.sameValueElementsAnnexes) {
      if (this.sameValueElementsAnnexes[key].length === this.allFichesMateriel.length) {
        console.log('same value to all keys in this.sameValueElementsAnnexes => ', key);
        for (let key2 in this.annexElementsNgModel) {
          if (this.annexElementsNgModel[key2].IdPackageAttendu === +key) {
            console.log('package attendu ==> ', this.annexElementsNgModel[key2].IdPackageAttendu);
            this.annexElementsNgModel[key2].IsValid = this.sameValueElementsAnnexes[key][0];
            this.originalsValuesElementsAnnexes[key2].IsValid = this.sameValueElementsAnnexes[key][0];
            console.log('this.annexElementsNgModel[key2].IsValid => ', this.annexElementsNgModel[key2].IsValid);
            console.log('this.sameValueElementsAnnexes[key][0] => ', this.sameValueElementsAnnexes[key][0]);
          }
        }
      }
    }
    console.log('this.originalsValuesElementsAnnexes => ', this.originalsValuesElementsAnnexes);
    console.log('this.annexElementsNgModel', this.annexElementsNgModel);
  }

  getAnnexElementsCategories() { // DONT CALL
    console.log('getAnnexElementsCategories() CALL');
    this.annexElementsService.getAnnexElementsCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsCategories = data;
        console.log('annexElementsCategories => ', this.annexElementsCategories);
      });
  }

  getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes) { // DONT CALL
    console.log('getAnnexElementsSubCategoriesByCategory CALL');
    this.annexElementsService
      .getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
      });
  }

  getAnnexElementsAllSubCategories() { // DONT CALL
    console.log('getAnnexElementsAllSubCategories() CALL');
    this.annexElementsService
      .getAnnexElementsAllSubCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        this.annexElementsAllSubCategories = data;
      });
  }

  displayCheckedElements(id) { // DONT CALL
    // for (let i = 0; i < this.annexElementsFicheMateriel.length; i++) {
    //   if (this.annexElementsFicheMateriel[i].IdPackageAttendu === id) {

    //   }
    // }
    console.log('displayCheckedElements call');
    let checked = [];
    this.annexElementsFicheMateriel.map(item => {
      if (item.IdPackageAttendu === id && item.IsValid) {
        console.log(item);
        checked.push(item);
      }
    });
    if (checked.length > 0) {
      return true;
    } else {
      console.log('non non non non');
      return false;
    }
  }

  /***********************************************************************************/

  clickAnnexElementOptions() {
    this.initAnnexElements = false;
  }

  clickStepOptions() {
    this.initValueSteps = false;
    console.log(this.initValueSteps);
  }

  clickStatusOptions() {
    // console.log(this.status);
    // console.log(
    //   'this.newObject.IdLibstatut on click statut ==== >',
    //   this.newObject.IdLibstatut
    // );
    this.initValueStatus = false;
    if (this.firstClick) {
      if (this.steps['id' + this.newObject.IdLibstatut].length > 0) {
        // console.log(this.steps['id' + this.newObject.IdLibstatut]);
        if (this.newObject.IdLibstatut === 2) {
          // STATUT ANNULEE
          if (this.newObject.RetourOri === 1) {
            // retour ori à faire (1)
            this.newObject.IdLibEtape = this.steps[
              'id' + this.newObject.IdLibstatut
            ][1].IdLibEtape; // IdLibEtape: 15, Libelle: 'Retour Ori'
            // console.log('accepté et retour ori a faire ===> ');
          } else {
            // retour ori !== 'à faire'
            this.newObject.IdLibEtape = this.steps[
              'id' + this.newObject.IdLibstatut
            ][3].IdLibEtape; // IdLibEtape: 20, Libelle: 'Terminé'
          }
        } else if (this.newObject.IdLibstatut === 3) {
          // STATUT ACCEPTE
          if (this.newObject.RetourOri === 1) {
            this.newObject.IdLibEtape = this.steps[
              'id' + this.newObject.IdLibstatut
            ][1].IdLibEtape; // IdLibEtape: 15, Libelle: 'Retour ORI'
          } else {
            this.newObject.IdLibEtape = this.steps[
              'id' + this.newObject.IdLibstatut
            ][3].IdLibEtape; // IdLibEtape: 15, Libelle: 'Retour ORI'
          }
        } else if (this.newObject.IdLibstatut === 5) {
          // STATUT Traité par un autre service
          this.newObject.IdLibEtape = this.steps[
            'id' + this.newObject.IdLibstatut
          ][2].IdLibEtape;
          // IdLibEtape: 24, Libelle: 'Traité par un autre service'
        } else {
          this.newObject.IdLibEtape = this.steps[
            'id' + this.newObject.IdLibstatut
          ][0].IdLibEtape;
        }
      }
      this.firstClick = false;
    } else {
      this.firstClick = true;
    }
  }

  displayStepValue(step) {
    // console.log(step);
    if (step.Libelle !== 'valueNotToChangeLibelle') {
      return step.IdLibEtape;
    } else {
      return step.Libelle;
    }
  }

  clickRetourOriOptions() {
    this.initValueRetourOri = false;
  }

  deleteData(field) {
    field = '';
    console.log(this.newObject);
  }

  checkAcceptationSelectionRadio() {
    if (this.disabledDateAcceptation) {
      return false;
    } else {
      return true;
    }
  }

  displayAcceptaionSelectionRadio() {
    this.newObject.Renouvellement = 0;
    this.disabledDateAcceptation = false;
    // console.log(this.newObject.Renouvellement);
  }

  checkRenouvellementSelectionRadio() {
    if (this.newObject.Renouvellement === 1) {
      this.disabledDateAcceptation = true;
      return 'checked';
    } else if (this.newObject.Renouvellement === this.valueNotToChangeLibelle) {
      this.disabledDateAcceptation = true;
    }
  }

  displayRenouvellementSelectionRadio() {
    this.newObject.Renouvellement = 1;
    this.disabledDateAcceptation = true;
    this.newObject.DateAcceptation = null;
    // console.log(this.newObject.Renouvellement);
  }

  /************************** Buttons 'Elements annexes' *****************************/

  checkModifiedElementAnnex(annexElementArray, value, state) {
    let modifiedElement = [];
    annexElementArray.map(item => {
      if (state === 'same') {
        if (item.IsValid === value) {
          modifiedElement.push(item);
        }
      } else if (state === 'different') {
        if (item.IsValid !== value) {
          modifiedElement.push(item);
        }
      }
    });
    if (modifiedElement.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  resetElementAnnex(annexElementArray, value) {
    return annexElementArray.map(item => {
      item.IsValid = value;
    });
  }
  /********************************************************************************/

  addJustCommentSwal() {
    // console.log(this.newObject.CommentairesStatutEtape);
    let title;
    let cancelMessage;
    if (
      this.newObject.CommentairesStatutEtape === '' ||
      this.newObject.CommentairesStatutEtape === null
    ) {
      title = 'Ajouter un commentaire pour Statuts/Etapes';
      cancelMessage = 'Aucun Commentaire';
    } else {
      title = 'Changer le commentaire pour Statuts/Etapes';
      cancelMessage = 'Annuler';
    }
    swal({
      title: title,
      input: 'textarea',
      showCancelButton: true,
      cancelButtonText: cancelMessage,
      confirmButtonText: 'Valider',
      confirmButtonColor: 'rgb(23, 170, 178)'
    }).then(result => {
      if (result.value) {
        this.newObject.CommentairesStatutEtape = result.value;
        console.log(
          'this.newObject.CommentairesStatutEtape',
          this.newObject.CommentairesStatutEtape
        );
      }
    });
  }

  displayDeliveryDateModelComment(comment) {
    this.newObject.CommentairesDateLivraison = comment;
    console.log(
      `Delivery Date Comment : '${this.newObject.CommentairesDateLivraison}'`
    );
    console.log(this.newObject);
  }

  displayStepsStatusModelComment(comment) {
    this.newObject.CommentairesStatutEtape = comment;
  }

  displayPreviousStatus(lastStatus) {
    this.newObject.IdLibstatut = lastStatus;
  }

  /*************** Comments *****************/

  getCommentaireAnnexElementsFicheMateriel(selectedId) {
    console.log('call comment GET function');
    let IdFicheMateriel = selectedId.idFicheMateriel;
    this.annexElementsService.getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (this.storeFichesToModif.modificationType !== 'multi') { // DISPLAY COMMENTS TO SIMPLE MODIF
          this.comments = data;
          this.refreshEACommentModel = this.refreshEACommentModel++;
        } else {  // GET allEACommentsMultiSelect (all comments) TO MULTI MODIF
          console.log('GET allEACommentsMultiSelect (all comments) TO MULTI MODIF');
          let allFmlength = this.storeFichesToModif.selectedFichesMateriel.length;
          let index = this.storeFichesToModif.selectedFichesMateriel.indexOf(selectedId);
          console.log('this.allEACommentsMultiSelect before push => ', this.allEACommentsMultiSelect);
          data.map(item => {
            this.allEACommentsMultiSelect.push(item);
          });
          this.allEACommentsMultiSelect = [...new Set(this.allEACommentsMultiSelect)]; // remove same value
          console.log('this.allEACommentsMultiSelect => ', this.allEACommentsMultiSelect);
          this.refreshEACommentModel = this.refreshEACommentModel++;
          if (index === allFmlength - 1) {
            this.allEACommentsMultiSelect.map(item => {
              if (this.sameComments[item.idLibCategorieElementsAnnexes]) {
                this.sameComments[item.idLibCategorieElementsAnnexes].push(item.Commentaire);
              } else {
                this.sameComments[item.idLibCategorieElementsAnnexes] = [];
                this.sameComments[item.idLibCategorieElementsAnnexes].push(item.Commentaire);
              }
            });
            let newnew = {};
            for (let key in this.sameComments) {
              if (this.sameComments[key].length === allFmlength) {
                this.sameComments[key].map(item => {
                  if (item === this.sameComments[key][0]) {
                    if (newnew[key]) {
                      newnew[key].push(item);
                    } else {
                      newnew[key] = [];
                      newnew[key].push(item);
                    }
                  }
                });
                if (newnew[key].length === allFmlength) {
                  this.sameEAComments.push({
                    IdCategorieElementsAnnexesCommentaire: 'same',
                    idLibCategorieElementsAnnexes: +key,
                    IdFicheMateriel: 'same',
                    Commentaire: this.sameComments[key][0]
                  });
                }

              }
            }
            console.log('this.sameEAComments =>', this.sameEAComments);
          }
        }
      });
  }

}
