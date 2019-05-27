import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { browserRefresh } from '../../../../apps/fiches-materiel/src/app/app.component';
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

  public browserRefresh: boolean;

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
    this.browserRefresh = browserRefresh;
    if (browserRefresh) {
      this.router.navigate(['/material-sheets/my-material-sheets/0/asc']);
    }
    this.store.pipe(takeUntil(this.onDestroy$)).subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
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
    console.log(this.newObject);
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
        this.getCommentaireAnnexElementsFicheMateriel(this.storeFichesToModif.selectedFichesMateriel[0].idFicheMateriel);
    } else {
      console.log('this.storeFichesToModif.modificationType !== multi => ', this.storeFichesToModif);
      this.storeFichesToModif.selectedFichesMateriel.map(item => {
        this.getCommentaireAnnexElementsFicheMateriel(item.idFicheMateriel);
      });
    }
  }

  /************************ Datepicker / Date functions ********************/

  changeDateFormat(originalDate) {
    // console.log(originalDate);
    // let date = new Date(this.newObject[originalDate]);
    // console.log(new Date(this.newObject[originalDate]));
    // let defaultFormat = 'dd-mm-yyyy';
    // if (this.selectionType === 'one') {
    //   if (this.newObject[originalDate] !== undefined && this.newObject[originalDate] !== null) { // DATE RETOUR ORI
    //     console.log(date.getFullYear());
    //     let dateNgFormat = {
    //       year: new Date(this.newObject[originalDate]).getFullYear(),
    //       month: new Date(this.newObject[originalDate]).getMonth() + 1,
    //       day: new Date(this.newObject[originalDate]).getDate()
    //     };
    //     this.newObject[originalDate] = dateNgFormat;
    //   } else {
    //     this.newObject[originalDate] = defaultFormat;
    //   }
    // } else {
    //   this.newObject[originalDate] = this.valueNotToChangeLibelle;
    // }
    // console.log(originalDate);

    let defaultFormat = 'dd-mm-yyyy';
    if (this.selectionType === 'one') {
      if (
        this.newObject.DateRetourOri !== undefined &&
        this.newObject.DateRetourOri !== null
      ) {
        // DATE RETOUR ORI
        this.retourDateOriNgFormat = {
          year: new Date(this.newObject.DateRetourOri).getFullYear(),
          month: new Date(this.newObject.DateRetourOri).getMonth() + 1,
          day: new Date(this.newObject.DateRetourOri).getDate()
        };
        this.newObject.DateRetourOri = this.retourDateOriNgFormat;
      } else {
        this.newObject.DateRetourOri = defaultFormat;
      }
      if (
        this.newObject.Deadline !== undefined &&
        this.newObject.Deadline !== null
      ) {
        // DATE DEADLINE
        this.deadLineNgFormat = {
          year: new Date(this.newObject.Deadline).getFullYear(),
          month: new Date(this.newObject.Deadline).getMonth() + 1,
          day: new Date(this.newObject.Deadline).getDate()
        };
        this.newObject.Deadline = this.deadLineNgFormat;
        // console.log(
        //   `${this.newObject.Deadline.year}-${this.newObject.Deadline.month}-${
        //     this.newObject.Deadline.day
        //   }T00:00:00`
        // );
      } else {
        this.newObject.Deadline = defaultFormat;
      }
      if (
        this.newObject.DateLivraison !== undefined &&
        this.newObject.DateLivraison !== null
      ) {
        // DATE LIVRAISON
        this.livraisonDateNgFormat = {
          year: new Date(this.newObject.DateLivraison).getFullYear(),
          month: new Date(this.newObject.DateLivraison).getMonth() + 1,
          day: new Date(this.newObject.DateLivraison).getDate()
        };
        this.newObject.DateLivraison = this.livraisonDateNgFormat;
      } else {
        this.newObject.DateLivraison = defaultFormat;
      }
      if (
        this.newObject.DatePremiereDiff !== undefined &&
        this.newObject.DatePremiereDiff !== null
      ) {
        // DATE PREMIERE DIFF
        this.diffDateNgFormat = {
          year: new Date(this.newObject.DatePremiereDiff).getFullYear(),
          month: new Date(this.newObject.DatePremiereDiff).getMonth() + 1,
          day: new Date(this.newObject.DatePremiereDiff).getDate()
        };
        this.newObject.DatePremiereDiff = this.diffDateNgFormat;
      } else {
        this.newObject.DatePremiereDiff = defaultFormat;
      }
      if (
        this.newObject.DateAcceptation !== undefined &&
        this.newObject.DateAcceptation !== null
      ) {
        // DATE ACCEPTATION
        this.acceptationDateNgFormat = {
          year: new Date(this.newObject.DateAcceptation).getFullYear(),
          month: new Date(this.newObject.DateAcceptation).getMonth() + 1,
          day: new Date(this.newObject.DateAcceptation).getDate()
        };
        this.newObject.DateAcceptation = this.acceptationDateNgFormat;
      } else {
        this.newObject.DateAcceptation = defaultFormat;
      }
      if (
        this.newObject.ReceptionAccesLabo !== undefined &&
        this.newObject.ReceptionAccesLabo !== null
      ) {
        // DATE RECEPTION ACCES LABO
        this.accLaboDateNgFormat = {
          year: new Date(this.newObject.ReceptionAccesLabo).getFullYear(),
          month: new Date(this.newObject.ReceptionAccesLabo).getMonth() + 1,
          day: new Date(this.newObject.ReceptionAccesLabo).getDate()
        };
        this.newObject.ReceptionAccesLabo = this.accLaboDateNgFormat;
      } else {
        this.newObject.ReceptionAccesLabo = defaultFormat;
      }
    } else {
      this.newObject.DateRetourOri = this.valueNotToChangeLibelle;
      this.newObject.Deadline = this.valueNotToChangeLibelle;
      this.newObject.DateLivraison = this.valueNotToChangeLibelle;
      this.newObject.DatePremiereDiff = this.valueNotToChangeLibelle;
      this.newObject.DateAcceptation = this.valueNotToChangeLibelle;
      this.newObject.ReceptionAccesLabo = this.valueNotToChangeLibelle;
    }
  }

  /*****************************************************************************/
  /**************************** GET Fiche Materiel *****************************/

  getFicheMateriel(id: number, index, length) {
    // console.log(index);
    // console.log(length);
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
          }
          if (index === length - 1) {
            this.displayNewObject(length, data[0]);
            this.dataIdFicheMaterielReady = true;
          } else {
            this.dataIdFicheMaterielReady = true;
          }
        }
      });
    console.log('allFichesMateriel => ', this.allFichesMateriel);
  }

  displayNewObject(length, ficheMateriel) {
    if (length === 1) {
      this.newObject = ficheMateriel;
      this.detailedReportLink = `${urlDetailedReportFicheAchat}${
        ficheMateriel.IdFicheAchat
      }`;
      this.getFicheAchat(ficheMateriel.IdFicheAchat);
      this.getFicheAchatDetail(ficheMateriel.IdFicheAchat);
      this.changeDateFormat('arg');
      // this.arrayDateFicheMateriel.forEach(item => this.changeDateFormat(item));
    } else {
      this.displayLibValueNotToChange();
    }
  }

  getQualiteFicheMateriel(id) {
    this.qualiteService.getQualiteFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.qualiteFM = data;
        this.qualiteFmReady = true;
        // console.log('qualité from FM :');
        // console.log(data);
      });
  }

  // versionArrayIdExist
  getVersionFicheMateriel(id) {
    // Get Version from Fiche Materiel
    this.versionService.getVersionFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.versionFicheMateriel = data;
        this.versionFmReady = true;
        // console.log(data);
      });
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

  displayCheckedQualite(id) {
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
  }

  changeModelQualite(id) {
    this.qualiteFM.map(item => {
      if (item.idLibQualiteSup === id) {
        // console.log(item);
        item.IsValid = !item.IsValid;
        // console.log(item.isValid);
      }
    });
  }

  //   (click)='changeModelVersion(item.id_version)'
  // [checked]='displayCheckedVersion(item.id_version)'
  displayCheckedVersion(id) {
    let checked = [];
    // console.log(this.versionFicheMateriel);
    this.versionFicheMateriel.map(item => {
      // console.log(item);
      if (item.IdFicheAch_Lib_Versions === id && item.Isvalid) {
        // console.log(item);
        checked.push(item);
      }
    });
    if (checked.length > 0) {
      return true;
    } else {
      // console.log('non non non version');
      return false;
    }
  }

  changeModelVersion(id) {
    this.versionFicheMateriel.map(item => {
      if (item.IdFicheAch_Lib_Versions === id) {
        // console.log(item);
        item.Isvalid = !item.Isvalid;
        // console.log(item.Isvalid);
      }
    });
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
        this.clickStepOptions();
      });
  }

  getAnnexStatus() {
    this.annexElementsService.getAnnexElementsStatus()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsStatus = data;
        // console.log(this.annexElementsStatus);
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
      });
  }

  getVersionLib() {
    this.versionService.getVersionLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.versionLib = data;
        // console.log(data);
      });
  }

  /***********************************************************************************/
  /***************************** ANNEXES ELEMENTS ************************************/

  getAnnexElementsFicheMateriel(IdFicheMateriel, index, length) {
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
        this.allAnnexElementsFicheMateriel.push(data);
        if (index === length - 1) {
          this.displayAnnexElementNgModel();
        }
      });
  }

  displayAnnexElementNgModel() {
    this.annexElementsNgModel = this.annexElementsFicheMateriel.map(item => ({
      IdPackageAttendu: item.IdPackageAttendu,
      IsValid: 'same'
    }));
    // console.log('annexElementsNgModel : ', this.annexElementsNgModel);
  }

  getAnnexElementsCategories() {
    this.annexElementsService.getAnnexElementsCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsCategories = data;
        console.log('annexElementsCategories => ', this.annexElementsCategories);
      });
  }

  getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes) {
    this.annexElementsService
      .getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
      });
  }

  getAnnexElementsAllSubCategories() {
    this.annexElementsService
      .getAnnexElementsAllSubCategories()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        this.annexElementsAllSubCategories = data;
      });
  }

  displayCheckedElements(id) {
    // for (let i = 0; i < this.annexElementsFicheMateriel.length; i++) {
    //   if (this.annexElementsFicheMateriel[i].IdPackageAttendu === id) {

    //   }
    // }
    let checked = [];
    this.annexElementsFicheMateriel.map(item => {
      if (item.IdPackageAttendu === id && item.IsValid) {
        // console.log(item);
        checked.push(item);
      }
    });
    if (checked.length > 0) {
      return true;
    } else {
      // console.log('non non non non');
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

  getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel: number) {
    console.log('IdFicheMateriel => ', IdFicheMateriel);
    console.log('GET COMMENT elements annexes in fiche materiel component !!!!', this.comments);
    this.annexElementsService.getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log('commentaire pour idFIcheMateriel n°', IdFicheMateriel, ' ==> ', data);
        console.log(this.storeFichesToModif.modificationType);
        if (this.storeFichesToModif.modificationType !== 'multi') { // DISPLAY COMMENTS TO SIMPLE MODIF
          console.log('Commentaire Elements Annexes Fiches Matériel ============================================>', data);
          this.comments = data;
          this.refreshEACommentModel = this.refreshEACommentModel++;
        } else {  // GET allEACommentsMultiSelect (all comments) TO MULTI MODIF
          console.log('Comments in multi selection ==> ', data);
          // this.comments = data;
          data.map(item => {
            this.allEACommentsMultiSelect.push(item);
            console.log('this.allEACommentsMultiSelect ===> ', this.allEACommentsMultiSelect);
          });
          this.allEACommentsMultiSelect = [...new Set(this.allEACommentsMultiSelect)]; // remove same value
          console.log('this.allEACommentsMultiSelect2 ===> ', this.allEACommentsMultiSelect);
          this.refreshEACommentModel = this.refreshEACommentModel++;
        }
      });
  }

}
