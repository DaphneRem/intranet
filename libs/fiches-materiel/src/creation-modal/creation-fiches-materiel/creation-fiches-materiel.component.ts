import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
// import { App } from '../../../../../apps/fiches-materiel/src/app/+state/app.interfaces';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// service import
import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FichesAchatService } from '@ab/fiches-achat';

// models import
import { FicheMaterielCreation } from '../../models/fiche-materiel-creation';
import { NewFicheMateriel } from '../../models/new-fiche-materiel';
import { FicheAchat } from '@ab/fiches-achat/src/models/fiche-achat';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Component({
  selector: 'creation-fiches-materiel',
  templateUrl: './creation-fiches-materiel.component.html',
  styleUrls: ['./creation-fiches-materiel.component.scss'],
  providers: [
    FichesMaterielService,
    FichesAchatService,
    Store
]
})
export class CreationFichesMaterielComponent implements OnInit, OnDestroy {
  @Input() detailsFicheAchat;
  @Input() oeuvreWithGaps;
  @Input() step;
  @Input() myFicheAchat;

  @Output() confirmCreation = new EventEmitter();
  @Output() errorInfoFmCreation = new EventEmitter();

  private onDestroy$: Subject<any> = new Subject();


  public fichesMaterielCreated: FicheMaterielCreation[] = [];
  public fichesMateriel: any;
  public creationState: Boolean = false;
  public retourOri: number;
  public user;
  public errorCreationInfoFm = [];
  public createdOeuvre = 0;
  public creationProcessIsOk = true;
  // dealine calcul
  public today;
  public disabled: boolean;

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private fichesAchatService: FichesAchatService,
    private store: Store<Object>
  ) {}

  ngOnInit() {
    this.storeAppSubscription();
    console.log(this.oeuvreWithGaps);
    console.log('detail FA : ');
    console.log(this.detailsFicheAchat);
    console.log(this.myFicheAchat);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  storeAppSubscription() {
    this.store.pipe(takeUntil(this.onDestroy$)).subscribe(data => {
        this.user = data['app'].user.shortUserName;
        console.log(this.user);
    });
  }

  /** POST FICHES MATERIEL **/
  createFichesMateriel(newFicheMateriel, oeuvre, IdFicheDetail, ficheAchatDetail) {
    this.fichesMaterielService
      .postFicheMateriel(newFicheMateriel)
      .then(
        (res) => {
          console.log('newFM POST => ', res);
         // console.log("res['status'] => ", res.status);
//          this.creationState = true;
  //        this.create(this.creationState);
          if (this.creationProcessIsOk) {
            this.disabled = false;
            // this.createdOeuvre++;
            this.updateFicheAchatDetailImport(
              IdFicheDetail,
              ficheAchatDetail
            );
          }
        },
        error => {
          console.error('error => ', error);
          console.log('oeuvre => ', oeuvre);
          console.log('ficheAchatDetail => ', ficheAchatDetail);
          this.creationProcessIsOk = false;
          this.creationState = false;
          this.create(this.creationState);
          let errorFM =
            "Une erreur s'est produite, la création des fiches matériel de l'oeuvre "
            + "'" + ficheAchatDetail.titre_vf + "' a achouée. L'action' a donc été interrompue."
            + " Message d'erreur : "
            + error
            + ". Merci de recommancer ou de contacter le support si l'erreur persiste."
          this.errorInfoFmCreation.emit(errorFM);
        }
      );
  }

  /** DELETE FICHES MATERIEL **/
  deleteOldFichesMateriel(newFicheMateriel, idFicheAchatDetail, index, lastIndex) {
    console.log(newFicheMateriel);
    console.log(this.detailsFicheAchat);
    let ficheMateriel;
    if (newFicheMateriel.length > 0) {
        ficheMateriel = newFicheMateriel[0];
    } else {
      ficheMateriel = newFicheMateriel;
    }
    console.log(ficheMateriel);
    let ficheAchatDetail;
    this.detailsFicheAchat.map(item => {
      if (item.id_fiche_det === ficheMateriel.IdFicheDetail) {
        ficheAchatDetail = item;
      }
    });
    this.fichesMaterielService
      .deleteFicheMaterielByFicheAchatDetail(idFicheAchatDetail)
      .then(
        res => {
          if (this.creationProcessIsOk) {
            this.createFichesMateriel(
              newFicheMateriel,
              this.detailsFicheAchat,
              ficheMateriel.IdFicheDetail,
              ficheAchatDetail);
          } else {
            this.creationProcessIsOk = false;
            this.creationState = false;
            this.create(this.creationState);
          }
//          this.updateFicheAchatDetailImport(
//            ficheMateriel.IdFicheDetail,
//            ficheAchatDetail
//          );
//          if (index === lastIndex) {
//            this.updateFicheAchatGlobalImport();
//          }

          // this.updateFicheAchatGlobalImport();

        },
        error => {
          console.error('error => ', error);
          console.log('ficheAchatDetail => ', ficheAchatDetail);
          this.creationProcessIsOk = false;
          this.creationState = false;
          this.create(this.creationState);
          let errorFM =
            "Une erreur s'est produite, la suppression des anciennes fiches matériel associées à l'oeuvre "
            + "'" + ficheAchatDetail.titre_vf + "' a achouée. L'action a donc été interrompue."
            + " Message d'erreur : "
            + error
            + ". Merci de recommancer ou de contacter le support si l'erreur persiste."
          this.errorInfoFmCreation.emit(errorFM);
        }
      );
  }

  /** UPDATE FICHE ACHAT **/
  updateFicheAchatDetailImport(idFicheAchatDetail, detailsFicheAchat) {
    detailsFicheAchat.Import_FM = 1;
    console.log(detailsFicheAchat);
    console.log('update detail FA');
    console.log(detailsFicheAchat.id_fiche_det);
    // this.fichesAchatService
    //   .patchMaterielImportFicheAchatDetail(idFicheAchatDetail, 1)
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //     },
    //     error => {
    //       console.error(error);
    //     }
    // );
    this.fichesAchatService
      .putFicheAchatDetail(detailsFicheAchat.id_fiche_det, detailsFicheAchat)
      .then(data => {
        this.createdOeuvre++;
        console.log(data);
        console.log('this.oeuvreWithGaps.length - 1 => ', this.oeuvreWithGaps.length);
        console.log('this.createdOeuvre => ', this.createdOeuvre);
        if (this.createdOeuvre === this.oeuvreWithGaps.length) {
          if (this.creationProcessIsOk) {
            this.updateFicheAchatGlobalImport();
          } else {
            this.creationProcessIsOk = false;
            this.creationState = false;
            this.create(this.creationState);
          }
        }
      }, error => {
        console.error('error => ', error);
        console.log('detailsFicheAchat => ', detailsFicheAchat);
        this.creationProcessIsOk = false;
        this.creationState = false;
        this.create(this.creationState);
        let errorFM =
          "Une erreur s'est produite, la mise à jour de l'oeuvre "
          + "'" + detailsFicheAchat.titre_vf + "' a achouée. L'action a donc été interrompue."
          + " Message d'erreur : "
          + error
          + ". Merci de recommancer ou de contacter le support si l'erreur persiste."
        this.errorInfoFmCreation.emit(errorFM);
      });
  }

  updateFicheAchatGlobalImport() {
    console.log('old fiche Achat :');
    console.log(this.myFicheAchat);
    console.log('update global FA');
    this.myFicheAchat.Import_FM = 1;
    console.log('myFicheAchat to Update :');
    console.log(this.myFicheAchat);
    this.fichesAchatService
      .putFicheAchatGlobal(this.myFicheAchat.id_fiche, this.myFicheAchat)
      .then(data => {
        console.log(data);
        console.log('creationState = true');
        if (this.creationProcessIsOk) {
          this.creationState = true;
          this.create(this.creationState);
          this.creationProcessIsOk = true;
        } else {
          this.creationProcessIsOk = false;
          this.creationState = false;
          this.create(this.creationState);
        }
      }, error => {
        console.error('error => ', error);
        this.creationProcessIsOk = false;
        this.creationState = false;
        this.create(this.creationState);
        let errorFM =
          "Une erreur s'est produite, la mise à jour de la fiche achat "
          + "'" + this.myFicheAchat.numero_fiche + "' a achouée. L'action a donc été interrompue."
          + " Message d'erreur : "
          + error
          + ". Merci de recommancer ou de contacter le support si l'erreur persiste."
        this.errorInfoFmCreation.emit(errorFM);
      });
  }

  /** EMIT CREATION STATE EVENT**/
  create(state) {
    this.confirmCreation.emit(state);
  }

  /** CALL CREATION FUNCTIONS FOR ALL OEUVRES ON CLICK **/
  createAllOeuvres() {
    this.disabled = true;
    this.displayFichesMateriel();
    // this.createFichesMateriel(this.fichesMateriel);
  }

  displayRetourOri(oeuvre) {
    if ( // if FA statut matériel : "acces labo", "materiel présent AB" ou "vendu"
      oeuvre.Code_statut_materiel === 2 ||
      oeuvre.Code_statut_materiel === 3 ||
      oeuvre.Code_statut_materiel === 4
    ) {
      return 2; // Retour ori : "Matériel AB"
    } else if (oeuvre.Code_statut_materiel === 1) { // if FA statut matériel : "prêté"
      return 1; // Retour ori : "A faire"
    } else {
      return 1; // Retour ori : "A faire"
    }
  }

  /** CHANGE OEUVRE WITH GAPS TO FICHES MATERIEL OEUVRE WITH EPS ARRAY **/
  displayFichesMateriel() {
    console.log('oeuvreWithGaps => ', this.oeuvreWithGaps);
    this.oeuvreWithGaps.forEach(oeuvre => {
      let oeuvreFicheDetail;
      let retourOriOeuvre;
      this.fichesMateriel = [];
      this.checkAllNumbers(oeuvre, oeuvre.gaps);
      console.log(oeuvre.numFichesMateriel);
      console.log('oeuvre => ', oeuvre);
      this.detailsFicheAchat.map(item => {
        if (item.id_fiche_det === oeuvre.id_fiche_det) {
          oeuvreFicheDetail = item;
          console.log('item fiche achat detail => ', oeuvreFicheDetail);
          retourOriOeuvre = this.displayRetourOri(oeuvreFicheDetail);
        }
      });
      for (let i = 0; i < oeuvre.numFichesMateriel.length; i++) {
        console.log(this.user);
  //       oeuvreFicheDetail.debut_des_droits = '2019-11-18T00:00:00';
  //       oeuvreFicheDetail.expiration_droits = '2022-11-18T00:00:00';
        this.fichesMateriel.push(
          new NewFicheMateriel({
            IdFicheAchat: oeuvre.id_fiche,
            IdFicheDetail: oeuvre.id_fiche_det,
            Deadline: this.deadlineCalcul(oeuvre), // calcul automatique
            NumEpisodeProd: oeuvre.numFichesMateriel[i], // calcul automatique
            NumEpisodeAB: oeuvre.numFichesMateriel[i], // calcul automatique
            TitreEpisodeVF: oeuvre.titre_vf, // récupéré de la FA
            TitreEpisodeVO: oeuvre.titre_vo, // récupéré de la FA
            IdSupport: '',
            NumProgram: oeuvreFicheDetail.numprogram,
            NumEpisode: oeuvre.numFichesMateriel[i], // calcul automatique : erreur
            DateCreation: new Date().toJSON().slice(0, 19),
            UserCreation: this.user,
            SuiviPar: this.user,
            RetourOri: retourOriOeuvre,
            duree_du_pret: oeuvreFicheDetail.duree_du_pret
          })
        );
      }
      console.log(this.fichesMateriel);
      let index = this.oeuvreWithGaps.indexOf(oeuvre);
      let lastIndex = this.oeuvreWithGaps.length - 1;
      console.log(index);
      console.log(lastIndex);
      if (this.creationProcessIsOk) {
        this.deleteOldFichesMateriel(this.fichesMateriel, oeuvre.id_fiche_det, index, lastIndex);
      }
    });
  }

  /** DO ARRAY WITH ALL EPISODES NUMBERS **/
  checkAllNumbers(oeuvre, gaps) {
    oeuvre.numFichesMateriel = [];
    gaps.map(gap => {
      for (let i = Number(gap.first); i <= Number(gap.last); i++) {
        oeuvre.numFichesMateriel.push(i);
      }
    });
  }

  /* CHECK FICHE MATERIEL DEADLINE */
  deadlineCalcul(oeuvre) {
    const todayNewFormatDate = new Date().toJSON().slice(0, 19);
    console.log('deadline : 1e date => ', todayNewFormatDate);
    const td = new Date();
    console.log('td => ', td.setHours(0, 0, 0));
    console.log('new date td => ', new Date(td).toJSON());
    const todayDate = new Date(todayNewFormatDate);
    console.log('deadline => ', todayDate);
    const diffTimezone = todayDate.getTimezoneOffset(); // get difference with local hour
    const timestampUtcTodayTime = todayDate.setMinutes(
      todayDate.getMinutes() - diffTimezone
    );
    this.today = new Date(
      todayDate.setMinutes(todayDate.getMinutes() - diffTimezone)
    )
      .toJSON()
      .slice(0, 19);
    console.log('this.today ==> ', this.today);
    let arrayToday = this.today.split('').splice(0, 11);
    this.today = `${arrayToday.join('')}00:00:00`;
    if (
      oeuvre.debut_des_droits === null ||
      oeuvre.debut_des_droits === undefined
    ) {
      return this.today;
    } else {
      // if oeuvre.debut_des_droits exist
      const oeuvreDate = new Date(oeuvre.debut_des_droits);
      const timestampOeuvre = oeuvreDate.getTime();
      const timestampTwoMonths = 5184000000;
      if (timestampOeuvre < timestampUtcTodayTime + timestampTwoMonths) {
        // check if oeuvre.debut_des_droits is already passed
        return this.today;
      } else {
        // if oeuvre.debut_des_droits is more than two months
        const twoMonthBefore = timestampOeuvre - timestampTwoMonths;
        console.log('deadline => ', new Date(twoMonthBefore).toJSON().slice(0, 19));
        return new Date(twoMonthBefore).toJSON().slice(0, 19);
      }
    }
  }
}

