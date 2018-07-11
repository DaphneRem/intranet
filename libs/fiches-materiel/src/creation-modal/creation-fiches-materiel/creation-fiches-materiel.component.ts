import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NewFicheMateriel } from '../creative-form-fiches-materiel/new-fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';
import { FicheMaterielCreation } from '../../models/fiche-materiel-creation';

@Component({
  selector: 'creation-fiches-materiel',
  templateUrl: './creation-fiches-materiel.component.html',
  styleUrls: ['./creation-fiches-materiel.component.scss'],
  providers: [FichesMaterielService]
})
export class CreationFichesMaterielComponent implements OnInit {
  @Input() oeuvresSimple;
  @Input() oeuvreWithGaps;
  @Input() detailsFicheAchat;

  @Output() confirmCreation = new EventEmitter();

  public fichesMaterielOeuvresSimple: any;
  public fichesMaterielOeuvresWithEps: any;
  public arrayGaps;
  public arrayFinal: FicheMaterielCreation[] = [];
  public fichesMaterielCreated = [];
  public creationState: Boolean = true;

  constructor(private fichesMaterielService: FichesMaterielService) {}

  ngOnInit() {
    console.log(this.oeuvresSimple);
    console.log(this.oeuvreWithGaps);
  }

  createFichesMateriel(newFicheMateriel) {
    console.log(newFicheMateriel);
    this.fichesMaterielService
      .postFicheMateriel(newFicheMateriel)
      .subscribe((ficheMateriel) =>
        this.fichesMaterielCreated.push(ficheMateriel)
      );
  }

  create() {
    this.confirmCreation.emit(this.creationState);
  }

  // Si date début droits >  2 mois
  // 2 mois avant début des doits
  // Si date début < 2 mois ou si non existante
  // Date du jour
  deadlineCalcul(oeuvre) {
    // console.log(oeuvre.debut_des_droits);
    if (
      oeuvre.debut_des_droits === null ||
      oeuvre.debut_des_droits === undefined
    ) {
      return new Date();
    }
  }

  displayArrayFinal() {
    this.displayFichesMaterielOeuvresSimple();
    this.displayFichesMaterielOeuvresWithEps();
    this.arrayFinal = [
      ...this.fichesMaterielOeuvresSimple,
      ...this.fichesMaterielOeuvresWithEps
    ];
    console.log(this.arrayFinal);
    this.createFichesMateriel(this.arrayFinal[0]);
  }

  // create model fiches materiel for films (oeuvresSimple)
  displayFichesMaterielOeuvresSimple() {
    this.fichesMaterielOeuvresSimple = [];
    this.oeuvresSimple.forEach(oeuvre => {
      this.fichesMaterielOeuvresSimple.push(
        new NewFicheMateriel({
          IdFicheAchat: this.detailsFicheAchat.id_fiche,
          IdFicheDetail: this.detailsFicheAchat.id_fiche_det,
          Deadline: this.deadlineCalcul(this.detailsFicheAchat), // calcul automatique
          NumEpisodeProd: 1, // calcul automatique !!!!!
          NumEpisodeAB: 1, // calcul automatique !!!!!!
          TitreEpisodeVF: oeuvre.titre_vf, // récupéré de la FA
          TitreEpisodeVO: oeuvre.titre_vo, // récupéré de la FA
          IdSupport: '',
          NumProgram: '',
          NumEpisode: 1, // calcul automatique : erreur
          DateCreation: new Date()
        })
      );
    });
    console.log(this.fichesMaterielOeuvresSimple);
  }

  displayFichesMaterielOeuvresWithEps() {
    console.log(this.detailsFicheAchat);
    this.fichesMaterielOeuvresWithEps = [];
    this.oeuvreWithGaps.forEach(oeuvre => {
      this.checkAllNumbers(oeuvre, oeuvre.gaps);
      for (let i = 0; i < oeuvre.numFichesMateriel.length; i++) {
        console.log(oeuvre.numFichesMateriel[i]);
        this.fichesMaterielOeuvresWithEps.push(
          new NewFicheMateriel({
            IdFicheAchat: oeuvre.id_fiche,
            IdFicheDetail: oeuvre.id_fiche_det,
            Deadline: this.deadlineCalcul(this.detailsFicheAchat), // calcul automatique
            NumEpisodeProd: oeuvre.numFichesMateriel[i], // calcul automatique !!!!!
            NumEpisodeAB: oeuvre.numFichesMateriel[i], // calcul automatique !!!!!!
            TitreEpisodeVF: oeuvre.titre_vf, // récupéré de la FA
            TitreEpisodeVO: oeuvre.titre_vo, // récupéré de la FA
            IdSupport: '',
            NumProgram: '',
            NumEpisode: oeuvre.numFichesMateriel[i], // calcul automatique : erreur
            DateCreation: new Date()
          })
        );
      }
      console.log(oeuvre);
    });
    console.log(this.fichesMaterielOeuvresWithEps);
  }

  /** DO ARRAY WITH ALL GAPS **/
  checkAllNumbers(oeuvre, gaps) {
    oeuvre.numFichesMateriel = [];
    this.arrayGaps = gaps.map(e => {
      return e.last - e.first + 1;
    });
    gaps.map(e => {
      for (let i = Number(e.first); i <= Number(e.last); i++) {
        oeuvre.numFichesMateriel.push(i);
      }
    });
  }
}

