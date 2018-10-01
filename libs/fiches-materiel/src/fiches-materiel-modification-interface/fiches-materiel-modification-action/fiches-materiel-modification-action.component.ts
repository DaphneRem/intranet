import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FicheMateriel } from '../../models/fiche-materiel';

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

  public myFicheMateriel;
  public changedValues = {};
  public multiDataToUpdate;

  constructor(
    private fichesMaterielService: FichesMaterielService,
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
        this.resetDateFormat(this.newObject);
        this.updatePutFicheMateriel(this.newObject);
      }
    });
  }

  updatePutFicheMateriel(e) {
    this.fichesMaterielService.updateFicheMateriel([e]).subscribe(data => {
      if (data) {
        this.goBack();
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
