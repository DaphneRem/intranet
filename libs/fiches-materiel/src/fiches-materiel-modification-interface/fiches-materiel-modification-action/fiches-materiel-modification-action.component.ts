import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

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
    private annexElementsService: AnnexElementsService,
    private qualiteService: QualiteService,
    private versionService: VersionService,
    private location: Location
  ) {}

  ngOnInit() {
    console.log(this.newObject);
    console.log(this.allFichesMateriel);
    console.log(this.annexElementsFicheMateriel);
  }

  modifFichesMateriel() {
    this.checkNewObjectModif();
  }

  goBack() {
    this.location.back();
  }

  changeQualiteFormat(id) {
    console.log(this.qualiteFicheMateriel);
    this.qualiteToPost = [];
    this.qualiteToUpdate = [];

    let qualiteIdToUpdateIsValid = [];
    let qualiteIdToUpdateIsInvalid = [];
    let numberIdQualiteIsValid = [];
    let numberIdQualiteIsInvalid = [];

    this.qualitePresent.map(item => {
      console.log(item);
      if (item.IsValid) {
        qualiteIdToUpdateIsValid.push(item.idLibQualiteSup);
        numberIdQualiteIsValid.push(item.IdMat_Qualite);
        console.log(numberIdQualiteIsValid);
      } else {
        qualiteIdToUpdateIsInvalid.push(item.idLibQualiteSup);
        numberIdQualiteIsInvalid.push(item.IdMat_Qualite);
        console.log(numberIdQualiteIsInvalid);
      }
    });
            let coco = [];

    console.log('isValid = ' + qualiteIdToUpdateIsValid);
    console.log('isInvalid = ' + qualiteIdToUpdateIsInvalid);
    if (this.qualiteFicheMateriel.length > 0) {
      console.log('qualiteFicheMat.length > 0');
      this.qualiteFicheMateriel.forEach(item => {
        for (let i = 0; i < qualiteIdToUpdateIsValid.length; i++) {
          console.log(qualiteIdToUpdateIsValid[i]);
          if (item.Code === qualiteIdToUpdateIsValid[i]) {
            coco.push(item.Code);
          };
          if (i === (qualiteIdToUpdateIsValid.length - 1)) {
              console.log(coco.includes(qualiteIdToUpdateIsValid[i]));
              if (!coco.includes(qualiteIdToUpdateIsValid[i])) {
                console.log('notInclude');
                console.log(qualiteIdToUpdateIsValid[i]);
                this.qualiteToUpdate.push({
                  IdFicheMateriel: id,
                  IdMat_Qualite: numberIdQualiteIsValid[i],
                  idLibQualiteSup: qualiteIdToUpdateIsValid[i],
                  IsValid: false
                });
                console.log(this.qualiteToUpdate);
              }
            }
        }
        console.log(coco);
        // for (let i = 0; i < qualiteIdToUpdateIsValid.length; i++) {
        //   if (!coco.includes(qualiteIdToUpdateIsValid[i])) {
        //     console.log('notInclude');
        //     console.log(qualiteIdToUpdateIsValid[i]);
        //     this.qualiteToUpdate.push({
        //       IdFicheMateriel: id,
        //       IdMat_Qualite: numberIdQualiteIsValid[i],
        //       idLibQualiteSup: qualiteIdToUpdateIsValid[i],
        //       IsValid: false
        //     });
        //     console.log(this.qualiteToUpdate);
        //   }
        // }
        if (!qualiteIdToUpdateIsValid.includes(item.Code) && !qualiteIdToUpdateIsInvalid.includes(item.Code)) {
          console.log('push to post isValid = true');
          this.qualiteToPost.push({
            IdFicheMateriel: id,
            idLibQualiteSup: item.Code,
            IsValid: true
          });
        // } else if (!qualiteIdToUpdateIsValid.includes(item.Code) && qualiteIdToUpdateIsValid.length > 0) {
        //   console.log('push to patch isValid = false');
        //   let index = qualiteIdToUpdateIsValid.indexOf(item.Code);
        //   console.log(numberIdQualiteIsValid);
        //   console.log(index);
        //   this.qualiteToUpdate.push({
        //     IdFicheMateriel: id,
        //     IdMat_Qualite: numberIdQualiteIsValid[index],
        //     idLibQualiteSup: item.Code,
        //     IsValid: false
        //   });
        } else if (qualiteIdToUpdateIsInvalid.includes(item.Code) && qualiteIdToUpdateIsInvalid.length > 0) {
          // les qualites Invalid apparaissent pas dans la selection donc patch pour les rendre true
          console.log('push to patch isValid = true');
          let index = qualiteIdToUpdateIsInvalid.indexOf(item.Code);
          this.qualiteToUpdate.push({
            IdFicheMateriel: id,
            IdMat_Qualite: numberIdQualiteIsInvalid[index],
            idLibQualiteSup: item.Code,
            IsValid: true
          });
        }
        // if (this.qualitePresent.length > 0) {
        //   console.log('qualite presente : ');
        //   console.log(this.qualitePresent);
        //   this.qualitePresent.forEach(e => {
        //     if (e.idLibQualiteSup === item.Code) {
        //       e.IsValid = true;
        //       this.qualiteToUpdate.push(e);
        //     } else {
        //       e.IsValid = false;
        //       this.qualiteToUpdate.push(e);
        //     }
        //   });
        //   this.qualiteToPost.push({
        //     IdFicheMateriel: id,
        //     idLibQualiteSup: item.Code,
        //     LibQualiteSup: null,
        //     IsValid: true
        //   });
        // }

      });
    } else {
      this.qualitePresent.map(item  => {
        this.qualiteToUpdate.push({
          IdFicheMateriel: id,
          IdMat_Qualite: item.IdMat_Qualite,
          idLibQualiteSup: item.idLibQualiteSup,
          IsValid: false
        });
      });
    }
            console.log(this.qualiteToUpdate);
            console.log(this.qualiteToPost);
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
    if ((newObject.RetourOriDernierDelai !== null) && (newObject.RetourOriDernierDelai !== this.valueNotToChangeLibelle)) {
      newObject.RetourOriDernierDelai = `${newObject.RetourOriDernierDelai.year}-${newObject.RetourOriDernierDelai.month}-${newObject.RetourOriDernierDelai.day}T00:00:00`;
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
        if (this.newObject.Fiche_Mat_Libstatut.IdLibstatut !== this.newObject.IdLibstatut) {
          this.newObject.Fiche_Mat_Libstatut = null;
        }
        this.resetDateFormat(this.newObject);
        // this.updateQualityFicheMateriel(id);
        // this.updateVersionFicheMateriel(id);
        this.updatePutFicheMateriel(this.newObject);
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
    console.log(e);
    delete e.Fiche_Mat_LibEtape;
    delete e.Fiche_Mat_Qualite;
    delete e.Fiche_Mat_Version;
    // delete e.Fiche_Mat_ElementsAnnexes;
    this.fichesMaterielService.updateFicheMateriel([e]).subscribe(data => {
      if (data) {

        this.goBack();
      } else {
        console.log('error');
        console.log(data);
      }
      console.log(data);
    });

    // -------------------------->>>>>>>>>>>>>>>>>>>> Résoudre problème
          //   this.annexElementsService
          // .putAnnexElementsFicheMateriel(this.annexElementsFicheMateriel)
          // .subscribe(annexesElements => {
          //   console.log(annexesElements);
          //   this.goBack();
          // });
  }

  checkNewObjectModif() {
    if (this.selectionType === 'one') {
      this.getFicheMaterielOriginal(this.newObject.IdFicheMateriel);
    } else {
      this.checkChanges(this.allIdSelectedFichesMateriel);
    }
  }

  checkChanges(allId) { // CALL IF SELECTION TYPE IS 'MULTI'
    // let changedValues = {};
    console.log(allId);
    this.resetDateFormat(this.newObject);
    for (let key in this.newObject) {
      if (this.newObject[key] !== this.valueNotToChangeLibelle) {
        if (typeof this.newObject[key] !== 'object') { // IF value is Object
          this.changedValues[key] = this.newObject[key];
          console.log(this.changedValues);
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
