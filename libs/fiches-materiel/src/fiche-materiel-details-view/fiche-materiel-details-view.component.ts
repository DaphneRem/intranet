import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { urlDetailedReportFicheAchat } from '../../../../.privates-url';

import {
  FicheMaterielModification
} from '@ab/fiches-materiel/src/fiches-materiel-modification-interface/+state/fiche-materiel-modification.interfaces';

import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchat } from '@ab/fiches-achat';
import { FicheAchat2Exist } from '@ab/fiches-achat';

import { FichesMaterielService } from '../services/fiches-materiel.service';
import { FicheMateriel } from '../models/fiche-materiel';

import { QualiteService } from '../services/qualite.service';
import { QualiteLib, QualiteFM } from '../models/qualite';

import { VersionService } from '../services/version.service';

import { AnnexElementsService } from '../services/annex-elements.service';
import { AnnexElementStatus } from '../models/annex-element';

import { RetourOriLibService } from '../services/retour-ori-lib.service';
import { RetourOri } from '../models/retour-ori';

import { StepsLibService } from '../services/steps-lib.service';
import { Step } from '../models/step';
import { StatusLibService } from '../services/status-lib.service';
import { Status } from '../models/status';

import { CustomIconBadge } from '@ab/custom-icons';
import { mainColor, maintColorHover } from '../../fiches-materiel-common-theme';

@Component({
  selector: 'fiche-materiel-details-view',
  templateUrl: './fiche-materiel-details-view.component.html',
  styleUrls: [
    './fiche-materiel-details-view.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    AnnexElementsService,
    FichesAchatService,
    FichesMaterielService,
    QualiteService,
    RetourOriLibService,
    StatusLibService,
    StepsLibService,
    VersionService,
    Store
  ]
})
export class FicheMaterielDetailsViewComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();

  public sub;
  public idParamsFicheMateriel;
  public idParamsFicheAchat;
  public idParamsFicheAchatDetail;

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

  public dataMaterielReady: boolean = false;
  public dataGloralReady: boolean = false;
  public dataDetailsReady: boolean = false;

  public messageNoFicheAchat = ' pas de fiche Achat rattachée';
  public messageNoFicheAchatDetail = ' œuvre retirée de la fiche Achat';
  public messageEmptyField = 'donnée non renseignée';

  public annexElementsStatus: AnnexElementStatus[];
  public annexElementsReady: boolean;

  public retourOri: RetourOri[];
  public retourOriReady: boolean;

  public detailedReportLink;

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
        circleColor: mainColor,
        circleColorHover: maintColorHover,
        iconSize: '2.2em'
      },
      link : '../../../../',
      tooltip : true,
      tooltipMessage : 'Retour aux fiches Matériel'
  };
  constructor(
        private router: Router,
        private route: ActivatedRoute,
        private annexElementsService: AnnexElementsService,
        private fichesAchatService: FichesAchatService,
        private fichesMaterielService: FichesMaterielService,
        private store: Store<FicheMaterielModification>,
        private qualiteService: QualiteService,
        private modalService: NgbModal,
        private retourOriLibService: RetourOriLibService,
        private statusLibService: StatusLibService,
        private stepsLibService: StepsLibService,
        private versionService: VersionService
  ) {}

  ngOnInit() {
    this.store.subscribe(data => (this.globalStore = data));
    this.icons = [ this.back];
    if (this.globalStore.app.user.rights.modification) {
      this.icons.unshift(this.fichesMaterielModification);
    }
    this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      this.idParamsFicheMateriel = +params['idFicheMateriel'];
      this.idParamsFicheAchat = +params['idFicheAchat'];
      this.idParamsFicheAchatDetail = +params['idFicheAchatDetail'];
      console.log(this.idParamsFicheAchat);
      console.log(this.idParamsFicheMateriel);
    });
    this.detailedReportLink = `${urlDetailedReportFicheAchat}${this.idParamsFicheAchat}`;
    this.getAnnexStatus();
    this.getRetourOriLib();
    this.getFicheAchatDetails(this.idParamsFicheAchatDetail);
    this.getFicheAchatGlobal(this.idParamsFicheAchat);
    this.getFicheMateriel(this.idParamsFicheMateriel);

    this.storeFichesToModif = this.globalStore.ficheMaterielModification;
    console.log(this.storeFichesToModif);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
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
      .pipe(takeUntil(this.onDestroy$))
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
      .pipe(takeUntil(this.onDestroy$))
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

/********************* GET LIB FOR LIBELLE *********************/

  getAnnexStatus() {
    this.annexElementsService
      .getAnnexElementsStatus()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.annexElementsStatus = data;
        console.log(this.annexElementsStatus);
        this.annexElementsReady = true;
      });
  }

  diplayAnnexStatus(IdStatus) {
    let libelleStatusSelected = this.annexElementsStatus.filter(item => item.IdStatutElementsAnnexes === IdStatus);
    console.log('libelleStatusSelected : ', libelleStatusSelected);
    // return `${this.myFicheMateriel.IdStatutElementsAnnexes} - ${libelleStatusSelected[0].Libelle}`;
    return ` ${libelleStatusSelected[0].Libelle}`;
  }

  getRetourOriLib() {
    this.retourOriLibService.getRetourOri()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.retourOri = data;
        console.log(data);
        this.retourOriReady = true;
      });
  }

  diplayRetourOri(IdRetourOri) {
    let libelleRetourOriSelected = this.retourOri.filter(item => item.IdLibRetourOri === IdRetourOri);
    console.log('libelleStatusSelected : ', libelleRetourOriSelected);
    // return `${this.myFicheMateriel.RetourOri} - ${libelleRetourOriSelected[0].Libelle}`;
    return ` ${libelleRetourOriSelected[0].Libelle}`;
  }
  /*********************** GET LIBS ******************/

  getQualiteLib() {
    this.qualiteService
      .getQualiteLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.qualiteLib = data;
        console.log(data);
      });
  }

  getVersionLib() {
    this.versionService
      .getVersionLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.versionLib = data;
        console.log(data);
      });
  }

  getStepLib() {
    this.stepsLibService
      .getStepsLib()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        this.stepLib = data;
        this.getActiveStep();
      });
  }

  getStatusLib() {
    this.statusLibService
      .getStatusLib()
      .pipe(takeUntil(this.onDestroy$))
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
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.myFicheMateriel = data[0];
          console.log('this.myFicheMateriel => ', this.myFicheMateriel);
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
          this.getAllFichesAchatFOrOeuvre(this.myFicheMateriel.NumProgram);
        } else {
          this.myFicheMateriel = {};
          this.myFicheMaterielExist = false;
        }
      });
  }


  getFicheAchatDetails(id: number) {
    console.log('getFicheAchatDetails');
    this.fichesAchatService
      .getFichesAchatDetailByIdDetail(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        if (data !== null) {
          // this.myFicheAchatDetails = data[0];
          console.log('res for getFicheAchatDetails => ', data);
          this.myFicheAchatDetails = data;
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

  public allFichesAchatForOeuvre: FicheAchat2Exist[] = [];
  public allFichesAchatForOeuvreReady: boolean = false;
  public otherFichesAchatForOeuvreExist: boolean = false;
  public errorFicheAchatDetails: boolean = false;
  public errorMessageFicheAchatDetails: string = '';
  getAllFichesAchatFOrOeuvre(numProgram) {
    this.fichesAchatService.getAllFichesAchatFOrOeuvre(numProgram)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log('res for allFichesAchatFoOeuvre => ', data);
//        data = [
//          {
//            id_fiche: 1066,
//            Numero_fiche: 'FA-2020-00030',
//            NumProgram: '2020-00112'
//          },
//          {
//            id_fiche: 1064,
//            Numero_fiche: 'FA-2020-00031',
//            NumProgram: '2020-00113'
//          }];
        if (data.length > 1) {
          this.allFichesAchatForOeuvre = data;
          this.allFichesAchatForOeuvreReady = true;
          this.otherFichesAchatForOeuvreExist = true;
        } else {
          this.allFichesAchatForOeuvre = data;
          this.allFichesAchatForOeuvreReady = true;
          this.otherFichesAchatForOeuvreExist = false;
        }
      },
    error => {
      this.errorFicheAchatDetails = true;
      this.errorMessageFicheAchatDetails = 'Impossible de rechercher la correspondance de l\'oeuvre avec d\'autres fiches Achats.';
      if (numProgram === null || numProgram === '' || !numProgram) {
        this.errorMessageFicheAchatDetails += ' L\'information n° œuvre est manquante.';
      }
      // swal({
      //   text: 'Impossible de rechercher la correspondance de l\'oeuvre avec d\'autres fiches Achats',
      //   type: 'warning',
      //   showCancelButton: false,
      //   confirmButtonText: 'Ok',
      //   confirmButtonColor: mainColor,
      // });
    });
  }

  checkOeuvreInAllFicheAchatForOeuvre(ficheAchatDetail, allOeuvres): boolean {
    let currentOeuvre = [];
    let othersOeuvres = [];
    let oeuvreExistInAllFichesAchatForOeuvre = false;
    allOeuvres.map((item, i) => {
      if (item.NumProgram === ficheAchatDetail.numprogram) {
        currentOeuvre.push(item);
      } else {
        othersOeuvres.push(item);
      }
      if (i === (allOeuvres.length - 1)) {
        if (currentOeuvre.length) {
          oeuvreExistInAllFichesAchatForOeuvre = true;
        }
      }
    });
    return oeuvreExistInAllFichesAchatForOeuvre;
  }

  displayDurCom(durCom: string): string {
    console.log(durCom);
    let arrayDurCom = durCom.split(':');
    console.log(arrayDurCom);
    let labels = ['heure', 'minute', 'seconde'];
    let result = '';
    arrayDurCom.map((item, index) => {
      console.log(+item)
      if (+item === 0) {
        item = '';
      } else {
        let multiple = '';
        if (+item > 1) {
          multiple = 's';
        }
        item = ` ${+item} ${labels[index]}${multiple}`;
      }
      console.log(item);
      result += item;
    });
    return result;
  }

  getFicheAchatGlobal(id: number) {
    this.fichesAchatService
      .getGlobalFIcheAchat(id)
      .pipe(takeUntil(this.onDestroy$))
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

  displayStatusClassColor(status) {
    if (status.IdLibstatut === 1) {
      if (this.stepActive.IdLibEtape === 1) {
        return 'label label-default';
      } else {
        return 'label label-info';
      }
    } else if (status.IdLibstatut === 2) {
      return 'label label-canceled';
    } else if (status.IdLibstatut === 3) {
      return 'label label-success';
    } else if (status.IdLibstatut === 4) {
      return 'label bg-danger';
    } else if (status.IdLibstatut === 5) {
      return'label label-other';
    }
  }

  displayStepClassColor(status, step) {
    console.log('status => ', status);
    console.log('step => ', step);
    if (step.IdLibEtape <= 6) { // color: #a8a8a8 && #FFFFFF
      return 'label label-default';
    } else if (step.IdLibEtape > 6 && step.IdLibEtape <= 10) { // color : blue; #0040FF
      return 'label label-info';
    } else if (step.IdLibEtape === 25 || step.IdLibEtape === 18) { // color : red;
      return 'label bg-danger';
    } else if (step.IdLibEtape === 26) {
      return 'label label-EA';
    } else if (step.IdLibEtape === 5) {
      return 'label label-other';
    } else if (status.IdLibstatut === 3) {
      return 'label label-success';
    } else if (status.IdLibstatut === 2) {
      return 'label label-canceled';
    } else if (status.IdLibstatut === 5) {
      return 'label label-other';
    }
  }

}
