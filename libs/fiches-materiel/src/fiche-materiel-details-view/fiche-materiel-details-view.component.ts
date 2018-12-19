import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';
import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';

import { QualiteService } from '../services/qualite.service';
import { QualiteLib, QualiteFM } from '../models/qualite';

import { VersionService } from '../services/version.service';

import { StepsLibService } from '../services/steps-lib.service';
import { Step } from '../models/step';
import { StatusLibService } from '../services/status-lib.service';
import { Status } from '../models/status';

import { CustomIconBadge } from '@ab/custom-icons';

@Component({
  selector: 'fiche-materiel-details-view',
  templateUrl: './fiche-materiel-details-view.component.html',
  styleUrls: [
    './fiche-materiel-details-view.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    FichesAchatService,
    FichesMaterielService,
    QualiteService,
    StatusLibService,
    StepsLibService,
    VersionService,
    Store
  ]
})
export class FicheMaterielDetailsViewComponent implements OnInit {

  public sub;
  public idParamsFicheMateriel;
  public idParamsFicheAchat;

  public stepLib;
  public statusLib;
  public qualiteLib;

  public qualiteFM;
  public qualiteExist;

  public versionFicheMateriel;
  public versionLib;
  public versionExist;
  public versionFmReady: Boolean = false;

  public stepActive;
  public stepActiveExist = false;
  public statusActive;
  public statusActiveExist = false;

  public globalStore;
  public storeFichesToModif;

  public myFicheAchatGlobal;
  public myFicheAchatDetails;
  public myFicheMateriel;

  public myFicheAchatGlobalExist: boolean;
  public myFicheAchatDetailsExist: boolean;
  public myFicheMaterielExist: boolean;

  public dataMaterielReady = false;
  public dataGloralReady = false;
  public dataDetailsReady = false;

  public messageNoFicheAchat = ' pas de fiche Achat rattachée';
  public messageEmptyField = 'donnée non renseignée';

  public icons: CustomIconBadge[];
  public fichesMaterielModification: CustomIconBadge = {
    littleIcon: {
      circleColor: '#FF9C2A',
      icon: 'icofont icofont-pencil',
      iconSize: '1.6em',
      iconMargin: '2px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
    },
    link: '/material-sheets/my-material-sheets/modification',
    tooltip : true,
    tooltipMessage : 'Modifier la fiche Matériel'
  };

  // public fichesAchatView: CustomIconBadge = {
  //     littleIcon : {
  //       circleColor: '#3383FF',
  //       icon : 'icofont icofont-eye',
  //       iconSize: '1.5em',
  //       iconMargin: '2px',
  //     },
  //     bigIcon : {
  //       icon: 'icofont icofont-tag',
  //       circleColor: '#999898',
  //       circleColorHover: '#b5b3b3',
  //     },
  //     action : () => alert('recap fiche Achat Associée'),
  //     tooltip : true,
  //     tooltipMessage : 'Voir la fiche Achat associée'
  // };

  public back: CustomIconBadge = {
      bigIcon : {
        icon: 'icofont icofont-exit',
        circleColor: '#17AAB2',
        circleColorHover: '#2eced6',
        iconSize: '2.2em'
      },
      link : '../../../0/desc',
      tooltip : true,
      tooltipMessage : 'Retour aux fiches Matériel'
  };
  constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fichesAchatService: FichesAchatService,
        private fichesMaterielService: FichesMaterielService,
        private store: Store<FicheMaterielModification>,
        private qualiteService: QualiteService,
        private modalService: NgbModal,
        private statusLibService: StatusLibService,
        private stepsLibService: StepsLibService,
        private versionService: VersionService
  ) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielModification, this.back];
    this.sub = this.route.params.subscribe(params => {
      this.idParamsFicheMateriel = +params['idFicheMateriel'];
      this.idParamsFicheAchat = +params['idFicheAchatDetails'];
      console.log(this.idParamsFicheAchat);
      console.log(this.idParamsFicheMateriel);
    });
    this.getFicheAchatDetails(this.idParamsFicheAchat);
    this.getFicheAchatGlobal(this.idParamsFicheAchat);
    this.getFicheMateriel(this.idParamsFicheMateriel);
    this.store.subscribe(data => (this.globalStore = data));
    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    console.log(this.storeFichesToModif);
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
    console.log('click to open large modal');
  }

  displayDeadlineIcon() {
    const today = +new Date();
    const deadLine = +new Date(this.myFicheMateriel.Deadline);
    // console.log(deadLine);
    // console.log(today);
    // console.log(deadLine <= today);
    return deadLine <= today;
  }

  getQualiteFicheMateriel(id) {
    this.qualiteExist = [];
    this.qualiteService
      .getQualiteFicheMateriel(id)
      .subscribe(data => {
        this.qualiteFM = data;
        console.log('qualité from FM :');
        console.log(data);
        this.qualiteFM.map(item => {
          if (item.IsValid) {
            this.qualiteExist.push(item);
          }
        });
      });
  }

  getVersionFicheMateriel(id) {
    this.versionExist = [];
    this.versionService
      .getVersionFicheMateriel(id)
      .subscribe(data => {
        this.versionFicheMateriel = data;
        this.versionFmReady = true;
        this.versionFicheMateriel.map(item => {
          if (item.Isvalid) {
            this.versionExist.push(item);
          }
        });
        console.log(data);
    });
  }


  /*********************** GET LIBS ******************/

  getQualiteLib() {
    this.qualiteService
      .getQualiteLib()
      .subscribe(data => {
        this.qualiteLib = data;
        console.log(data);
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

  getStepLib() {
    this.stepsLibService
      .getStepsLib()
      .subscribe(data => {
        console.log(data);
        this.stepLib = data;
        this.getActiveStep();
      });
  }

  getStatusLib() {
    this.statusLibService
      .getStatusLib()
      .subscribe(data => {
        console.log(data);
        this.statusLib = data;
        this.getActiveStatus();
      });
  }

  /* check active step and status */
  getActiveStep() {
    this.stepLib.map(item => {
      if (item.IdLibEtape === this.myFicheMateriel.IdLibEtape) {
        this.stepActive = item;
        this.stepActiveExist = true;
      }
    });
  }
  getActiveStatus() {
    this.statusLib.map(item => {
      if (item.IdLibstatut === this.myFicheMateriel.IdLibstatut) {
        this.statusActive = item;
        this.statusActiveExist = true;
      }
    });
  }
  /************************************************/

  getFicheMateriel(id: number) {
    this.fichesMaterielService
      .getOneFicheMateriel(id)
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.myFicheMateriel = data[0];
          console.log(this.myFicheMateriel);
          this.dataMaterielReady = true;
          this.myFicheMaterielExist = true;
          this.fichesMaterielModification.action = this.goToModifInterface();
          this.displayDeadlineIcon();
          this.getStatusLib();
          this.getStepLib();
          this.getQualiteLib();
          this.getVersionLib();
          this.getQualiteFicheMateriel(id);
          this.getVersionFicheMateriel(id);
        } else {
          this.myFicheMateriel = {};
          this.myFicheMaterielExist = false;
        }
      });
  }


  getFicheAchatDetails(id: number) {
    this.fichesAchatService
    .getFichesAchatDetails(id)
      .subscribe(data => {
        console.log(data);
        if (data !== null) {
          this.myFicheAchatDetails = data[0];
          this.dataDetailsReady = true;
          this.myFicheAchatDetailsExist = true;
        } else {
          this.myFicheAchatDetails = {};
          this.dataDetailsReady = true;
          this.myFicheAchatDetailsExist = false;
        }
        console.log(this.myFicheAchatDetails);
      });
  }

  getFicheAchatGlobal(id: number) {
    this.fichesAchatService
    .getGlobalFIcheAchat(id)
    .subscribe(data => {
        console.log(data);
        if (data !== null) {
          this.myFicheAchatGlobal = data;
          this.dataGloralReady = true;
          this.myFicheAchatGlobalExist = true;
        } else {
          this.myFicheAchatGlobal = {};
          this.dataGloralReady = true;
          this.myFicheAchatGlobalExist = false;
        }
        console.log(this.myFicheAchatGlobal);
      });
  }

  goToModifInterface() {
    this.store.dispatch({
        type: 'ADD_FICHE_MATERIEL_IN_MODIF',
        payload: {
          modificationType: 'one',
          multiFicheAchat: false,
          multiOeuvre: false,
          selectedFichesMateriel: [{
            idFicheAchat: this.myFicheMateriel.IdFicheAchat,
            idFicheAchatDetail: this.myFicheMateriel.IdFicheDetail,
            idFicheMateriel: this.myFicheMateriel.IdFicheMateriel
          }]
        }
      });
  }

}
