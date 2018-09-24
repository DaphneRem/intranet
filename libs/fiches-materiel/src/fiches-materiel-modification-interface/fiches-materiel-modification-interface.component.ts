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

import { RetourOriLibService } from '../services/retour-ori-lib.service';

import { CustomDatepickerI18n, I18n } from '../services/custom-datepicker-i18n';
import { NgbDatepickerI18n, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../services/custom-parser-formatter-datepiker';

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
    QualiteService,
    Store,
    I18n,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class FichesMaterielModificationInterfaceComponent
  implements OnInit, OnDestroy {
  public deadLineNgFormat: NgbDateStruct;
  public livraisonDateNgFormat: NgbDateStruct;
  public diffDateNgFormat: NgbDateStruct;
  public acceptationDateNgFormat: NgbDateStruct;
  public accLaboDateNgFormat: NgbDateStruct;

  public radioSelection = {
    acceptationDateSelected: true,
    renouvellementSelected: false
  };

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

  public retourOri: any;
  public retourOriReady: Boolean = false;
  public initValueRetourOri: Boolean = true;

  public qualite: any;
  public qualiteReady: Boolean = false;

  public valueNotToChangeLibelle = 'Valeur d\'origine';
  public resetTooltipMessage = 'Vider le champs';
  public replyTooltipMessage = 'Retour aux valeurs d\'origines';

  public allFichesMateriel = [];
  public dataIdFicheMaterielReady = false;
  public newObject = {
    IdFicheMateriel: 'Valeur d\'origine',
    IdFicheAchat: 'Valeur d\'origine',
    IdFicheDetail: 'Valeur d\'origine',
    Deadline: 'Valeur d\'origine',
    SuiviPar: 'Valeur d\'origine',
    IdLibstatut: 'Valeur d\'origine',
    IdLibEtape: 'Valeur d\'origine',
    NumEpisodeProd: 'Valeur d\'origine',
    NumEpisodeAB: 'Valeur d\'origine',
    TitreEpisodeVF: 'Valeur d\'origine',
    TitreEpisodeVO: 'Valeur d\'origine',
    IdSupport: 'Valeur d\'origine',
    NumProgram: 'Valeur d\'origine',
    NumEpisode: 'Valeur d\'origine',
    ReceptionAccesLabo: 'Valeur d\'origine',
    NomLabo: 'Valeur d\'origine',
    CoutLabo: 'Valeur d\'origine',
    DateLivraison: 'Valeur d\'origine',
    DelaiLivraison: 'Valeur d\'origine',
    UniteDelaiLivraison: 'Valeur d\'origine',
    DateAcceptation: 'Valeur d\'origine',
    DatePremiereDiff: 'Valeur d\'origine',
    AccesVF: 'Valeur d\'origine',
    Commentaires: 'Valeur d\'origine',
    RetourOri: 'Valeur d\'origine',
    RetourOriDernierDelai: 'Valeur d\'origine',
    IdStatutElementsAnnexes: 'Valeur d\'origine',
    UserCreation: 'Valeur d\'origine',
    UserModification: 'Valeur d\'origine',
    DateCreation: 'Valeur d\'origine',
    DateModification: 'Valeur d\'origine',
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
    Fiche_Mat_LibEtape: {
      IdLibEtape: 'Valeur d\'origine',
      Libelle: 'Valeur d\'origine'
    },
    Fiche_Mat_LibRetourOri: 'Valeur d\'origine',
    Fiche_Mat_Libstatut: {
      IdStatut: 'Valeur d\'origine',
      Libelle: 'Valeur d\'origine'
    },
    Fiche_Mat_LibStatutElementsAnnexes: 'Valeur d\'origine',
    Fiche_Mat_HistoriqueDateLivraison: 'Valeur d\'origine',
    Fiche_Mat_HistoriqueStatutEtape: 'Valeur d\'origine',
    Fiche_Mat_Qualite: 'Valeur d\'origine',
    Fiche_Mat_StatutElementsAnnexes: 'Valeur d\'origine',
    Fiche_Mat_Version: 'Valeur d\'origine'
  };

  constructor(
    private annexElementsService: AnnexElementsService,
    private fichesAchatService: FichesAchatService,
    private fichesMaterielService: FichesMaterielService,
    private retourOriLibService: RetourOriLibService,
    private statusLibService: StatusLibService,
    private stepsLibService: StepsLibService,
    private qualiteService: QualiteService,
    private store: Store<FicheMaterielModification>
  ) {}

  ngOnInit() {
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    console.log(this.storeFichesToModif);
    this.getStepsLib();
    this.getStatusLib();
    this.getQualiteLib();
    this.getAnnexStatus();
    this.getRetourOriLib();
    this.getAllFichesMateriel(this.storeFichesToModif.selectedFichesMateriel);
    this.displaySelectionMode(this.storeFichesToModif);
    console.log(this.initValueSteps);
    console.log(this.steps);
  }

  ngOnDestroy() {
    this.store.dispatch({
      type: 'DELETE_ALL_FICHE_MATERIEL_IN_MODIF',
      payload: {}
    });
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

  displayPlaceholderDatepicker(e) {
    if (this.selectionType === 'one') {
      console.log(e);
      if (e !== undefined) {
        return e;
      }
      return 'dd-mm-yyyy';
    } else {
      return 'Valeur d\'origine';
    }
  }

  displayNewObject(length, ficheMateriel) {
    if (length === 1) {
      this.newObject = ficheMateriel;
      this.getFicheAchat(ficheMateriel.IdFicheAchat);
      if (this.newObject.Deadline) {
        this.deadLineNgFormat = {
          day: new Date(this.newObject.Deadline).getDate(),
          month: new Date(this.newObject.Deadline).getMonth() + 1,
          year: new Date(this.newObject.Deadline).getFullYear()
        };
      }
      if (this.newObject.DateLivraison !== null) {
        this.livraisonDateNgFormat = {
          day: new Date(this.newObject.DateLivraison).getDate(),
          month: new Date(this.newObject.DateLivraison).getMonth() + 1,
          year: new Date(this.newObject.DateLivraison).getFullYear()
        };
      }
      if (this.newObject.DatePremiereDiff !== null) {
        this.diffDateNgFormat = {
          day: new Date(this.newObject.DatePremiereDiff).getDate(),
          month: new Date(this.newObject.DatePremiereDiff).getMonth() + 1,
          year: new Date(this.newObject.DatePremiereDiff).getFullYear()
        };
      }
      if (this.newObject.DateAcceptation !== null) {
        this.acceptationDateNgFormat = {
          day: new Date(this.newObject.DateAcceptation).getDate(),
          month: new Date(this.newObject.DateAcceptation).getMonth() + 1,
          year: new Date(this.newObject.DateAcceptation).getFullYear()
        };
      }
      if (this.newObject.ReceptionAccesLabo !== null) {
        this.accLaboDateNgFormat = {
          day: new Date(this.newObject.ReceptionAccesLabo).getDate(),
          month: new Date(this.newObject.ReceptionAccesLabo).getMonth() + 1,
          year: new Date(this.newObject.ReceptionAccesLabo).getFullYear()
        };
      }
    } else {
      console.log(this.steps);
      console.log('ooooooooooooooooooooooooooo');
      this.steps.push({
        IdLibEtape: 'Valeur d\'origine',
        Libelle: 'Valeur d\'origine'
      });
      this.status.push({
        IdStatut: 'Valeur d\'origine',
        Libelle: 'Valeur d\'origine'
      });
      this.annexElements.push({
        IdStatutElementsAnnexes: 'Valeur d\'origine',
        Libelle: 'Valeur d\'origine'
      });
      this.retourOri.push({
        IdLibRetourOri: 'Valeur d\'origine',
        Libelle: 'Valeur d\'origine'
      });
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

  /************************** GET Fiche Materiel ***************************/

  getFicheMateriel(id: number, index, length) {
    console.log(index);
    console.log(length);
    this.fichesMaterielService.getOneFicheMateriel(id).subscribe(data => {
      if (data) {
        this.allFichesMateriel.push(data[0]);
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

  /************************** GET lib select Options ***************************/
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
      console.log(data);
      this.qualiteReady = true;
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

  displayAcceptaionSelectionRadio() {
    this.radioSelection.acceptationDateSelected = true;
    this.radioSelection.renouvellementSelected = false;
    console.log('acceptation' + this.radioSelection.acceptationDateSelected);
    console.log('renouvellement' + this.radioSelection.renouvellementSelected);
  }

  displayRenouvellementSelectionRadio() {
    this.radioSelection.acceptationDateSelected = false;
    this.radioSelection.renouvellementSelected = true;
    console.log('acceptation' + this.radioSelection.acceptationDateSelected);
    console.log('renouvellement' + this.radioSelection.renouvellementSelected);
  }

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
}
