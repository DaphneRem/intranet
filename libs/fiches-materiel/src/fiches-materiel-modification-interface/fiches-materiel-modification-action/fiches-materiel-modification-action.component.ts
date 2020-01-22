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
  @Input() oriIsValid;
  @Input() premiereDiff;
  @Input() comments: AnnexElementCommentsFicheMAteriel[];
  @Input() accesLabo;
  @Input() allEACommentsMultiSelect;
  @Input() allVersionFm;
  @Input() versionFmNgModel;
  @Input() allQualitiesFm;
  @Input() qualityFmNgModel;
  @Input() fmInRecording;

  @Output() modificationMessage: EventEmitter<any> = new EventEmitter();
  @Output() propertiesChanged: EventEmitter<any> = new EventEmitter();
  @Output() fmInRecordingEvent: EventEmitter<boolean> = new EventEmitter();

  @Output() modifInProgressMessage: EventEmitter<string> = new EventEmitter();

  private onDestroy$: Subject<any> = new Subject();

  public fmInRecordingLocal = false;
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
    // console.log(this.newObject);
    // console.log(this.comments);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  /*************************************************************************************************************/
  /************************************* ACTION ONCLICK 'ENREGISTER' BTN  **************************************/
  /*************************************************************************************************************/

  modifFichesMateriel(closeAction) { // 1/
    // console.log('COMMENTS ================> ', this.comments);
    if (closeAction === 'close') {
      this.closeInterface = true;
    } else {
      this.closeInterface = false;
    }
    if (this.checkAllValidDates()) {
      this.modifInProgressMessage.emit('Enregistrement des Fiches Matériel...');
      this.fmInRecordingEvent.emit(true);
      this.fmInRecordingLocal = true;
      let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
      if (this.selectionType === 'one') {
        this.getFicheMaterielOriginal(this.newObject.IdFicheMateriel);
      } else {
        this.checkChanges(this.allIdSelectedFichesMateriel);
      }
    } else {
      this.displayNotValidDateMessageModal();
    }
  }

  /*************************************************************************************************************/
  /****************************************** LAST ACTIONS AFTER SAVE  *****************************************/
  /*************************************************************************************************************/

  goBack() { // ONE
    this.location.back();
  }

  actionAfterSave() { // 10/ ONE
    // console.log('ACTION AFTER SAVE CALL !!!', this.newObject);
    console.log('ACTION AFTER SAVE CALL !!!');
    if (this.closeInterface) {
      this.goBack();
    } else {
      this.fmInRecordingEvent.emit(false);
      this.fmInRecordingLocal = false;
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      this.modifInProgressMessage.emit('');
      // console.log('this.changedValues ===> ', this.changedValues);
      this.modificationMessage.emit(`Dernières modifications enregistrées à ${hours}:${minutes}`);
      this.propertiesChanged.emit(this.changedValues);
    }
  }

  /*************************************************************************************************************/
  /*********************************************** DATES MANAGEMENT ********************************************/
  /*************************************************************************************************************/

  checkAllValidDates(): boolean { // 2/
    console.log('this.deadlineIsValid => ', this.deadlineIsValid);
    console.log('this.livraisonIsValid => ', this.livraisonIsValid);
    console.log('this.acceptationIsValid => ', this.acceptationIsValid);
    console.log('this.premiereDiff => ', this.premiereDiff);
    console.log('this.accesLabo => ', this.accesLabo);
    console.log('this.oriIsValid => ', this.oriIsValid);
    if (
      this.deadlineIsValid
      && this.livraisonIsValid
      && this.acceptationIsValid
      && this.premiereDiff
      && this.accesLabo
      && (this.oriIsValid || this.newObject.RetourOri !== 3)
    ) {
      return true;
    } else {
      return false;
    }
  }

  addZeroToDate(date) { // ONE
    // console.log('date => ', date);
    if (date) {
      // console.log(date.toString());
      if (date.toString().length === 1) {
        return `0${date}`;
      } else {
        return date;
      }
    }
  }

  resetDateFormat(newObject) { // 5/ ONE & MULTI
    // console.log('before resetDateFormat : this.newObject => ', this.newObject);
     console.log('newObject.Deadline => ', newObject.Deadline);
    // console.log('newObject.DateLivraison => ', newObject.DateLivraison);
    // console.log('newObject.DatePremiereDiff => ', newObject.DatePremiereDiff);
    // console.log('newObject.DateAcceptation => ', newObject.DateAcceptation);
    // console.log('newObject.ReceptionAccesLabo => ', newObject.ReceptionAccesLabo);
    // console.log('newObject.DateLivraison => ', newObject.DateRetourOri);
    // console.log('newObject.DateLivraison => ', newObject.RetourOriDernierDelai);
    if (
      newObject.Deadline !== null &&
      newObject.Deadline !== this.valueNotToChangeLibelle &&
      newObject.Deadline !== 'dd-mm-yyyy'
    ) {
      this.checkDeadline(newObject);
    } else if (newObject.Deadline === null) {
      this.newObject.Deadline = null;
    } else if (newObject.Deadline === 'dd-mm-yyyy') {
      if ((this.newObject.isarchived === 0)) {
        let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
        // console.log('nullDate => --------------------------------------- ', nullDate);
        // console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
        this.newObject.Deadline = nullDate;
        this.newObject.isarchived = 1;
      } else if (this.newObject.isarchived === 1) {
        if (this.newObject.IdLibstatut === 1 // en cours
          || this.newObject.IdLibstatut === 3 && this.newObject.IdLibEtape !== 21
          || this.newObject.IdLibstatut === 2 && this.newObject.IdLibEtape !== 20
          || this.newObject.IdLibstatut === 5 && this.newObject.IdLibEtape !== 24
        ) {
          let today = moment().format('YYYY-MM-DDTHH:mm:ss');
          this.newObject.Deadline = today;
          console.log('&&&&&&&&&&&&&&&&& La deadline  &&&&&&&&&&&&&&&&&&&&&& => ', this.changedValues);
          this.newObject.isarchived = 0;
        }
      }
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
      // console.log('newObject.DateLivraison => ', newObject.DateLivraison);
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
      // console.log('newObject.DatePremiereDiff => ', newObject.DatePremiereDiff);
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
      // console.log('newObject.DateAcceptation => ', newObject.DateAcceptation);
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
      // console.log('newObject.ReceptionAccesLabo => ', newObject.ReceptionAccesLabo);
      // newObject.ReceptionAccesLabo = new Date(newObject.ReceptionAccesLabo.year, newObject.ReceptionAccesLabo.month - 1, newObject.ReceptionAccesLabo.day).toDateString();
    }
    if (this.newObject.RetourOri !== 3) {
      newObject.DateRetourOri = null;
    } else if (
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

  checkDeadline(newObject) { // ONE
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
      console.log('Deadline => ', this.newObject.Deadline);
    }
  }

  displayNotValidDateMessageModal() { // ONE
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
      if (!this.oriIsValid) {
        invalidDate.push('date de retour ori');
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

  /*************************************************************************************************************/
  /*********************************************** PUT REQUESTS  ***********************************************/
  /*************************************************************************************************************/
 public qualiteRecorded = []; // NEED TO RESET AFTER RECORDING
  putQualiteFicheMateriel(qualiteFM) { // ONE & MULTI
    let quality = null;
    let that = this;
    this.qualiteService.putQualite(qualiteFM)
      // .pipe(takeUntil(this.onDestroy$))
      // .subscribe(qualite => {
      .then( qualite => {
        // console.log(qualite);
        quality = qualite;
        if (qualite) {
          console.log('PUT qualite with succes');
          if (this.selectionType === 'multi') {
            this.qualiteRecorded.push(qualite);
            if (this.qualiteRecorded.length === this.allQualitiesFm.length) {
              console.log('last quality to PUT, this.qualiteRecorded.length => ', this.qualiteRecorded.length);
              this.qualityRecording = false;
              this.updateVersionFM();
            }
          }
          // console.log(qualite);
        } else {
          console.error('ERROR PUT qualite');
          this.displaySwalError('Qualités');
          // console.log(qualite);
        }
      }, error => {
        this.displaySwalError('Qualités', error);
      }
      // , () => { // Reloead function until response exist (so that it is not stalled)
      //   if (quality === null) {
      //     console.log('canceled error quality => ', quality);
      //     that.putQualiteFicheMateriel(qualiteFM);
      //   }
      //   console.log('QUALITE DONE');
      // }
    );
  }

  public versionsRecorded = [];
  putVersionFicheMateriel(versionFM) { // ONE & MULTI
    let versionData = null;
    let that = this;
    // await this.versionService.putAllVersions(versionFM)
    this.versionService.putVersion(versionFM)
      // .pipe(takeUntil(this.onDestroy$))
      // .subscribe(version => {
      .then(version => {
        console.log(version);
        versionData = version;
        if (version) {
          if (this.selectionType === 'multi') {
            this.versionsRecorded.push(version);
            if (this.versionsRecorded.length === this.allVersionFm.length) {
               console.log('PUT ALL version with succes');
               this.modifInProgressMessage.emit('Enregistrement Terminé');
               this.actionAfterSave();
            }
          }
          // console.log(version);
        } else {
          console.error('ERROR PUT version');
          this.displaySwalError('Versions');
          // console.log(version);
        }
      }
      , error => {
        this.displaySwalError('Versions', error);
      }
      // , () => { // Reloead function until response exist (so that it is not stalled)
      //   if (versionData === null) {
      //     console.log('canceled error versionData => ', versionData);
      //     that.putVersionFicheMateriel(versionFM);
      //   }
      //   console.log('VERSION DONE');
      // }
    );
  }


  public annexesElementPut = [];
  public fmRecorded = [];
  putAnnexElementForFM(elementAnnexOfFM, index, newElementSAnnex) { // 9/ MULTI
    console.log('elementAnnexOfFM ==> ', elementAnnexOfFM);
    let annexElData = null;
    let that = this;
    this.annexElementsService
      .putAnnexElementsFicheMateriel(elementAnnexOfFM)
      // .pipe(takeUntil(this.onDestroy$))
      // .subscribe(data => {
      .then(data => {
        // console.log(data);
        annexElData = data;
        if (data) {
          console.log('succes PUT annexesElements => MULTI');
          // console.log(data);
          this.fmRecorded.push(data);
          console.log('this.fmRecorded after push ==> ', this.fmRecorded);
          if (this.fmRecorded.length === newElementSAnnex.length) {
            console.log(
              'this.fmRecorded.length === newElementSAnnex.length => ',
              'this.fmRecorded.length = ',
              this.fmRecorded.length,
              ' newElementSAnnex.length = ',
              newElementSAnnex.length
            );
            // this.actionAfterSave();
            this.checkChangeValueToEAComment();
          }
          if (index === newElementSAnnex.length - 1) {
            // this.checkChangeValueToEAComment();
            // this.updateQualiteFM();
            // this.updateVersionFM();
            // console.log('Action after save');
            // this.actionAfterSave();
          }
        } else {
          console.error('error PUT annexesElements => MULTI');
          this.displaySwalError('éléments annexes');
          // console.log(data);
        }
      }, error => {
        console.error('error PUT annexesElements => ', error);
        this.displaySwalError('éléments annexes', error);
      }
      // , () => { // Reloead function until response exist (so that it is not stalled)
      //   if (annexElData === null) {
      //     console.log('canceled error annexElData => ', annexElData);
      //     that.putAnnexElementForFM(elementAnnexOfFM, index, newElementSAnnex);
      //   }
      //   console.log('ELEMENTS ANNEXES DONE');
      // }
    );
  }

  putCommentaireAnnexElementsFicheMateriel(comments: AnnexElementCommentsFicheMAteriel[]) { // ONE & MULTI
    let comAnnexElData = null;
    let that = this;
    this.annexElementsService.putCommentaireAnnexElementsFicheMateriel(comments)
      .then(data => {
        console.log('PUT elements annexes comments with succes ! ', data);
        comAnnexElData = data;
        if (data) {
          if (!this.qualityRecording) {
            this.updateQualiteFM();
          }
        } else {
          this.displaySwalError('commentaires des éléments annexes');
        }
      }, error => {
        console.error('ERROR PUT elements annexes comments !', error);
        this.displaySwalError('commentaires des éléments annexes', error);
      }
      // , () => { // Reloead function until response exist (so that it is not stalled)
      //   if (comAnnexElData === null) {
      //     console.log('canceled error comAnnexElData => ', comAnnexElData);
      //     that.putCommentaireAnnexElementsFicheMateriel(comments);
      //   }
      //   console.log('comAnnexElData DONE');
      // }
      );
  }

  /*************************************************************************************************************/
  /*********************************************** POST REQUESTS  **********************************************/
  /*************************************************************************************************************/

  postCommentaireAnnexElementsFicheMateriel(comments: AnnexElementCommentsFicheMAteriel[]) { // ONE & MULTI
    this.annexElementsService.postCommentaireAnnexElementsFicheMateriel(comments)
      // .pipe(takeUntil(this.onDestroy$))
      // .subscribe(data => {
      .then(data => {
        console.log('POST elements annexes comments with succes ! ', data);
        if (data) {
          if (!this.qualityRecording) { // si la qulité n'est pas déjà en train d'être enregistrer au PUT
            this.updateQualiteFM();
          }
        }
      }, error => {
        console.error('ERROR POST elements annexes comments !', error);
      });
  }

  /*************************************************************************************************************/
  /****************************************** ONLY FOR 'MULTI' MODIF  ********************************************/
  /*************************************************************************************************************/

  checkChanges(allId) { // 4/ MULTI
    // CALL IF SELECTION TYPE IS 'MULTI'
    // let changedValues = {};
    // console.log(allId);
    // console.log(this.newObject);
    this.resetDateFormat(this.newObject);
    // console.log(this.newObject);
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
            // console.log(this.changedValues);
          }
        }
      } else {
        // console.log('key => ', key);
        // console.log('this.newObject[key] (value) => ', this.newObject[key]);
      }
    }
    console.log('this.changedValues =>', this.changedValues);
    // console.log(this.selectionType);
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
      if ((this.newObject.Deadline === null || this.newObject.Deadline === 'dd-mm-yyyy') && (this.newObject.isarchived === 0)) {
        let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
        // console.log('nullDate => --------------------------------------- ', nullDate);
        // console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
        this.changedValues['Deadline'] = nullDate;
        this.changedValues['isarchived'] = 1;
      } else if ((this.newObject.Deadline === 'dd-mm-yyyy') && (this.newObject.isarchived === 1)) {
        if (this.newObject.IdLibstatut === 1 // en cours
        || this.newObject.IdLibstatut === 3 && this.newObject.IdLibEtape !== 21
        || this.newObject.IdLibstatut === 2 && this.newObject.IdLibEtape !== 20
        || this.newObject.IdLibstatut === 5 && this.newObject.IdLibEtape !== 24
        ) {
          let today = moment().format('YYYY-MM-DDTHH:mm:ss');
          this.changedValues['Deadline'] = today;
          console.log('&&&&&&&&&&&&&&&&& La deadline  &&&&&&&&&&&&&&&&&&&&&& => ', this.changedValues);
          this.changedValues['isarchived'] = 0;
        }
      } else if (this.newObject.Deadline === this.valueNotToChangeLibelle) {
        // console.log('ERROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOR => ', this.newObject.Deadline);
        // this.changedValues['Deadline'] = moment().format('YYYY-MM-DDTHH:mm:ss');
        // console.log('deadline error => ', this.changedValues['Deadline']);
      }
      
    }
    console.log('this.changedValues after deadline management =>', this.changedValues);
    for (let item in this.changedValues) {
      if (item !== 'Deadline' && this.changedValues[item] === 'dd-mm-yyyy') {
        this.changedValues[item] = null;
      }
    }
    console.log('this.changedValues after date null management =>', this.changedValues);
    let now = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.changedValues['UserModification'] = this.user;
    this.changedValues['DateModification'] = now;
    this.displaymultiDataToUpdate(allId);
  }

  displaymultiDataToUpdate(allId) { // 6/ MULTI
    // console.log('displaymultiDataToUpdate : this.newObject => ', this.newObject);
    this.multiDataToUpdate = allId.map(item => {
      item = Object.assign({}, item, this.changedValues);
      return item;
    });
    // console.log('this.multiDataToUpdate : ', this.multiDataToUpdate);
    // this.multiDataToUpdate.map(item => { // patch sur chaque fiche Matériel
    //   this.patchFichesMateriel([item]);
    // });
    // console.log(this.allAnnexElementsFicheMateriel);
    if (!this.changedValues['IdLibstatut']) {
      this.multiDataToUpdate.map(e => {
        this.initialFichesMateriel.map(item => {
          // console.log('e.IdLibstatut => ', e.IdLibstatut);
          if (item.IdFicheMateriel === e.IdFicheMateriel) {
            e['IdLibstatut'] = item.IdLibstatut;
          }
        });
      });
    }
    if (!this.changedValues['IdLibEtape']) {
      this.multiDataToUpdate.map(e => {
        this.initialFichesMateriel.map(item => {
          // console.log('e.IdLibEtape => ', e.IdLibEtape);
          if (item.IdFicheMateriel === e.IdFicheMateriel) {
            e['IdLibEtape'] = item.IdLibEtape;
          }
        });
      });
    }

    this.patchFichesMateriel(this.multiDataToUpdate); // patch sur tableau de fiches Matériel (partielles)
  }

  patchFichesMateriel(fichesMateriel) { // 7/ MULTI
    // console.log('patch FM function => fichesMateriel (args) : ', fichesMateriel);
    // console.log('patch FM function => this.annexElementsNgModel : ', this.annexElementsNgModel);
    this.fichesMaterielService
      .patchFicheMateriel(fichesMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if (data) {
          // C'EST ICI QU'IL FAUT IMBRIQUER LES FONCTIONS LES UNES DANS LES AUTRES
          this.changeValueToAnnexElementsInFM();

          // this.checkChangeValueToEAComment();
          // this.updateQualiteFM();
          // this.updateVersionFM();

          // fichesMateriel.map(item => {
          //   console.log(item);
          //   this.addIdFicheMaterielToElementAnnexReset(item);
          // });
          // console.log('this.newObject => ', this.newObject);
          // console.log('patch FM with success', data);
          } else {
            swal({
              text: 'Un problème est survenu, impossible d\'enregistrer le changements apportés',
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'Retour',
              confirmButtonColor: '#aaaaaa',
            });
            // console.log('error patch FM');
          }
      }, error => {
        swal({
          text: 'Un problème est survenu, impossible d\'enregistrer les changements apportés',
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Retour',
          confirmButtonColor: '#aaaaaa',
        });
      });
  }

  /*************************************************************************************************************/
  /****************************************** ONLY FOR 'ONE' MODIF  ********************************************/
  /*************************************************************************************************************/

  getFicheMaterielOriginal(id) { // ONE
    this.fichesMaterielService.getOneFicheMateriel(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        // console.log(data);
        this.myFicheMateriel = data[0];
        if (
          JSON.stringify(this.newObject) === JSON.stringify(this.myFicheMateriel)
        ) {
          // console.log(this.newObject[0]);
          // console.log('true');
          // console.log(this.newObject === this.myFicheMateriel);
          // console.log(this.myFicheMateriel);
        } else {
          // console.log('false');
          // console.log(this.newObject);
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

  updatePutFicheMateriel(e) { // ONE
    // console.log(e);
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
          // console.log('succes PUT fiche materiel');
          // console.log('data to PUT : ', this.annexElementsFicheMateriel);
          // console.log(data);
          // console.log(this.annexElementsFicheMateriel);
          this.annexElementsService
            .putAnnexElementsFicheMateriel(this.annexElementsFicheMateriel)
            .then(annexesElements => {
            // .pipe(takeUntil(this.onDestroy$))
            // .subscribe(annexesElements => {
              // console.log(annexesElements);
              if (annexesElements) {
                // console.log('succes PUT annexesElements');
                // console.log(annexesElements);
                this.actionAfterSave();
              } else {
                console.error('error PUT annexesElements');
                this.displaySwalError('éléments annexes');
                // console.log(annexesElements);
              }
            }, error => {
              this.displaySwalError('éléments annexes', error);
            });
          this.putQualiteFicheMateriel(this.qualiteFM);
          this.putVersionFicheMateriel(this.versionFicheMateriel);
          // ICI
          this.updateCommentaireAnnexElementsFicheMateriel();
        } else {
          this.displaySwalError('fiche matériel');
          // console.log('error patch FM');
        }
      }, error => {
        this.displaySwalError('fiche matériel', error);
      });
    // -------------------------->>>>>>>>>>>>>>>>>>>> Résoudre problème
  }

  /*************************************************************************************************************/
  /********************************************* SECURITY WARNING  *********************************************/
  /*************************************************************************************************************/

  displaySwalError(label: string, error?) { // ONE & MULTI
    let swalText: string;
    let labelText = `Un problème est survenu, impossible d\'enregistrer les changements apportés aux valeurs ${label}`;
    if (error) {
      let errorText = `, erreur : ${error}`;
      swalText = labelText + errorText;
    } else {
      swalText = labelText;
    }
    swal({
      text: swalText,
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Retour',
      confirmButtonColor: '#aaaaaa',
    });
  }

  /*************************************************************************************************************/
  /******************************************* VERSION : CHECK & UPDATE  ***************************************/
  /*************************************************************************************************************/

  checkNeedChangeValueToVersion(): boolean {
    console.log('this.allVersionFm => ', this.allVersionFm);
    console.log('this.versionFmNgModel => ', this.versionFmNgModel);
    let versionChangements = [];
    this.allVersionFm.map(item => {
      this.versionFmNgModel.map(model => {
        item.forEach(versionFM => {
          if (versionFM.IdFicheAch_Lib_Versions === model.IdFicheAch_Lib_Versions && versionFM.Isvalid !== model.Isvalid && versionFM.Isvalid !== 'same') {
            versionChangements.push(versionFM);
          }
        });
      });
    });
    // console.log('versionChangements => ', versionChangements);
    if (versionChangements.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  updateVersionFM() { // MULTI
    this.modifInProgressMessage.emit('Versions en cours d\'enregistrement...');
    let needPutVersion: boolean = this.checkNeedChangeValueToVersion();
    if (needPutVersion) {
      this.allVersionFm.map(item => {
        this.versionFmNgModel.map(model => {
          item.forEach(versionFM => {
            if (versionFM.IdFicheAch_Lib_Versions === model.IdFicheAch_Lib_Versions && versionFM.Isvalid !== model.Isvalid) {
              // console.log('versionFM before change => ', versionFM);
              if (model.Isvalid !== 'same') {
                versionFM.Isvalid = model.Isvalid;
              }
              // console.log('versionFM after change => ', versionFM);
            }
          });
        });
      });
    }
    console.log('this.allVersionFm after change => ', this.allVersionFm);
    this.allVersionFm.map(item => {
      this.putVersionFicheMateriel(item);
    });
    // this.putVersionFicheMateriel(this.allVersionFm);
  }

  /*************************************************************************************************************/
  /******************************************* QUALITY : CHECK & UPDATE  ***************************************/
  /*************************************************************************************************************/

  checkNeedChangeValueToQuality(): boolean {
    // console.log('this.allQualitiesFm => ', this.allQualitiesFm);
    // console.log('this.qualityFmNgModel => ', this.qualityFmNgModel);
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
    // console.log('qualityChangements => ', qualityChangements);
    if (qualityChangements.length > 0) {
      return true;
    } else {
      return false;
    }
  }
public qualityRecording = false;
  updateQualiteFM() { // MULTI
    this.qualityRecording = true;
    this.modifInProgressMessage.emit('Qualités en cours d\'enregistrement...');
    let needPutQuality: boolean = this.checkNeedChangeValueToQuality();
    if (needPutQuality) {
      this.allQualitiesFm.map(item => {
        this.qualityFmNgModel.map(model => {
          item.forEach(qualityFM => {
            if (qualityFM.idLibQualiteSup === model.idLibQualiteSup && qualityFM.IsValid !== model.IsValid) {
              // console.log('qualityFM before change => ', qualityFM);
              if (model.IsValid !== 'same') {
                qualityFM.IsValid = model.IsValid;
              }
              // console.log('qualityFM after change => ', qualityFM);
            }
          });
        });
      });
    }
    // console.log('this.allQualitiesFm after change => ', this.allQualitiesFm);
    this.allQualitiesFm.map(item => {
      this.putQualiteFicheMateriel(item);
    });
  }


  /*************************************************************************************************************/
  /**************************************** EA COMMENTS : CHECK & UPDATE  **************************************/
  /*************************************************************************************************************/

  checkChangeValueToEAComment() { // MULTI
  this.modifInProgressMessage.emit('Commentaires des éléments annexes en cours d\'enregistrement...');
  let commentsToPut = [];
  let commentsToPost = [];
  //  console.log('this.allEACommentsMultiSelect in action component => ', this.allEACommentsMultiSelect);
  //  console.log('this.comments in action component => ', this.comments);
   this.allFichesMateriel.map(fm => {
     let category = [];
     this.comments.map(item => {
       console.log('item.commentaire => ', item.Commentaire);
      //  if (item.Commentaire !== 'valeur d\'origine') {
      if (item.Commentaire !== this.valueNotToChangeLibelle) {

         console.log('item.commentaire !== "this.valueNotToChangeLibelle" => ', item.Commentaire);
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
    if (commentsToPut.length === 0 && commentsToPost.length === 0) {
      this.updateQualiteFM();
    }
  }

  updateCommentaireAnnexElementsFicheMateriel() { // ONE
    let commentsToUpdate = [];
    let commentToCreate = [];
    this.comments.map(item => {
      if (item.IdCategorieElementsAnnexesCommentaire === 0 && item.Commentaire !== '') {
        commentToCreate.push(item);
      } else if (item.IdCategorieElementsAnnexesCommentaire !== 0) {
        commentsToUpdate.push(item);
      }
    });
    // console.log('commentsToUpdate ==> ', commentsToUpdate);
    // console.log('commentToCreate ==> ', commentToCreate);
    if (commentToCreate.length > 0) {
      this.postCommentaireAnnexElementsFicheMateriel(commentToCreate);
    }
    if (commentsToUpdate.length > 0) {
      this.putCommentaireAnnexElementsFicheMateriel(commentsToUpdate);
    }
  }

  /*************************************************************************************************************/
  /************************************** ANNEXES ELEMENTS : CHECK & UPDATE  ***********************************/
  /*************************************************************************************************************/

  changeValueToAnnexElementsInFM() { // 8/ MULTI
    this.modifInProgressMessage.emit('Eléments Annexes en cours d\'enregistrement...');
    let that = this;
    // console.log('PATCH FUNCTION : this.annexElementsNgModel => ', this.annexElementsNgModel);
    // console.log('PATCH FUNCTION : this.allAnnexElementsFicheMateriel => ', this.allAnnexElementsFicheMateriel);
    this.newElementSAnnex = this.allAnnexElementsFicheMateriel.map( array => {
      // console.log('array item from this.allAnnexElementsFicheMateriel : ', array);
      let arr = array.map(object => {
        // console.log('object item from array : ', object);
        let isValid;
        // console.log('this.annexElementsNgModel.length :', that.annexElementsNgModel.length);
        let currentNgModel = that.annexElementsNgModel.filter(item => item.IdPackageAttendu === object.IdPackageAttendu);
        // console.log(currentNgModel);
        // console.log(currentNgModel[0].IdPackageAttendu);
        // console.log(object.IdPackageAttendu);
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
        // console.log(newItemElementAnnex);
        return object = newItemElementAnnex;
      });
      return arr;
    });
    // console.log(this.newElementSAnnex);
    this.newElementSAnnex.map(item => {
      // console.log(item);
        let index = this.newElementSAnnex.indexOf(item);
        this.putAnnexElementForFM(item, index, this.newElementSAnnex);
    });
  }

}
