import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FicheMateriel } from '../../models/fiche-materiel';
import { AnnexElementCommentsFicheMAteriel } from '../../models/annex-elements-comments';

import { QualiteService } from '../../services/qualite.service';
import { VersionService } from '../../services/version.service';

import { AnnexElementsService } from '../../services/annex-elements.service';
import { AnnexElementFicheMAteriel } from '../../models/annex-element';

@Component({
  selector: 'fiches-materiel-modification-action',
  templateUrl: './fiches-materiel-modification-action.component.html',
  styleUrls: [
    './fiches-materiel-modification-action.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [FichesMaterielService]
})
export class FichesMaterielModificationActionComponent implements OnInit, OnDestroy {

  @Input() showAffectedEps;
  @Input() annexElementsNgModel;
  @Input() newObject;
  @Input() allFichesMateriel;
  @Input() selectionType;
  @Input() multiOeuvre;
  @Input() multiFichesAchat;
  @Input() initialFichesMateriel;
  @Input() valueNotToChangeLibelle;
  @Input() allIdSelectedFichesMateriel;
  @Input() qualiteFM;
  @Input() annexElementsFicheMateriel;
  @Input() versionFicheMateriel;
  @Input() allAnnexElementsFicheMateriel;
  @Input() user;
  @Input() deadlineIsValid;
  @Input() livraisonIsValid;
  @Input() acceptationIsValid;
  @Input() premiereDiff;
  @Input() comments: AnnexElementCommentsFicheMAteriel[];
  @Input() accesLabo;
  @Input() allEACommentsMultiSelect;
  @Input() allVersionFm;
  @Input() versionFmNgModel;
  @Input() allQualitiesFm;
  @Input() qualityFmNgModel;

  @Output() modificationMessage: EventEmitter<any> = new EventEmitter();
  @Output() propertiesChanged: EventEmitter<any> = new EventEmitter();
  @Output() fmInRecording: EventEmitter<boolean> = new EventEmitter();

  private onDestroy$: Subject<any> = new Subject();

  public myFicheMateriel;
  public changedValues = {};
  public multiDataToUpdate;
  public qualiteToUpdate = [];
  public qualiteToPost = [];
  public closeInterface: boolean;
  public newElementSAnnex;
  public versionToUpdate: any = [];
  public versionToPost: any = [];

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private annexElementsService: AnnexElementsService,
    private qualiteService: QualiteService,
    private versionService: VersionService,
    private location: Location
  ) {}

  ngOnInit() {
    console.log(this.newObject);
    console.log(this.comments);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  checkAllValidDates(): boolean { // 2/
    if (
      this.deadlineIsValid
      && this.livraisonIsValid
      && this.acceptationIsValid
      && this.premiereDiff
      && this.accesLabo
    ) {
      console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
      return true;
    } else {
      console.log('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt');
      return false;
    }
  }

  modifFichesMateriel(closeAction) { // 1/
    let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
    console.log('COMMENTS ================> ', this.comments);
    if (closeAction === 'close') {
      this.closeInterface = true;
    } else {
      this.closeInterface = false;
    }
    if (this.checkAllValidDates()) {
      this.fmInRecording.emit(true);
      this.checkNewObjectModif();
    } else {
      this.displayNotValidDateMessageModal();
    }
  }

  displayNotValidDateMessageModal() {
      let invalidDate = [];
      if (!this.deadlineIsValid) {
        invalidDate.push('Deadline');
      }
      if (!this.livraisonIsValid) {
        invalidDate.push('date de livraison');
      }
      if (!this.acceptationIsValid) {
        invalidDate.push('date d\'acceptation');
      }
      if (!this.premiereDiff) {
        invalidDate.push('date de première diff');
      }
      if (!this.accesLabo) {
        invalidDate.push('date d\'Accès labo');
      }
      if (invalidDate.length > 1) {
        swal({
          title: 'Plusieurs dates ne sont pas valides',
          showCancelButton: false,
          confirmButtonText: 'Retour',
          confirmButtonColor: '#aaaaaa',
        });
      } else {
        swal({
          title: `La ${invalidDate[0]} n'est pas valide`,
          showCancelButton: false,
          confirmButtonText: 'Retour',
          confirmButtonColor: '#aaaaaa',
          // cancelButtonText: 'Retour',
        });
      }
  }

  goBack() {
    this.location.back();
  }

  actionAfterSave() { // 10/
    console.log('ACTION AFTER SAVE CALL !!!', this.newObject);
    if (this.closeInterface) {
      this.goBack();
    } else {
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      console.log('this.changedValues ===> ', this.changedValues);
      this.modificationMessage.emit(`Dernières modifications enregistrées à ${hours}:${minutes}`);
      this.propertiesChanged.emit(this.changedValues);
    }
  }

  putQualiteFicheMateriel(qualiteFM) {
    this.qualiteService.putQualite(qualiteFM)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(qualite => {
        console.log(qualite);
        if (qualite) {
          console.log('PUT qualite with succes');
          console.log(qualite);
        } else {
          console.log('ERROR PUT qualite');
          console.log(qualite);
        }
      });
  }

  putVersionFicheMateriel(versionFM) {
    this.versionService.putVersion(versionFM)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(version => {
        console.log(version);
        if (version) {
          console.log('PUT version with succes');
          console.log(version);
        } else {
          console.log('ERROR PUT version');
          console.log(version);
        }
      });
  }

  checkDeadline(newObject) {
    console.log('newObject.Deadline => ', newObject.Deadline);
    if (
      // newObject.IdLibEtape === 17 ||
      // newObject.IdLibstatut === 3 ||
      // newObject.IdLibstatut === 5
      newObject.IdLibEtape === 20 || // Terminé (accepté)
      newObject.IdLibEtape === 21 || // Terminé (annulé)
      newObject.IdLibEtape === 24 // traité par un autre service
    ) {
      this.newObject.Deadline = null;
      this.newObject.isarchived = 1;
      console.log('this.newObject.Deadline => ', this.newObject.Deadline);
    } else {
      let day = this.addZeroToDate(newObject.Deadline.day);
      let month = this.addZeroToDate(newObject.Deadline.month);
      newObject.Deadline = `${newObject.Deadline.year}-${
        month
      }-${day}T00:00:00`;
    }
  }

  addZeroToDate(date) {
    console.log('date => ', date);
    if (date) {
      console.log(date.toString());
      if (date.toString().length === 1) {
        return `0${date}`;
      } else {
        return date;
      }
    }
  }

  resetDateFormat(newObject) { // 5/
    console.log('before resetDateFormat : this.newObject => ', this.newObject);
    console.log('newObject.Deadline => ', newObject.Deadline);
    console.log('newObject.DateLivraison => ', newObject.DateLivraison);
    console.log('newObject.DatePremiereDiff => ', newObject.DatePremiereDiff);
    console.log('newObject.DateAcceptation => ', newObject.DateAcceptation);
    console.log('newObject.ReceptionAccesLabo => ', newObject.ReceptionAccesLabo);
    console.log('newObject.DateLivraison => ', newObject.DateRetourOri);
    console.log('newObject.DateLivraison => ', newObject.RetourOriDernierDelai);

    if (
      newObject.Deadline !== null &&
      newObject.Deadline !== this.valueNotToChangeLibelle &&
      newObject.Deadline !== 'dd-mm-yyyy'
    ) {
      this.checkDeadline(newObject);
    } else if (newObject.Deadline === null) {
      this.newObject.Deadline = null;
    }
    if (
      newObject.DateLivraison !== null &&
      newObject.DateLivraison !== this.valueNotToChangeLibelle &&
      newObject.DateLivraison !== 'dd-mm-yyyy'
    ) {
      let day = this.addZeroToDate(newObject.DateLivraison.day);
      let month = this.addZeroToDate(newObject.DateLivraison.month);
      newObject.DateLivraison = `${newObject.DateLivraison.year}-${
        month
      }-${day}T00:00:00`;
      console.log('newObject.DateLivraison => ', newObject.DateLivraison);
    }
    if (
      newObject.DatePremiereDiff !== null &&
      newObject.DatePremiereDiff !== this.valueNotToChangeLibelle &&
      newObject.DatePremiereDiff !== 'dd-mm-yyyy'
    ) {
      let day = this.addZeroToDate(newObject.DatePremiereDiff.day);
      let month = this.addZeroToDate(newObject.DatePremiereDiff.month);
      newObject.DatePremiereDiff = `${newObject.DatePremiereDiff.year}-${
        month
      }-${day}T00:00:00`;
      console.log('newObject.DatePremiereDiff => ', newObject.DatePremiereDiff);
    }
    if (
      newObject.DateAcceptation !== null &&
      newObject.DateAcceptation !== this.valueNotToChangeLibelle &&
      newObject.DateAcceptation !== 'dd-mm-yyyy'
    ) {
      let day = this.addZeroToDate(newObject.DateAcceptation.day);
      let month = this.addZeroToDate(newObject.DateAcceptation.month);
      newObject.DateAcceptation = `${newObject.DateAcceptation.year}-${
        month
      }-${day}T00:00:00`;
      console.log('newObject.DateAcceptation => ', newObject.DateAcceptation);
    }
    if (
      newObject.ReceptionAccesLabo !== null &&
      newObject.ReceptionAccesLabo !== this.valueNotToChangeLibelle &&
      newObject.ReceptionAccesLabo !== 'dd-mm-yyyy'
    ) {
      let day = this.addZeroToDate(newObject.ReceptionAccesLabo.day);
      let month = this.addZeroToDate(newObject.ReceptionAccesLabo.month);
      newObject.ReceptionAccesLabo = `${newObject.ReceptionAccesLabo.year}-${
        month
      }-${day}T00:00:00`;
      console.log('newObject.ReceptionAccesLabo => ', newObject.ReceptionAccesLabo);
      // newObject.ReceptionAccesLabo = new Date(newObject.ReceptionAccesLabo.year, newObject.ReceptionAccesLabo.month - 1, newObject.ReceptionAccesLabo.day).toDateString();
    }
    if (
      newObject.DateRetourOri !== null &&
      newObject.DateRetourOri !== this.valueNotToChangeLibelle &&
      newObject.DateRetourOri !== 'dd-mm-yyyy'
    ) {
      let day = this.addZeroToDate(newObject.DateRetourOri.day);
      let month = this.addZeroToDate(newObject.DateRetourOri.month);
      newObject.DateRetourOri = `${newObject.DateRetourOri.year}-${
        month
      }-${day}T00:00:00`;
      console.log('newObject.DateRetourOri => ', newObject.DateRetourOri);
    }
    if (
      newObject.RetourOriDernierDelai !== null &&
      newObject.RetourOriDernierDelai !== this.valueNotToChangeLibelle &&
      newObject.RetourOriDernierDelai !== 'dd-mm-yyyy'
    ) {
      let day = this.addZeroToDate(newObject.RetourOriDernierDelai.day);
      let month = this.addZeroToDate(newObject.RetourOriDernierDelai.month);
      newObject.RetourOriDernierDelai = `${
        newObject.RetourOriDernierDelai.year
      }-${month}-${
        day
      }T00:00:00`;
      console.log('newObject.RetourOriDernierDelai => ', newObject.RetourOriDernierDelai);
    }
    console.log('after resetDateFormat : this.newObject => ', this.newObject);
  }

  getFicheMaterielOriginal(id) {
    this.fichesMaterielService.getOneFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        this.myFicheMateriel = data[0];
        if (
          JSON.stringify(this.newObject) === JSON.stringify(this.myFicheMateriel)
        ) {
          console.log(this.newObject[0]);
          console.log('true');
          console.log(this.newObject === this.myFicheMateriel);
          console.log(this.myFicheMateriel);
        } else {
          console.log('false');
          console.log(this.newObject);
          // if (this.newObject.IdLibEtape !== this.newObject.IdLibEtape) {
          //   this.newObject.Fiche_Mat_LibEtape = null;
          // }
          // if (this.newObject.Fiche_Mat_Libstatut.IdLibstatut !== this.newObject.IdLibstatut) {
          //   this.newObject.Fiche_Mat_Libstatut = null;
          // }
          this.resetDateFormat(this.newObject);
          this.updatePutFicheMateriel(this.newObject);
        }
      });
  }

  updatePutFicheMateriel(e) {
    console.log(e);
    let now = moment().format('YYYY-MM-DDTHH:mm:ss');
    delete e.Fiche_Mat_LibEtape;
    delete e.Fiche_Mat_Qualite;
    delete e.Fiche_Mat_Version;
    e.UserModification = this.user;
    e.DateModification = now;
    // delete e.Fiche_Mat_ElementsAnnexes;
    this.fichesMaterielService.updateFicheMateriel([e])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (data) {
          console.log('succes PUT fiche materiel');
          console.log('data to PUT : ', this.annexElementsFicheMateriel);
          console.log(data);
          console.log(this.annexElementsFicheMateriel);
          this.annexElementsService
            .putAnnexElementsFicheMateriel(this.annexElementsFicheMateriel)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(annexesElements => {
              console.log(annexesElements);
              if (annexesElements) {
                console.log('succes PUT annexesElements');
                console.log(annexesElements);
                this.actionAfterSave();
              } else {
                console.log('error PUT annexesElements');
                console.log(annexesElements);
              }
            });
          this.putQualiteFicheMateriel(this.qualiteFM);
          this.putVersionFicheMateriel(this.versionFicheMateriel);
          // ICI
          this.updateCommentaireAnnexElementsFicheMateriel();
        } else {
          console.log('error PUT fiche materiel');
          console.log(data);
        }
        console.log(data);
      });
    // -------------------------->>>>>>>>>>>>>>>>>>>> Résoudre problème
  }

  putAnnexElementReset() {
    console.log(this.annexElementsNgModel);
    console.log(this.allIdSelectedFichesMateriel);
    console.log(this.allFichesMateriel);
    // this.annexElementsService
    //   .putAnnexElementsFicheMateriel(this.annexElementsFicheMateriel)
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(annexesElements => {
    //     console.log(annexesElements);
    //     if (annexesElements) {
    //       console.log('succes PUT annexesElements');
    //       console.log(annexesElements);
    //       this.actionAfterSave();
    //     } else {
    //       console.log('error PUT annexesElements');
    //       console.log(annexesElements);
    //     }
    //   });
  }

  checkNewObjectModif() { // 3/
    if (this.selectionType === 'one') {
      this.getFicheMaterielOriginal(this.newObject.IdFicheMateriel);
    } else {
      this.checkChanges(this.allIdSelectedFichesMateriel);
    }
  }

  checkChanges(allId) { // 4/
    // CALL IF SELECTION TYPE IS 'MULTI'
    // let changedValues = {};
    console.log(allId);
    console.log(this.newObject);
    this.resetDateFormat(this.newObject);
    console.log(this.newObject);
    for (let key in this.newObject) {
      if (this.newObject[key] !== this.valueNotToChangeLibelle) {
        if (typeof this.newObject[key] !== 'object') {
          // IF value is Object
          this.changedValues[key] = this.newObject[key];
          console.log(this.changedValues);
        } else if (this.newObject[key] === null) {
          this.changedValues[key] = this.newObject[key];
        } else if (
          typeof this.newObject[key] === 'object' &&
          !Array.isArray(this.newObject[key]) // IF value is Object but not Array
        ) {
          for (let i in this.newObject[key]) {
            if (this.newObject[key][i] !== this.valueNotToChangeLibelle) {
              this.changedValues[key] = this.newObject[key];
              console.log(this.changedValues);
            }
          }
        } else if (
          typeof this.newObject[key] === 'object' &&
          Array.isArray(this.newObject[key]) // IF value is Object and Array
        ) {
          let arrayChangedValues = [];
          this.newObject[key].map(item => {
            if (item.IsValid !== null) {
              arrayChangedValues.push(item);
            }
          });
          if (arrayChangedValues.length > 0) {
            this.changedValues[key] = this.newObject[key];
            console.log(this.changedValues);
          }
        }
      } else {
        console.log('key => ', key);
        console.log('this.newObject[key] (value) => ', this.newObject[key]);
      }
    }
    console.log(this.selectionType);
    // if ((this.newObject.Deadline === null) && this.selectionType === 'multi') {
    //   let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
    //   console.log('nullDate => --------------------------------------- ', nullDate);
    //   console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
    //   this.changedValues['isarchived'] = 1;
    //   this.changedValues['Deadline'] = nullDate;
    // } else {
    //   console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
    //   this.changedValues['isarchived'] = 0;
    //   this.changedValues['Deadline'] = this.newObject.Deadline;
    // }
    if (this.selectionType === 'multi') {
        console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
        console.log('this.newObject ===================================> ', this.newObject);
      if (this.newObject.Deadline === null) {
        let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
        console.log('nullDate => --------------------------------------- ', nullDate);
        console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
        this.changedValues['Deadline'] = nullDate;
        this.changedValues['isarchived'] = 1;
      } else if ((this.newObject.Deadline === this.valueNotToChangeLibelle) && (this.newObject.isarchived === 1)) {
        if (this.newObject.IdLibstatut === 1 // en cours
        || this.newObject.IdLibstatut === 3 && this.newObject.IdLibEtape !== 21
        || this.newObject.IdLibstatut === 2 && this.newObject.IdLibEtape !== 20
        || this.newObject.IdLibstatut === 5 && this.newObject.IdLibEtape !== 24
        ) {
          this.changedValues['Deadline'] = moment().format('YYYY-MM-DDTHH:mm:ss');
          console.log('&&&&&&&&&&&&&&&&& La deadline doit disparaitre &&&&&&&&&&&&&&&&&&&&&& => ', this.changedValues);
          this.changedValues['isarchived'] = 0;
        }
      } else if (this.newObject.Deadline === this.valueNotToChangeLibelle) {
        console.log('ERROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOR => ', this.newObject.Deadline);
        // this.changedValues['Deadline'] = moment().format('YYYY-MM-DDTHH:mm:ss');
        // console.log('deadline error => ', this.changedValues['Deadline']);
      }
    }
    let now = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.changedValues['UserModification'] = this.user;
    this.changedValues['DateModification'] = now;
    this.displaymultiDataToUpdate(allId);
  }

  displaymultiDataToUpdate(allId) { // 6/
    console.log('displaymultiDataToUpdate : this.newObject => ', this.newObject);
    this.multiDataToUpdate = allId.map(item => {
      item = Object.assign({}, item, this.changedValues);
      return item;
    });
    console.log('this.multiDataToUpdate : ', this.multiDataToUpdate);
    // this.multiDataToUpdate.map(item => { // patch sur chaque fiche Matériel
    //   this.patchFichesMateriel([item]);
    // });
    console.log(this.allAnnexElementsFicheMateriel);
    if (!this.changedValues['IdLibstatut']) {
      this.multiDataToUpdate.map(e => {
        this.initialFichesMateriel.map(item => {
          console.log('e.IdLibstatut => ', e.IdLibstatut);
          if (item.IdFicheMateriel === e.IdFicheMateriel) {
            e['IdLibstatut'] = item.IdLibstatut;
          }
        });
      });
    }
    if (!this.changedValues['IdLibEtape']) {
      this.multiDataToUpdate.map(e => {
        this.initialFichesMateriel.map(item => {
          console.log('e.IdLibEtape => ', e.IdLibEtape);
          if (item.IdFicheMateriel === e.IdFicheMateriel) {
            e['IdLibEtape'] = item.IdLibEtape;
          }
        });
      });
    }

    this.patchFichesMateriel(this.multiDataToUpdate); // patch sur tableau de fiches Matériel (partielles)
  }



  patchFichesMateriel(fichesMateriel) { // 7/
    console.log('patch FM function => fichesMateriel (args) : ', fichesMateriel);
    console.log('patch FM function => this.annexElementsNgModel : ', this.annexElementsNgModel);
    this.fichesMaterielService
      .patchFicheMateriel(fichesMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (data) {
          this.changeValueToAnnexElementsInFM();
          this.checkChangeValueToEAComment();
          this.updateVersionFM();
          this.updateQualiteFM();
          // fichesMateriel.map(item => {
          //   console.log(item);
          //   this.addIdFicheMaterielToElementAnnexReset(item);
          // });
          console.log('this.newObject => ', this.newObject);
            console.log('patch FM with success', data);
          } else {
            console.log('error patch FM');
          }
      });
  }

/************************************************/
/*************** VERSION MANAGEMENT *************/
/************************************************/

  checkNeedChangeValueToVersion(): boolean {
    console.log('this.allVersionFm => ', this.allVersionFm);
    console.log('this.versionFmNgModel => ', this.versionFmNgModel);
    let versionChangements = [];
    this.allVersionFm.map(item => {
      this.versionFmNgModel.map(model => {
        item.forEach(versionFM => {
          if (versionFM.IdFicheAch_Lib_Versions === model.IdFicheAch_Lib_Versions && versionFM.Isvalid !== model.Isvalid) {
            versionChangements.push(versionFM);
          }
        });
      });
    });
    console.log('versionChangements => ', versionChangements);
    if (versionChangements.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  updateVersionFM() {
    let needPutVersion: boolean = this.checkNeedChangeValueToVersion();
    if (needPutVersion) {
      this.allVersionFm.map(item => {
        this.versionFmNgModel.map(model => {
          item.forEach(versionFM => {
            if (versionFM.IdFicheAch_Lib_Versions === model.IdFicheAch_Lib_Versions && versionFM.Isvalid !== model.Isvalid) {
              console.log('versionFM before change => ', versionFM);
              if (model.Isvalid !== 'same') {
                versionFM.Isvalid = model.Isvalid;
              }
              console.log('versionFM after change => ', versionFM);
            }
          });
        });
      });
    }
    console.log('this.allVersionFm after change => ', this.allVersionFm);
    this.allVersionFm.map(item => {
      this.putVersionFicheMateriel(item);
    });
  }

/************************************************/
/************* QUALTITIES MANAGEMENT ************/
/************************************************/

  checkNeedChangeValueToQuality(): boolean {
    console.log('this.allQualitiesFm => ', this.allQualitiesFm);
    console.log('this.qualityFmNgModel => ', this.qualityFmNgModel);
    let qualityChangements = [];
    this.allQualitiesFm.map(item => {
      this.qualityFmNgModel.map(model => {
        item.forEach(qualityFM => {
          if (qualityFM.idLibQualiteSup === model.idLibQualiteSup && qualityFM.IsValid !== model.IsValid) {
            qualityChangements.push(qualityFM);
          }
        });
      });
    });
    console.log('qualityChangements => ', qualityChangements);
    if (qualityChangements.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  updateQualiteFM() {
    let needPutQuality: boolean = this.checkNeedChangeValueToQuality();
    if (needPutQuality) {
      this.allQualitiesFm.map(item => {
        this.qualityFmNgModel.map(model => {
          item.forEach(qualityFM => {
            if (qualityFM.idLibQualiteSup === model.idLibQualiteSup && qualityFM.IsValid !== model.IsValid) {
              console.log('qualityFM before change => ', qualityFM);
              if (model.IsValid !== 'same') {
                qualityFM.IsValid = model.IsValid;
              }
              console.log('qualityFM after change => ', qualityFM);
            }
          });
        });
      });
    }
    console.log('this.allQualitiesFm after change => ', this.allQualitiesFm);
    this.allQualitiesFm.map(item => {
      this.putQualiteFicheMateriel(item);
    });
  }

  checkChangeValueToEAComment() {
  let commentsToPut = [];
  let commentsToPost = [];
   console.log('this.allEACommentsMultiSelect in action component => ', this.allEACommentsMultiSelect);
   console.log('this.comments in action component => ', this.comments);
   this.allFichesMateriel.map(fm => {
     let category = [];
     this.comments.map(item => {
       if (item.Commentaire !== 'valeur d\'origine') {
         this.allEACommentsMultiSelect.map(com => {
           if ((com.IdFicheMateriel === fm.IdFicheMateriel) && (com.idLibCategorieElementsAnnexes === item.idLibCategorieElementsAnnexes)) {
              let newItem = {
                IdCategorieElementsAnnexesCommentaire: com.IdCategorieElementsAnnexesCommentaire,
                idLibCategorieElementsAnnexes: com.idLibCategorieElementsAnnexes,
                IdFicheMateriel: com.IdFicheMateriel,
                Commentaire: item.Commentaire,
                Fiche_Mat_LibCategorieElementsAnnexes: null,
                Fiche_Mat_Fichemateriel: null
              };
              commentsToPut.push(newItem);
              category.push(newItem.idLibCategorieElementsAnnexes);
           }
         });
          if (!category.includes(item.idLibCategorieElementsAnnexes)) {
            let newItem = {
                IdCategorieElementsAnnexesCommentaire: 0,
                idLibCategorieElementsAnnexes: item.idLibCategorieElementsAnnexes,
                IdFicheMateriel: fm.IdFicheMateriel,
                Commentaire: item.Commentaire,
                Fiche_Mat_LibCategorieElementsAnnexes: null,
                Fiche_Mat_Fichemateriel: null
              };
              commentsToPost.push(newItem);
          }
       }
     });
   });
    console.log('this.commentsToPut ================================================= ==> ', commentsToPut);
    if (commentsToPut.length > 0) {
      this.putCommentaireAnnexElementsFicheMateriel(commentsToPut);
    }
    console.log('this.commentsToPost ================================================= ==> ', commentsToPost);
    if (commentsToPost.length > 0) {
      this.postCommentaireAnnexElementsFicheMateriel(commentsToPost);
    }
  }

  changeValueToAnnexElementsInFM() { // 8/
    let that = this;
    console.log('PATCH FUNCTION : this.annexElementsNgModel => ', this.annexElementsNgModel);
    console.log('PATCH FUNCTION : this.allAnnexElementsFicheMateriel => ', this.allAnnexElementsFicheMateriel);
    this.newElementSAnnex = this.allAnnexElementsFicheMateriel.map( array => {
      console.log('array item from this.allAnnexElementsFicheMateriel : ', array);
      let arr = array.map(object => {
        console.log('object item from array : ', object);
        let isValid;
        console.log('this.annexElementsNgModel.length :', that.annexElementsNgModel.length);
        let currentNgModel = that.annexElementsNgModel.filter(item => item.IdPackageAttendu === object.IdPackageAttendu);
        console.log(currentNgModel);
        console.log(currentNgModel[0].IdPackageAttendu);
        console.log(object.IdPackageAttendu);
        if (currentNgModel[0].IsValid === 'same') {
          isValid = object.IsValid;
        } else {
          isValid = currentNgModel[0].IsValid;
        }
        let newItemElementAnnex = {
          IdElementsAnnexes: object.IdElementsAnnexes,
          IdFicheMateriel: object.IdFicheMateriel,
          IdPackageAttendu: object.IdPackageAttendu,
          IsValid: isValid,
          FicheAch_Lib_PackageAttendu: null,
          Fiche_Mat_Fichemateriel: null,
          Fiche_Mat_LibElementAnnexes: null
        };
        console.log(newItemElementAnnex);
        return object = newItemElementAnnex;
      });
      return arr;
    });
    console.log(this.newElementSAnnex);
    this.newElementSAnnex.map(item => {
      console.log(item);
        let index = this.newElementSAnnex.indexOf(item);
        this.putAnnexElementForFM(item, index, this.newElementSAnnex);
    });
  }

  putAnnexElementForFM(elementAnnexOfFM, index, newElementSAnnex) { // 9/
    console.log(elementAnnexOfFM);
    this.annexElementsService
      .putAnnexElementsFicheMateriel(elementAnnexOfFM)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        if (data) {
          console.log('succes PUT annexesElements => MULTI');
          console.log(data);
          if (index === newElementSAnnex.length - 1) {
            console.log('Action after save');
            this.actionAfterSave();
          }
        } else {
          console.log('error PUT annexesElements => MULTI');
          console.log(data);
        }
      });
  }

  /** Elements Annexes Comments **/

  updateCommentaireAnnexElementsFicheMateriel() {
    let commentsToUpdate = [];
    let commentToCreate = [];
    this.comments.map(item => {
      if (item.IdCategorieElementsAnnexesCommentaire === 0 && item.Commentaire !== '') {
        commentToCreate.push(item);
      } else if (item.IdCategorieElementsAnnexesCommentaire !== 0) {
        commentsToUpdate.push(item);
      }
    });
    console.log('commentsToUpdate ==> ', commentsToUpdate);
    console.log('commentToCreate ==> ', commentToCreate);
    if (commentToCreate.length > 0) {
      this.postCommentaireAnnexElementsFicheMateriel(commentToCreate);
    }
    if (commentsToUpdate.length > 0) {
      this.putCommentaireAnnexElementsFicheMateriel(commentsToUpdate);
    }
  }

  postCommentaireAnnexElementsFicheMateriel(comments: AnnexElementCommentsFicheMAteriel[]) {
    this.annexElementsService.postCommentaireAnnexElementsFicheMateriel(comments)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log('POST elements annexes comments with succes ! ', data);
      }, error => {
        console.error('ERROR POST elements annexes comments !', error);
      });
  }

  putCommentaireAnnexElementsFicheMateriel(comments: AnnexElementCommentsFicheMAteriel[]) {
    this.annexElementsService.putCommentaireAnnexElementsFicheMateriel(comments)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log('PUT elements annexes comments with succes ! ', data);
      }, error => {
        console.error('ERROR PUT elements annexes comments !', error);
      });
  }

}
