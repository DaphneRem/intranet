import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// service import
import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FichesAchatService } from '@ab/fiches-achat';

// models import
import { FicheMaterielCreation } from '../../models/fiche-materiel-creation';
import { NewFicheMateriel } from '../../models/new-fiche-materiel';
import { FicheAchat } from '@ab/fiches-achat/src/models/fiche-achat';

@Component({
  selector: 'creation-fiches-materiel',
  templateUrl: './creation-fiches-materiel.component.html',
  styleUrls: ['./creation-fiches-materiel.component.scss'],
  providers: [FichesMaterielService, FichesAchatService]
})
export class CreationFichesMaterielComponent implements OnInit {
  @Input() detailsFicheAchat;
  @Input() oeuvreWithGaps;
  @Input() step;
  @Input() myFicheAchat;

  @Output() confirmCreation = new EventEmitter();

  public fichesMaterielCreated: FicheMaterielCreation[] = [];
  public fichesMateriel: any;
  public creationState: Boolean = false;

  // dealine calcul
  public today;
  public disabled: boolean;

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private fichesAchatService: FichesAchatService
  ) {}

  ngOnInit() {
    console.log(this.oeuvreWithGaps);
    console.log('detail FA : ');
    console.log(this.detailsFicheAchat);
  }

  /** POST FICHES MATERIEL **/
  createFichesMateriel(newFicheMateriel) {
    this.fichesMaterielService.postFicheMateriel(newFicheMateriel).subscribe(
      res => {
        console.log(res);
        this.creationState = true;
        this.create(this.creationState);
        this.disabled = false;
      },
      error => {
        this.creationState = false;
        console.log(' could not be created');
        this.create(this.creationState);
      }
    );
  }

  /** DELETE FICHES MATERIEL **/
  deleteOldFichesMateriel(newFicheMateriel, idFicheAchatDetail) {
    console.log(newFicheMateriel[0]);
    this.fichesMaterielService
      .deleteFicheMaterielByFicheAchatDetail(idFicheAchatDetail)
      .subscribe(
        res => {
          this.createFichesMateriel(newFicheMateriel);
                  console.log(this.myFicheAchat);

          // this.updateFicheAchatDetailImport(
          //   newFicheMateriel[0].IdFicheDetail,
          //   this.detailsFicheAchat[0]
          // );
          this.updateFicheAchatGlobalImport();
          console.log('delete ok ' + idFicheAchatDetail);
        },
        error => {
          this.creationState = false;
          console.log(' could not be created');
          this.create(this.creationState);
        }
      );
  }

  /** UPDATE FICHE ACHAT **/
  updateFicheAchatDetailImport(idFicheAchatDetail, detailsFicheAchat) {
    detailsFicheAchat.Import_FM = 1;
    console.log(detailsFicheAchat);
    console.log('update detail FA');

    this.fichesAchatService
      .patchMaterielImportFicheAchatDetail(idFicheAchatDetail, 1)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.error(error);
        }
    );
    // this.fichesAchatService
    //   .putFicheAchatDetail(detailsFicheAchat.id_fiche_det, [detailsFicheAchat])
    //   .subscribe(data => console.log(data));
  }

  updateFicheAchatGlobalImport() {
    console.log('update global FA');
    this.myFicheAchat.Import_FM = 1;
    console.log('myFicheAchat to Update :');
    console.log(this.myFicheAchat);
    this.fichesAchatService
      .putFicheAchatGlobal(this.myFicheAchat.id_fiche, this.myFicheAchat)
      .subscribe(data => {
        console.log(data);
      }, error => {
        console.error('update PUT error');
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

  /** CHANGE OEUVRE WITH GAPS TO FICHES MATERIEL OEUVRE WITH EPS ARRAY **/
  displayFichesMateriel() {
    this.oeuvreWithGaps.forEach(oeuvre => {
      this.fichesMateriel = [];
      this.checkAllNumbers(oeuvre, oeuvre.gaps);
      for (let i = 0; i < oeuvre.numFichesMateriel.length; i++) {
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
            NumProgram: '',
            NumEpisode: oeuvre.numFichesMateriel[i], // calcul automatique : erreur
            DateCreation: new Date().toJSON().slice(0, 19)
          })
        );
      }
      console.log(this.fichesMateriel);
      this.deleteOldFichesMateriel(this.fichesMateriel, oeuvre.id_fiche_det);
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
    const todayDate = new Date(todayNewFormatDate);
    const diffTimezone = todayDate.getTimezoneOffset(); // get difference with local hour
    const timestampUtcTodayTime = todayDate.setMinutes(
      todayDate.getMinutes() - diffTimezone
    );
    this.today = new Date(
      todayDate.setMinutes(todayDate.getMinutes() - diffTimezone)
    )
      .toJSON()
      .slice(0, 19);
    console.log(this.today);
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
        return new Date(twoMonthBefore).toJSON().slice(0, 19);
      }
    }
  }
}

