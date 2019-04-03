import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FicheMateriel } from '../../models/fiche-materiel';

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
  }

  modifFichesMateriel(closeAction) {
    if (closeAction === 'close') {
      this.closeInterface = true;
    } else {
      this.closeInterface = false;
    }
    this.checkNewObjectModif();
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
      newObject.Deadline !== this.valueNotToChangeLibelle
    ) {
      this.checkDeadline(newObject);
    } else if (newObject.Deadline === null) {
      this.newObject.Deadline = null;
    }
    if (
      newObject.DateLivraison !== null &&
      newObject.DateLivraison !== this.valueNotToChangeLibelle
    ) {
      newObject.DateLivraison = `${newObject.DateLivraison.year}-${
        newObject.DateLivraison.month
      }-${newObject.DateLivraison.day}T00:00:00`;
    }
    if (
      newObject.DatePremiereDiff !== null &&
      newObject.DatePremiereDiff !== this.valueNotToChangeLibelle
    ) {
      newObject.DatePremiereDiff = `${newObject.DatePremiereDiff.year}-${
        newObject.DatePremiereDiff.month
      }-${newObject.DatePremiereDiff.day}T00:00:00`;
    }
    if (
      newObject.DateAcceptation !== null &&
      newObject.DateAcceptation !== this.valueNotToChangeLibelle
    ) {
      newObject.DateAcceptation = `${newObject.DateAcceptation.year}-${
        newObject.DateAcceptation.month
      }-${newObject.DateAcceptation.day}T00:00:00`;
    }
    if (
      newObject.ReceptionAccesLabo !== null &&
      newObject.ReceptionAccesLabo !== this.valueNotToChangeLibelle
    ) {
      newObject.ReceptionAccesLabo = `${newObject.ReceptionAccesLabo.year}-${
        newObject.ReceptionAccesLabo.month
      }-${newObject.ReceptionAccesLabo.day}T00:00:00`;
      // newObject.ReceptionAccesLabo = new Date(newObject.ReceptionAccesLabo.year, newObject.ReceptionAccesLabo.month - 1, newObject.ReceptionAccesLabo.day).toDateString();
    }
    if (
      newObject.DateRetourOri !== null &&
      newObject.DateRetourOri !== this.valueNotToChangeLibelle
    ) {
      newObject.DateRetourOri = `${newObject.DateRetourOri.year}-${
        newObject.DateRetourOri.month
      }-${newObject.DateRetourOri.day}T00:00:00`;
    }
    if (
      newObject.RetourOriDernierDelai !== null &&
      newObject.RetourOriDernierDelai !== this.valueNotToChangeLibelle
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
    if (this.newObject.Deadline === null) {
      console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
      this.changedValues['isarchived'] = 1;
      this.changedValues['Deadline'] = null;
    } else {
      console.log('this.newObject.Deadline ===================================> ', this.newObject.Deadline);
      this.changedValues['isarchived'] = 0;
      alert('remplir une deadline');
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
}
