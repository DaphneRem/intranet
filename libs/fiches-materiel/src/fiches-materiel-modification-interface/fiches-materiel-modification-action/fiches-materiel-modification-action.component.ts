import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import swal from 'sweetalert2';

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
export class FichesMaterielModificationActionComponent implements OnInit {

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

  @Output() modificationMessage: EventEmitter<any> = new EventEmitter();

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

  checkAllValidDates(): boolean {
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

  modifFichesMateriel(closeAction) {
    console.log('COMMENTS ================> ', this.comments);
    if (closeAction === 'close') {
      this.closeInterface = true;
    } else {
      this.closeInterface = false;
    }
    if (this.checkAllValidDates()) {
      this.checkNewObjectModif();
    } else {
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
  }

  goBack() {
    this.location.back();
  }

  actionAfterSave() {
    console.log(this.newObject);
    if (this.closeInterface) {
      this.goBack();
    } else {
      let now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      this.modificationMessage.emit(`Dernières modifications enregistrées à ${hours}:${minutes}`);
    }
  }

  putQualiteFicheMateriel(qualiteFM) {
    this.qualiteService.putQualite(qualiteFM).subscribe(qualite => {
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
    this.versionService.putVersion(versionFM).subscribe(version => {
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
    console.log(newObject.Deadline);
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
      newObject.Deadline = `${newObject.Deadline.year}-${
        newObject.Deadline.month
      }-${newObject.Deadline.day}T00:00:00`;
    }
  }

  resetDateFormat(newObject) {
    console.log(newObject.Deadline);
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
      newObject.DateLivraison = `${newObject.DateLivraison.year}-${
        newObject.DateLivraison.month
      }-${newObject.DateLivraison.day}T00:00:00`;
    }
    if (
      newObject.DatePremiereDiff !== null &&
      newObject.DatePremiereDiff !== this.valueNotToChangeLibelle &&
      newObject.DatePremiereDiff !== 'dd-mm-yyyy'
    ) {
      newObject.DatePremiereDiff = `${newObject.DatePremiereDiff.year}-${
        newObject.DatePremiereDiff.month
      }-${newObject.DatePremiereDiff.day}T00:00:00`;
    }
    if (
      newObject.DateAcceptation !== null &&
      newObject.DateAcceptation !== this.valueNotToChangeLibelle &&
      newObject.DateAcceptation !== 'dd-mm-yyyy'
    ) {
      newObject.DateAcceptation = `${newObject.DateAcceptation.year}-${
        newObject.DateAcceptation.month
      }-${newObject.DateAcceptation.day}T00:00:00`;
    }
    if (
      newObject.ReceptionAccesLabo !== null &&
      newObject.ReceptionAccesLabo !== this.valueNotToChangeLibelle &&
      newObject.ReceptionAccesLabo !== 'dd-mm-yyyy'
    ) {
      newObject.ReceptionAccesLabo = `${newObject.ReceptionAccesLabo.year}-${
        newObject.ReceptionAccesLabo.month
      }-${newObject.ReceptionAccesLabo.day}T00:00:00`;
      // newObject.ReceptionAccesLabo = new Date(newObject.ReceptionAccesLabo.year, newObject.ReceptionAccesLabo.month - 1, newObject.ReceptionAccesLabo.day).toDateString();
    }
    if (
      newObject.DateRetourOri !== null &&
      newObject.DateRetourOri !== this.valueNotToChangeLibelle &&
      newObject.DateRetourOri !== 'dd-mm-yyyy'
    ) {
      newObject.DateRetourOri = `${newObject.DateRetourOri.year}-${
        newObject.DateRetourOri.month
      }-${newObject.DateRetourOri.day}T00:00:00`;
    }
    if (
      newObject.RetourOriDernierDelai !== null &&
      newObject.RetourOriDernierDelai !== this.valueNotToChangeLibelle &&
      newObject.RetourOriDernierDelai !== 'dd-mm-yyyy'
    ) {
      newObject.RetourOriDernierDelai = `${
        newObject.RetourOriDernierDelai.year
      }-${newObject.RetourOriDernierDelai.month}-${
        newObject.RetourOriDernierDelai.day
      }T00:00:00`;
    }
  }

  getFicheMaterielOriginal(id) {
    this.fichesMaterielService.getOneFicheMateriel(id).subscribe(data => {
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
    this.fichesMaterielService.updateFicheMateriel([e]).subscribe(data => {
      if (data) {
        console.log('succes PUT fiche materiel');
        console.log('data to PUT : ', this.annexElementsFicheMateriel);
        console.log(data);
        console.log(this.annexElementsFicheMateriel);
        this.annexElementsService
          .putAnnexElementsFicheMateriel(this.annexElementsFicheMateriel)
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

  checkNewObjectModif() {
    if (this.selectionType === 'one') {
      this.getFicheMaterielOriginal(this.newObject.IdFicheMateriel);
    } else {
      this.checkChanges(this.allIdSelectedFichesMateriel);
    }
  }

  checkChanges(allId) {
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
    if ((this.newObject.Deadline === null) && this.selectionType === 'multi') {
      let nullDate = moment('01-01-1970').format('YYYY-MM-DDTHH:mm:ss');
      console.log('nullDate => --------------------------------------- ', nullDate);
      console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
      this.changedValues['isarchived'] = 1;
      this.changedValues['Deadline'] = nullDate;
    } else {
      console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
      this.changedValues['isarchived'] = 0;
      this.changedValues['Deadline'] = this.newObject.Deadline;

    }
    let now = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.changedValues['UserModification'] = this.user;
    this.changedValues['DateModification'] = now;
    this.displaymultiDataToUpdate(allId);
  }

  displaymultiDataToUpdate(allId) {
    this.multiDataToUpdate = allId.map(item => {
      item = Object.assign({}, item, this.changedValues);
      return item;
    });
    console.log('this.multiDataToUpdate : ', this.multiDataToUpdate);
    // this.multiDataToUpdate.map(item => { // patch sur chaque fiche Matériel
    //   this.patchFichesMateriel([item]);
    // });
    console.log(this.allAnnexElementsFicheMateriel);
    this.patchFichesMateriel(this.multiDataToUpdate); // patch sur tableau de fiches Matériel (partielles)
  }



  patchFichesMateriel(fichesMateriel) {
    console.log('patch FM function => fichesMateriel (args) : ', fichesMateriel);
    console.log('patch FM function => this.annexElementsNgModel : ', this.annexElementsNgModel);
    this.fichesMaterielService
      .patchFicheMateriel(fichesMateriel)
      .subscribe(data => {
        if (data) {
          this.changeValueToAnnexElementsInFM();
          this.checkChangeValueToEAComment();
          // fichesMateriel.map(item => {
          //   console.log(item);
          //   this.addIdFicheMaterielToElementAnnexReset(item);
          // });
            console.log('patch FM with success', data);
          } else {
            console.log('error patch FM');
          }
      });
  }
public commentsToPut = [];
  checkChangeValueToEAComment() {
   console.log('this.allEACommentsMultiSelect in action component => ', this.allEACommentsMultiSelect);
   console.log('this.comments in action component => ', this.comments);
   this.comments.map(item => {
     if (item.Commentaire !== 'valeur d\'origine') {
        console.log('commentaire modifié ===> ', item);
        this.allEACommentsMultiSelect.map(com => {
          if (com.idLibCategorieElementsAnnexes === item.idLibCategorieElementsAnnexes) {
            let newItem = {
              IdCategorieElementsAnnexesCommentaire: com.IdCategorieElementsAnnexesCommentaire,
              idLibCategorieElementsAnnexes: com.idLibCategorieElementsAnnexes,
              IdFicheMateriel: com.IdFicheMateriel,
              Commentaire: item.Commentaire
            };
            com.Commentaire = item.Commentaire;
            this.commentsToPut.push(newItem);
          }
                         console.log('this.commentsToPut ==> ', this.commentsToPut);
   console.log(this.allEACommentsMultiSelect);
        });
     }
   });

  }

  changeValueToAnnexElementsInFM() {
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

  putAnnexElementForFM(elementAnnexOfFM, index, newElementSAnnex) {
    console.log(elementAnnexOfFM);
    this.annexElementsService
      .putAnnexElementsFicheMateriel(elementAnnexOfFM)
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
      .subscribe(data => {
        console.log('POST elements annexes comments with succes ! ', data);
      }, error => {
        console.error('ERROR POST elements annexes comments !', error);
      });
  }

  putCommentaireAnnexElementsFicheMateriel(comments: AnnexElementCommentsFicheMAteriel[]) {
    this.annexElementsService.putCommentaireAnnexElementsFicheMateriel(comments)
      .subscribe(data => {
        console.log('PUT elements annexes comments with succes ! ', data);
      }, error => {
        console.error('ERROR PUT elements annexes comments !', error);
      });
  }

}
