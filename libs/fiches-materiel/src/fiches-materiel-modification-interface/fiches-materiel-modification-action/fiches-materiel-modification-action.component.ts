import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FicheMateriel } from '../../models/fiche-materiel';

import { QualiteService } from '../../services/qualite.service';
import { VersionService } from '../../services/version.service';

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
  @Input() newObject;
  @Input() allFichesMateriel;
  @Input() selectionType;
  @Input() multiOeuvre;
  @Input() multiFichesAchat;
  @Input() initialFichesMateriel;
  @Input() valueNotToChangeLibelle;
  @Input() allIdSelectedFichesMateriel;
  @Input() qualiteFicheMateriel;
  @Input() qualitePresent;
  @Input() annexElementsFicheMateriel;
  @Input() versionFicheMateriel;
  @Input() versionPresent;

  public myFicheMateriel;
  public changedValues = {};
  public multiDataToUpdate;
  public qualiteToUpdate = [];
  public qualiteToPost = [];

  public versionToUpdate: any = [];
  public versionToPost: any = [];

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private qualiteService: QualiteService,
    private versionService: VersionService,
    private location: Location
  ) {}

  ngOnInit() {
    console.log(this.newObject);
    console.log(this.allFichesMateriel);
  }

  modifFichesMateriel() {
    this.checkNewObjectModif();
  }

  goBack() {
    this.location.back();
  }

  changeQualiteFormat(id) {
    this.qualiteToPost = [];
    this.qualiteToUpdate = [];
    this.qualiteFicheMateriel.forEach((item) => {
      if (this.qualitePresent.length > 0) {
        console.log('qualite presente : ');
        console.log(this.qualitePresent);
        this.qualitePresent.forEach(e => {
          if (e.idLibQualiteSup === item.Code) {
            e.IsValid = true;
            this.qualiteToUpdate.push(e);
          } else {
            e.IsValid = false;
            this.qualiteToUpdate.push(e);
          }
        });
        this.qualiteToPost.push({
          IdFicheMateriel: id,
          idLibQualiteSup: item.Code,
          LibQualiteSup: null,
          IsValid: true
        });
      }
      console.log(this.qualiteToUpdate);
      console.log(this.qualiteToPost);
    });
  }

  changeVersionFormat(id) {
    console.log(this.versionPresent);
    this.versionFicheMateriel.map(item => {
      if (this.versionPresent.length > 0) {
        this.versionPresent.map(e => {
          if (e.IdFicheAch_Lib_Versions === item.id_version) {
            e.Isvalid = true;
            this.versionToUpdate.push(e);
          } else {
            e.Isvalid = false;
            this.versionToUpdate.push(e);
          }
        });
      }
      this.versionToPost.push({
        IdFicheMateriel: id,
        IdFicheAch_Lib_Versions: item.id_version,
        Isvalid: true
      });
    });
  }

  resetDateFormat(newObject) {
    console.log(newObject.Deadline);
    if ((newObject.Deadline !== null) && (newObject.Deadline !== this.valueNotToChangeLibelle)) {
      newObject.Deadline = `${newObject.Deadline.year}-${newObject.Deadline.month}-${newObject.Deadline.day}T00:00:00`;
    }
    if ((newObject.DateLivraison !== null) && (newObject.DateLivraison !== this.valueNotToChangeLibelle)) {
      newObject.DateLivraison = `${newObject.DateLivraison.year}-${newObject.DateLivraison.month}-${newObject.DateLivraison.day}T00:00:00`;
    }
    if ((newObject.DatePremiereDiff !== null) && (newObject.DatePremiereDiff !== this.valueNotToChangeLibelle)) {
      newObject.DatePremiereDiff = `${newObject.DatePremiereDiff.year}-${newObject.DatePremiereDiff.month}-${newObject.DatePremiereDiff.day}T00:00:00`;
    }
    if ((newObject.DateAcceptation !== null) && (newObject.DateAcceptation !== this.valueNotToChangeLibelle)) {
      newObject.DateAcceptation = `${newObject.DateAcceptation.year}-${newObject.DateAcceptation.month}-${newObject.DateAcceptation.day}T00:00:00`;
    }
    if ((newObject.ReceptionAccesLabo !== null) && (newObject.ReceptionAccesLabo !== this.valueNotToChangeLibelle)) {
      newObject.ReceptionAccesLabo = `${newObject.ReceptionAccesLabo.year}-${newObject.ReceptionAccesLabo.month}-${newObject.ReceptionAccesLabo.day}T00:00:00`;
    }
    if ((newObject.DateRetourOri !== null) && (newObject.DateRetourOri !== this.valueNotToChangeLibelle)) {
      newObject.DateRetourOri = `${newObject.DateRetourOri.year}-${newObject.DateRetourOri.month}-${newObject.DateRetourOri.day}T00:00:00`;
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
        if (this.newObject.Fiche_Mat_LibEtape.IdLibEtape !== this.newObject.IdLibEtape) {
          this.newObject.Fiche_Mat_LibEtape = null;
        }
        if (this.newObject.Fiche_Mat_LibEtape.IdLibstatut !== this.newObject.IdLibstatut) {
          this.newObject.Fiche_Mat_Libstatut = null;
        }
        this.resetDateFormat(this.newObject);
        this.updateQualityFicheMateriel(id);
        // this.updateVersionFicheMateriel(id);
        // this.updatePutFicheMateriel(this.newObject);
      }
    });
  }

  updateQualityFicheMateriel(id) {
    this.changeQualiteFormat(id);
    console.log('quality to update = ' + this.qualiteToUpdate);
    console.log('quality to post = ' + this.qualiteToPost);
    if (this.qualiteToPost.length) {
      this.qualiteService.postQualite(this.qualiteToPost).subscribe(data => {
        console.log('post');
        console.log(data);
      });
    }
    if (this.qualiteToUpdate.length) {
      this.qualiteService.patchQualite(this.qualiteToUpdate).subscribe(data => {
        console.log('patch');
        console.log(data);
      });
    }
  }

  updateVersionFicheMateriel(id) {
    this.changeVersionFormat(id);
    console.log(this.versionToUpdate);
    this.versionService.postVersion(this.versionToPost).subscribe(data => {
      console.log(data);
    });
    this.versionService.patchVersion(this.versionToUpdate).subscribe(data => {
      console.log(data);
    });
  }

  updatePutFicheMateriel(e) {
    this.fichesMaterielService.updateFicheMateriel([e]).subscribe(data => {
      if (data) {
        this.goBack();
      } else {
        console.log('error');
        console.log(data);
      }
      console.log(data);
    });
  }

  checkNewObjectModif() {
    if (this.selectionType === 'one') {
      this.getFicheMaterielOriginal(this.newObject.IdFicheMateriel);
    } else {
      this.checkChanges(this.allIdSelectedFichesMateriel);
    }
  }

  checkChanges(allId) {
    // let changedValues = {};
    console.log(allId);
    this.resetDateFormat(this.newObject);
    for (let key in this.newObject) {
      if (this.newObject[key] !== this.valueNotToChangeLibelle) {
        if (typeof this.newObject[key] !== 'object') {
          this.changedValues[key] = this.newObject[key];
          console.log(this.changedValues);
        } else if (
          typeof this.newObject[key] === 'object' &&
          !Array.isArray(this.newObject[key])
        ) {
          for (let i in this.newObject[key]) {
            if (this.newObject[key][i] !== this.valueNotToChangeLibelle) {
              this.changedValues[key] = this.newObject[key];
              console.log(this.changedValues);
            }
          }
        } else if (
          typeof this.newObject[key] === 'object' &&
          Array.isArray(this.newObject[key])
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
      }
    }
    this.displaymultiDataToUpdate(allId);
  }

  displaymultiDataToUpdate(allId) {
    this.multiDataToUpdate = allId.map(item => {
      item = Object.assign({}, item, this.changedValues);
      return item;
    });
    console.log(this.multiDataToUpdate);
    // this.multiDataToUpdate.map(item => { // patch sur chaque fiche Matériel
    //   this.patchFichesMateriel([item]);
    // });
    this.patchFichesMateriel(this.multiDataToUpdate); // patch sur tableau de fiches Matériel (partielles)
  }

  patchFichesMateriel(fichesMateriel) {
    this.fichesMaterielService
      .patchFicheMateriel(fichesMateriel)
      .subscribe(data => {
        if (data) {
          this.goBack();
        }
        console.log(data);
      });
  }
}
