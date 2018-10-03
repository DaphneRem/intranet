import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';

import { StepsLibService } from '../services/steps-lib.service';
import { StatusLibService } from '../services/status-lib.service';

import { AnnexElementsService } from '../services/annex-elements.service';
import { AnnexElement } from '../models/annex-element';

import { QualiteService } from '../services/qualite.service';
import { Qualite } from '../models/qualite';

import { VersionService } from '../services/version.service';
import { Version, VersionLib } from '../models/version';

import { RetourOriLibService } from '../services/retour-ori-lib.service';

import { CustomDatepickerI18n, I18n } from '../services/custom-datepicker-i18n';
import { NgbDatepickerI18n, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../services/custom-parser-formatter-datepiker';

import { NewObject } from './fiche-materiel-new-object';

import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';

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

  public deadLineNgFormat: NgbDateStruct;
  public deadlineNewStringFormat;
  public livraisonDateNgFormat: NgbDateStruct;
  public diffDateNgFormat: NgbDateStruct;
  public acceptationDateNgFormat: NgbDateStruct;
  public accLaboDateNgFormat: NgbDateStruct;
  public retourDateOriNgFormat: NgbDateStruct;

  public ficheAchat;
  public ficheAchatReady: Boolean = false;

  public globalStore;
  public storeFichesToModif;

  public selectionType: string;
  public multiOeuvre: boolean;
  public multiFichesAchat: boolean;

  public steps: any;
  public stepsReady: Boolean = false;
  public initValueSteps: Boolean = true;

  public status: any;
  public statusReady: Boolean = false;
  public initValueStatus: Boolean = true;

  public annexElements: any;
  public annexElementsReady: Boolean = false;
  public initAnnexElements: Boolean = true;
  public annexElementsFicheMateriel: any;

  public retourOri: any;
  public retourOriReady: Boolean = false;
  public initValueRetourOri: Boolean = true;

  public qualite: any;
  public qualiteReady: Boolean = false;
  public qualiteFicheMateriel: any = [];
  public qualiteArrayIdExist: any = [];
  public qualitePresent;
  public selectedQuality: any = [];

  public versionFicheMateriel: any = [];
  public versionLib: any;
  public versionPresent: any;
  public versionArrayIdExist: any = [];
  public selectedVersion: any = [];

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
    Fiche_Mat_ElementsAnnexes: [
      {
        IdElementsAnnexes: 1705,
        IdFicheMateriel: 156,
        IdPackageAttendu: 1,
        IsValid: null,
        libelle: 'Trailer'
      },
      {
        IdElementsAnnexes: 1706,
        IdFicheMateriel: 156,
        IdPackageAttendu: 2,
        IsValid: null,
        libelle: 'Script timecodé'
      },
      {
        IdElementsAnnexes: 1707,
        IdFicheMateriel: 156,
        IdPackageAttendu: 3,
        IsValid: null,
        libelle: 'Music cue sheet'
      },
      {
        IdElementsAnnexes: 1708,
        IdFicheMateriel: 156,
        IdPackageAttendu: 4,
        IsValid: null,
        libelle: 'Matériel publicitaire'
      },
      {
        IdElementsAnnexes: 1709,
        IdFicheMateriel: 156,
        IdPackageAttendu: 5,
        IsValid: null,
        libelle: 'STL multilingue'
      },
      {
        IdElementsAnnexes: 1710,
        IdFicheMateriel: 156,
        IdPackageAttendu: 6,
        IsValid: null,
        libelle: 'STL S&M'
      },
      {
        IdElementsAnnexes: 1711,
        IdFicheMateriel: 156,
        IdPackageAttendu: 7,
        IsValid: null,
        libelle: 'Visuels'
      },
      {
        IdElementsAnnexes: 1712,
        IdFicheMateriel: 156,
        IdPackageAttendu: 8,
        IsValid: null,
        libelle: 'Synopsis'
      },
      {
        IdElementsAnnexes: 1713,
        IdFicheMateriel: 156,
        IdPackageAttendu: 9,
        IsValid: null,
        libelle: 'Crédits'
      },
      {
        IdElementsAnnexes: 1714,
        IdFicheMateriel: 156,
        IdPackageAttendu: 10,
        IsValid: null,
        libelle: 'Autre(s)'
      },
      {
        IdElementsAnnexes: 1715,
        IdFicheMateriel: 156,
        IdPackageAttendu: 11,
        IsValid: null,
        libelle: 'Making of'
      },
      {
        IdElementsAnnexes: 1716,
        IdFicheMateriel: 156,
        IdPackageAttendu: 12,
        IsValid: null,
        libelle: 'Fichier audiodescription'
      }
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

  displaySelectionMode(storeFichesToModif) {
    this.selectionType = storeFichesToModif.modificationType;
    this.multiOeuvre = storeFichesToModif.multiOeuvre;
    this.multiFichesAchat = storeFichesToModif.multiFicheAchat;
    console.log('selection Type : ' + this.selectionType);
    console.log('multi oeuvre : ' + this.multiOeuvre);
    console.log('multi fiches achat : ' + this.multiFichesAchat);
  }

  displayQualiteChecked(item) {
    console.log(item);
    if (this.qualiteFicheMateriel === null) {
      console.log('null');
      this.selectedQuality = [item];
    } else if (this.qualiteFicheMateriel.indexOf(item) !== -1) {
      console.log(this.qualiteFicheMateriel.indexOf(item));
      this.qualiteFicheMateriel.splice(
        this.qualiteFicheMateriel.indexOf(item),
        1
      );
      console.log('true');
      console.log(this.qualiteFicheMateriel);
    } else {
      console.log('else');
      this.qualiteFicheMateriel.push(item);
    }
  }

  displayVersionChecked(item) {
    console.log(item);
    console.log(this.versionFicheMateriel);
    if (this.versionFicheMateriel === null) {
      console.log('null');
      this.selectedVersion = [item];
    } else if (this.versionFicheMateriel.indexOf(item) !== -1) {
      console.log(this.versionFicheMateriel.indexOf(item));
      this.versionFicheMateriel.splice(
        this.versionFicheMateriel.indexOf(item),
        1
      );
      console.log('true');
      console.log(this.versionFicheMateriel);
    } else {
      console.log('else');
      this.versionFicheMateriel.push(item);
    }
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
      this.changeDateFormat();
    } else {
      this.displayLibValueNotToChange();
    }
  }

  getQualiteFicheMateriel(id) {
    this.qualiteService.getQualiteFicheMateriel(id).subscribe(data => {
      if (data) {
        data.map(item => {
          console.log(item);
          console.log('____________________________________');
          this.qualitePresent = data;
          if (item.IsValid) {
            this.qualiteArrayIdExist.push(item.idLibQualiteSup);
            this.qualite.map(e => {
              if (e.Code === item.idLibQualiteSup) {
                this.qualiteFicheMateriel.push(e);
                console.log(this.qualiteFicheMateriel);
              }
            });
            console.log(this.qualiteArrayIdExist);
          }
        });
      }
      this.qualitePresent = data;
      console.log(data);
    });
  }

// versionArrayIdExist
  getVersionFicheMateriel(id) {
    this.versionService.getVersionFicheMateriel(id).subscribe(data => {
      if (data) {
        data.map(item => {
          console.log(item);
          this.versionPresent = data;
          if (item.Isvalid) {
            this.versionArrayIdExist.push(item.IdFicheAch_Lib_Versions);
            this.versionLib.map(e => {
              if (e.id_version === item.IdFicheAch_Lib_Versions) {
                this.versionFicheMateriel.push(e);
                console.log(this.versionFicheMateriel);
              }
            });
            console.log(this.versionArrayIdExist);
          }
        });
      }
      this.versionPresent = data;
      console.log(data);
    });
  }

  getAnnexElementsFicheMateriel(id) {
    this.annexElementsService
      .getAnnexElementsFicheMateriel(id)
      .subscribe(data => {
        this.annexElementsFicheMateriel = data;
        console.log(data);
      });
  }

  /************************** GET lib select Options ***************************/

  getLibs() {
    this.getStepsLib();
    this.getStatusLib();
    this.getQualiteLib();
    this.getAnnexStatus();
    this.getRetourOriLib();
    this.getVersionLib();
  }

  displayLibValueNotToChange() {
    this.steps.push({
      IdLibEtape: this.valueNotToChangeLibelle,
      Libelle: this.valueNotToChangeLibelle
    });
    this.status.push({
      IdStatut: this.valueNotToChangeLibelle,
      Libelle: this.valueNotToChangeLibelle
    });
    this.annexElements.push({
      IdStatutElementsAnnexes: this.valueNotToChangeLibelle,
      Libelle: this.valueNotToChangeLibelle
    });
    this.retourOri.push({
      IdLibRetourOri: this.valueNotToChangeLibelle,
      Libelle: this.valueNotToChangeLibelle
    });
  }

  getStepsLib() {
    this.stepsLibService.getStepsLib().subscribe(data => {
      this.steps = data;
      this.stepsReady = true;
      console.log(data);
    });
  }

  getStatusLib() {
    this.statusLibService.getStatusLib().subscribe(data => {
      this.status = data;
      this.statusReady = true;
      console.log(data);
    });
  }

  getAnnexStatus() {
    this.annexElementsService.getAnnexElements().subscribe(data => {
      this.annexElements = data;
      console.log(this.annexElements);
      this.annexElementsReady = true;
    });
  }

  getRetourOriLib() {
    this.retourOriLibService.getRetourOri().subscribe(data => {
      this.retourOri = data;
      console.log(data);
      this.retourOriReady = true;
    });
  }

  getQualiteLib() {
    this.qualiteService.getQualite().subscribe(data => {
      this.qualite = data;
      console.log('qualité');
      console.log(data);
      this.qualiteReady = true;
    });
  }

  getVersionLib() {
    this.versionService.getVersionLib().subscribe(data => {
      this.versionLib = data;
      console.log(data);
    });
  }

  /*********************************************************************************************/

  clickAnnexElementOptions() {
    this.initAnnexElements = false;
  }

  clickStepOptions() {
    this.initValueSteps = false;
    console.log(this.initValueSteps);
  }

  clickStatusOptions() {
    this.initValueStatus = false;
  }

  clickRetourOriOptions() {
    this.initValueRetourOri = false;
  }

  deleteData(field) {
    field = '';
    console.log(this.newObject);
  }

  checkAcceptationSelectionRadio() {
    if (
      !this.newObject.Renouvellement ||
      this.newObject.Renouvellement === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  displayAcceptaionSelectionRadio() {
    this.newObject.Renouvellement = 0;
    console.log(this.newObject.Renouvellement);
  }

  checkRenouvellementSelectionRadio() {
    if (this.newObject.Renouvellement) {
      return 'checked';
    }
  }

  displayRenouvellementSelectionRadio() {
    this.newObject.Renouvellement = 1;
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
}
