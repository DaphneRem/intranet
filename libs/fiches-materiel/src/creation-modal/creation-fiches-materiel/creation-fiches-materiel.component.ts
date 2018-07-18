import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// service import
import { FichesMaterielService } from '../../services/fiches-materiel.service';

// models import
import { FicheMaterielCreation } from '../../models/fiche-materiel-creation';
import { NewFicheMateriel } from '../../models/new-fiche-materiel';

@Component({
  selector: 'creation-fiches-materiel',
  templateUrl: './creation-fiches-materiel.component.html',
  styleUrls: ['./creation-fiches-materiel.component.scss'],
  providers: [FichesMaterielService]
})
export class CreationFichesMaterielComponent implements OnInit {

  @Input() detailsFicheAchat;
  @Input() oeuvresSimple;
  @Input() oeuvreWithGaps;
  @Input() step;

  @Output() confirmCreation = new EventEmitter();

  public finalFichesMaterielToCreate: FicheMaterielCreation[] = [];
  public fichesMaterielCreated: FicheMaterielCreation[] = [];
  public fichesMaterielOeuvresSimple: any;
  public fichesMaterielOeuvresWithEps: any;
  public creationState: Boolean = false;

  // dealine calcul
  public today;
  public disabled: boolean;

  constructor( private fichesMaterielService: FichesMaterielService ) {}

  ngOnInit() {
  }

  /** POST FICHES MATERIEL **/
  createFichesMateriel(newFicheMateriel) {
    this.fichesMaterielCreated = [];
    newFicheMateriel.forEach((fiche) => {
      this.fichesMaterielService
        .postFicheMateriel(fiche)
        .subscribe(
          res => {
            this.fichesMaterielCreated.push(res);
            console.log('Fiches materiel created : ');
            console.log(this.fichesMaterielCreated);
            console.log(fiche.TitreEpisodeVF + ' was created');
            if ((newFicheMateriel.indexOf(fiche) === (newFicheMateriel.length - 1))) {
              this.creationState = true;
              this.create(this.creationState);
              this.disabled = false;
            }
          },
          error => {
            this.creationState = false;
            console.log(fiche.TitreEpisodeVF + ' could not be created');
            this.create(this.creationState);
        });
    });
  }

  /** EMIT CREATION STATE EVENT**/
  create(state) {
    this.confirmCreation.emit(state);
  }

  /** CALL CREATION FUNCTIONS FOR ONLY SIMPLE OEUVRE ON CLICK **/
  createOnlyOeuvresSimple() {
    this.disabled = true;
    this.finalFichesMaterielToCreate = [];
    this.displayFichesMaterielOeuvresSimple(this.detailsFicheAchat);
    this.finalFichesMaterielToCreate = [...this.fichesMaterielOeuvresSimple];
    this.createFichesMateriel(this.finalFichesMaterielToCreate);
  }


  /** CALL CREATION FUNCTIONS FOR ALL OEUVRES ON CLICK **/
  createAllOeuvres() {
    this.disabled = true;
    this.finalFichesMaterielToCreate = [];
    this.displayFichesMaterielOeuvresSimple(this.oeuvresSimple);
    this.displayFichesMaterielOeuvresWithEps();
    this.finalFichesMaterielToCreate = [
      ...this.fichesMaterielOeuvresSimple,
      ...this.fichesMaterielOeuvresWithEps
    ];
    this.createFichesMateriel(this.finalFichesMaterielToCreate);
  }

  /** CHANGE OEUVRE SIMPLE TO FICHES MATERIEL OEUVRE SIMPLE ARRAY **/
  displayFichesMaterielOeuvresSimple(oeuvresSimple) {
    this.fichesMaterielOeuvresSimple = [];
    oeuvresSimple.forEach(oeuvre => {
      this.fichesMaterielOeuvresSimple.push(
        new NewFicheMateriel({
          IdFicheAchat: this.detailsFicheAchat[this.detailsFicheAchat.indexOf(oeuvre)].id_fiche,
          IdFicheDetail: this.detailsFicheAchat[this.detailsFicheAchat.indexOf(oeuvre)].id_fiche_det,
          Deadline: this.deadlineCalcul(oeuvre), // calcul automatique
          NumEpisodeProd: 1, // calcul automatique !!!!!
          NumEpisodeAB: 1, // calcul automatique !!!!!!
          TitreEpisodeVF: oeuvre.titre_vf, // récupéré de la FA
          TitreEpisodeVO: oeuvre.titre_vo, // récupéré de la FA
          IdSupport: '',
          NumProgram: '',
          NumEpisode: 1, // calcul automatique : erreur
          DateCreation: new Date().toJSON().slice(0, 19)
        })
      );
    });
  }

  /** CHANGE OEUVRE WITH GAPS TO FICHES MATERIEL OEUVRE WITH EPS ARRAY **/
  displayFichesMaterielOeuvresWithEps() {
    this.fichesMaterielOeuvresWithEps = [];
    this.oeuvreWithGaps.forEach(oeuvre => {
      this.checkAllNumbers(oeuvre, oeuvre.gaps);
      for (let i = 0; i < oeuvre.numFichesMateriel.length; i++) {
        this.fichesMaterielOeuvresWithEps.push(
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
    this.today = new Date().toJSON().slice(0, 19); // même format que oeuvre.debut_des_droits
    if (oeuvre.debut_des_droits === null || oeuvre.debut_des_droits === undefined) {
      return this.today;
    } else {  // if oeuvre.debut_des_droits exist
      const todayDate = new Date(this.today);
      const oeuvreDate = new Date(oeuvre.debut_des_droits);
      const todayTime = todayDate.getTime();
      const oeuvreTime = oeuvreDate.getTime();
      const twoMonthsTime = 5184000000;
      if (oeuvreTime < (todayTime + twoMonthsTime)) { // check if oeuvre.debut_des_droits is already passed
        return this.today;
      } else { // if oeuvre.debut_des_droits is more than two months
        const twoMonthBefore = oeuvreTime - twoMonthsTime;
        return new Date(twoMonthBefore).toJSON().slice(0, 19);
      }
    }
  }
}

