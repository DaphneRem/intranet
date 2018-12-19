import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

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
export class FichesMaterielModificationInterfaceComponent
  implements OnInit, OnDestroy {
  public initialFichesMateriel = [];

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

  public status: any;
  public statusReady: Boolean = false;
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
    Fiche_Mat_ElementsAnnexes: [
      // {
      //   IdElementsAnnexes: 1705,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 1,
      //   IsValid: null,
      //   libelle: 'Trailer'
      // },
      // {
      //   IdElementsAnnexes: 1706,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 2,
      //   IsValid: null,
      //   libelle: 'Script timecodé'
      // },
      // {
      //   IdElementsAnnexes: 1707,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 3,
      //   IsValid: null,
      //   libelle: 'Music cue sheet'
      // },
      // {
      //   IdElementsAnnexes: 1708,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 4,
      //   IsValid: null,
      //   libelle: 'Matériel publicitaire'
      // },
      // {
      //   IdElementsAnnexes: 1709,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 5,
      //   IsValid: null,
      //   libelle: 'STL multilingue'
      // },
      // {
      //   IdElementsAnnexes: 1710,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 6,
      //   IsValid: null,
      //   libelle: 'STL S&M'
      // },
      // {
      //   IdElementsAnnexes: 1711,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 7,
      //   IsValid: null,
      //   libelle: 'Visuels'
      // },
      // {
      //   IdElementsAnnexes: 1712,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 8,
      //   IsValid: null,
      //   libelle: 'Synopsis'
      // },
      // {
      //   IdElementsAnnexes: 1713,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 9,
      //   IsValid: null,
      //   libelle: 'Crédits'
      // },
      // {
      //   IdElementsAnnexes: 1714,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 10,
      //   IsValid: null,
      //   libelle: 'Autre(s)'
      // },
      // {
      //   IdElementsAnnexes: 1715,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 11,
      //   IsValid: null,
      //   libelle: 'Making of'
      // },
      // {
      //   IdElementsAnnexes: 1716,
      //   IdFicheMateriel: 156,
      //   IdPackageAttendu: 12,
      //   IsValid: null,
      //   libelle: 'Fichier audiodescription'
      // }
    ],
    // Fiche_Mat_LibEtape: {
    //   IdLibEtape: this.valueNotToChangeLibelle,
    //   Libelle: this.valueNotToChangeLibelle
    // },
    Fiche_Mat_LibRetourOri: this.valueNotToChangeLibelle,
    // Fiche_Mat_Libstatut: {
    //   IdStatut: this.valueNotToChangeLibelle,
    //   Libelle: this.valueNotToChangeLibelle
    // },
    Fiche_Mat_LibStatutElementsAnnexes: this.valueNotToChangeLibelle,
    Fiche_Mat_HistoriqueDateLivraison: this.valueNotToChangeLibelle,
    Fiche_Mat_HistoriqueStatutEtape: this.valueNotToChangeLibelle,
    Fiche_Mat_Qualite: this.valueNotToChangeLibelle,
    Fiche_Mat_StatutElementsAnnexes: this.valueNotToChangeLibelle,
    Fiche_Mat_Version: this.valueNotToChangeLibelle
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
    private store: Store<FicheMaterielModification>
  ) {}

  ngOnInit() {
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    // this.allIdSelectedFichesMateriel = this.storeFichesToModif.selectedFichesMateriel;
    this.checkAllIdSelected();
    this.getLibs();
    this.getAllFichesMateriel(this.storeFichesToModif.selectedFichesMateriel);
    this.displaySelectionMode(this.storeFichesToModif);
  }

  ngOnDestroy() {
    this.store.dispatch({
      type: 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF',
      payload: {}
    });
  }


  disabledDeadline() { // A MODIFIER PAR LA SUITE => LA CONDITION CHANGE CAR LES ID CHANGENT
    if (this.newObject.IdLibEtape === 17 || this.newObject.IdLibstatut === 3 || this.newObject.IdLibstatut === 5) {
      return true;
    } else {
      return false;
    }
  }

  displayOriLastDeadline(deliveryDate) {
    console.log(deliveryDate);
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
    this.fichesAchatService.getGlobalFIcheAchat(id).subscribe(data => {
      this.ficheAchat = data;
      console.log(this.ficheAchat);
      this.ficheAchatReady = true;
    });
  }

  getFicheAchatDetail(id) {
    this.fichesAchatService.getFichesAchatDetails(id).subscribe(data => {
      this.ficheAchatDetail = data[0];
      console.log(this.ficheAchatDetail);
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
  }

  /************************ Datepicker / Date functions ********************/

  displayPlaceholderDatepicker(e) {
    if (this.selectionType === 'one') {
      if (e !== undefined && e !== null) {
        return e;
      }
      return 'dd-mm-yyyy';
    } else {
      return this.valueNotToChangeLibelle;
    }
  }

  changeDateFormat() {
    if (this.newObject.DateRetourOri) {
      this.retourDateOriNgFormat = {
        year: new Date(this.newObject.DateRetourOri).getFullYear(),
        month: new Date(this.newObject.DateRetourOri).getMonth() + 1,
        day: new Date(this.newObject.DateRetourOri).getDate()
      };
      this.newObject.DateRetourOri = this.retourDateOriNgFormat;
    }
    if (this.newObject.Deadline) {
      // '2018-08-20T11:50:23'
      console.log(this.newObject.Deadline);
      this.deadLineNgFormat = {
        year: new Date(this.newObject.Deadline).getFullYear(),
        month: new Date(this.newObject.Deadline).getMonth() + 1,
        day: new Date(this.newObject.Deadline).getDate()
      };
      this.newObject.Deadline = this.deadLineNgFormat;
      console.log(
        `${this.newObject.Deadline.year}-${this.newObject.Deadline.month}-${
          this.newObject.Deadline.day
        }T00:00:00`
      );
    }
    if (this.newObject.DateLivraison !== null) {
      console.log('date de livraison : ');
      console.log(this.newObject.DateLivraison);
      this.livraisonDateNgFormat = {
        year: new Date(this.newObject.DateLivraison).getFullYear(),
        month: new Date(this.newObject.DateLivraison).getMonth() + 1,
        day: new Date(this.newObject.DateLivraison).getDate()
      };
      this.newObject.DateLivraison = this.livraisonDateNgFormat;
    }
    if (this.newObject.DatePremiereDiff !== null) {
      this.diffDateNgFormat = {
        year: new Date(this.newObject.DatePremiereDiff).getFullYear(),
        month: new Date(this.newObject.DatePremiereDiff).getMonth() + 1,
        day: new Date(this.newObject.DatePremiereDiff).getDate()
      };
      this.newObject.DatePremiereDiff = this.diffDateNgFormat;
    }
    if (this.newObject.DateAcceptation !== null) {
      this.acceptationDateNgFormat = {
        year: new Date(this.newObject.DateAcceptation).getFullYear(),
        month: new Date(this.newObject.DateAcceptation).getMonth() + 1,
        day: new Date(this.newObject.DateAcceptation).getDate()
      };
      this.newObject.DateAcceptation = this.acceptationDateNgFormat;
    }
    if (this.newObject.ReceptionAccesLabo !== null) {
      this.accLaboDateNgFormat = {
        year: new Date(this.newObject.ReceptionAccesLabo).getFullYear(),
        month: new Date(this.newObject.ReceptionAccesLabo).getMonth() + 1,
        day: new Date(this.newObject.ReceptionAccesLabo).getDate()
      };
      this.newObject.ReceptionAccesLabo = this.accLaboDateNgFormat;
    }
  }

  /*****************************************************************************/
  /**************************** GET Fiche Materiel *****************************/

  getFicheMateriel(id: number, index, length) {
    console.log(index);
    console.log(length);
    this.fichesMaterielService.getOneFicheMateriel(id).subscribe(data => {
      if (data) {
        this.allFichesMateriel.push(data[0]);
        this.initialFichesMateriel.push(data[0]);
        if (length === 1) {
          this.getQualiteFicheMateriel(id);
          this.getVersionFicheMateriel(id);
          this.getAnnexElementsFicheMateriel(id);
        }
        if (index === length - 1) {
          this.displayNewObject(length, data[0]);
          this.dataIdFicheMaterielReady = true;
        } else {
          this.dataIdFicheMaterielReady = true;
        }
      }
    });
    console.log(this.allFichesMateriel);
  }

  displayNewObject(length, ficheMateriel) {
    if (length === 1) {
      this.newObject = ficheMateriel;
      this.getFicheAchat(ficheMateriel.IdFicheAchat);
      this.getFicheAchatDetail(ficheMateriel.IdFicheAchat);
      this.changeDateFormat();
    } else {
      this.displayLibValueNotToChange();
    }
  }

  getQualiteFicheMateriel(id) {
    this.qualiteService
      .getQualiteFicheMateriel(id)
      .subscribe(data => {
        this.qualiteFM = data;
        this.qualiteFmReady = true;
        console.log('qualité from FM :');
        console.log(data);
      });
  }

  // versionArrayIdExist
  getVersionFicheMateriel(id) {
    // Get Version from Fiche Materiel
    this.versionService
      .getVersionFicheMateriel(id)
      .subscribe(data => {
        this.versionFicheMateriel = data;
        this.versionFmReady = true;
        console.log(data);
    });
  }

  /************************** GET lib select Options ***************************/

  getLibs() {
    this.getStatusLib();
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

                  //   (click)="changeModelVersion(item.id_version)"
                  // [checked]="displayCheckedVersion(item.id_version)"
  displayCheckedVersion(id) {
    let checked = [];
    console.log(this.versionFicheMateriel);
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
  }

  changeModelVersion(id) {
    this.versionFicheMateriel.map(item => {
      if (item.IdFicheAch_Lib_Versions === id) {
        console.log(item);
        item.Isvalid = !item.Isvalid;
        console.log(item.Isvalid);
      }
    });
  }

  getStepsLib() {
    this.stepsLibService.getStepsLib().subscribe(data => {
      // this.steps = data;
      this.allSteps = data;
      console.log(data);
      data.map(item => {
        let id = `id${data[data.indexOf(item)].IdLibstatut}`;
        this.steps[id].push(item);
      });
      if (this.selectionType === 'multi') {
        let id = `id${this.valueNotToChangeLibelle}`;
        this.steps[id].unshift({
          IdLibEtape: this.valueNotToChangeLibelle,
          Libelle: this.valueNotToChangeLibelle
        });
      }
      this.stepsReady = true;
      console.log(this.steps);
    });
  }

  getStatusLib() {
    this.statusLibService.getStatusLib().subscribe(data => {
      this.status = data;
      console.log(this.status);
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
        console.log(this.steps);
        if (i === this.status.length - 1) {
          this.getStepsLib();
        }
      }

      this.statusReady = true;
      console.log(data);
    });
  }

  getAnnexStatus() {
    this.annexElementsService.getAnnexElementsStatus().subscribe(data => {
      this.annexElementsStatus = data;
      console.log(this.annexElementsStatus);
      this.annexElementsReady = true;
    });
  }

  getRetourOriLib() {
    this.retourOriLibService
      .getRetourOri()
      .subscribe(data => {
        this.retourOri = data;
        console.log(data);
        this.retourOriReady = true;
      });
  }

  getQualiteLib() {
    this.qualiteService
      .getQualiteLib()
      .subscribe(data => {
        this.qualiteLib = data;
        console.log('get qualité lib :');
        console.log(data);
        this.qualiteReady = true;
      });
  }

  getVersionLib() {
    this.versionService
      .getVersionLib()
      .subscribe(data => {
        this.versionLib = data;
        console.log(data);
      });
  }

  /***********************************************************************************/
  /***************************** ANNEXES ELEMENTS ************************************/


  getAnnexElementsFicheMateriel(IdFicheMateriel) { // lancée en même temps que le get FM
    this.annexElementsService
      .getAnnexElementsFicheMateriel(IdFicheMateriel)
      .subscribe(data => {
        this.annexElementsFicheMateriel = data;
        console.log(data);
      });
  }

  getAnnexElementsCategories() {
    this.annexElementsService
      .getAnnexElementsCategories()
      .subscribe(data => {
        this.annexElementsCategories = data;
        console.log(data);
      });
  }

  getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes) {
    this.annexElementsService
      .getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes)
      .subscribe(data => {
        console.log(data);
      });
  }

  getAnnexElementsAllSubCategories() {
    this.annexElementsService
      .getAnnexElementsAllSubCategories()
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
    this.initValueStatus = false;
    if (this.steps['id' + this.newObject.IdLibstatut].length > 0) {
      console.log(this.steps['id' + this.newObject.IdLibstatut]);
      this.newObject.IdLibEtape = this.steps['id' + this.newObject.IdLibstatut][0].IdLibEtape;
    }
      console.log(this.newObject.IdLibEtape);
      console.log(this.steps);
      console.log(this.newObject.IdLibstatut);
      // this.newObject.IdLibEtape = this.steps['id' + this.newObject.IdLibstatut][0].IdLibEtape;
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
    console.log(this.newObject.Renouvellement);
  }

  checkRenouvellementSelectionRadio() {
    if (this.newObject.Renouvellement) {
      return 'checked';
    }
  }

  displayRenouvellementSelectionRadio() {
    this.newObject.Renouvellement = 1;
    this.disabledDateAcceptation = true;
    console.log(this.newObject.Renouvellement);
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
}
