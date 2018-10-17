import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'creative-form-fiches-materiel',
  templateUrl: './creative-form-fiches-materiel.component.html',
  styleUrls: [
    './creative-form-fiches-materiel.component.scss',
    '../../../../../node_modules/sweetalert2/src/sweetalert2.scss'
  ]
})
export class CreativeFormFichesMaterielComponent implements OnInit {
  @Input() step;
  @Input() detailsFicheAchat;
  @Input() myFicheAchat;

  @Output() initStep = new EventEmitter();

  public oeuvreWithGaps;
  public resetGaps = false;
  public arrayGaps: any;
  public totalGaps;
  public gapAdding = false;
  public noSameValue;
  public remainingEps: number;
  public arrayFirst = [];
  public arrayLast = [];
  public foundFirst;
  public foundLast;
  public gapInModif = [];
  public otherGapsInmodif = [];
  public allGapsValid;
  public creationState: boolean;
  public modifExist: Boolean = false;

  constructor( private router: Router ) {}

  ngOnInit() {
    this.initDefaultModels();
  }


  displayTypeFicheMateriel(oeuvre) {
    if (oeuvre.nombre_episodes === null) {
      return 'oneEpisode';
    } else {
      if (oeuvre.nombre_episodes === 1) {
        return 'oneEpisode';
      } else {
        return 'multiEpisode';
      }
    }
  }

  /******* Init default oeuvre Model ********/
  initDefaultModels() {
    this.oeuvreWithGaps = this.detailsFicheAchat.map(oeuvre => { 
      return {
        id_fiche: oeuvre.id_fiche,
        id_fiche_det: oeuvre.id_fiche_det,
        nombre_episodes:  oeuvre.nombre_episodes !== null ? oeuvre.nombre_episodes : 1,
        titre_vf: oeuvre.titre_vf,
        titre_vo: oeuvre.titre_vo,
        typeficheMateriel: this.displayTypeFicheMateriel(oeuvre),
        debut_des_droits: oeuvre.debut_des_droits,
        index: this.detailsFicheAchat.indexOf(oeuvre) + 1,
        warningExist: false,
        numFichesMateriel: [],
        gaps: [
          {
            first: oeuvre.nombre_episodes !== null ? (oeuvre.nombre_episodes - (oeuvre.nombre_episodes - 1)).toString() : '1',
            oldFirst: oeuvre.nombre_episodes !== null ? [(oeuvre.nombre_episodes - (oeuvre.nombre_episodes - 1)).toString()] : ['1'],
            error: false,
            errorMessage: '',
            last: oeuvre.nombre_episodes !== null ? oeuvre.nombre_episodes.toString() : '1',
            oldLast: oeuvre.nombre_episodes !== null ? [oeuvre.nombre_episodes.toString()] : ['1'],
            modif: false
          }
        ]
      };
    });
  }

  /********************************************************************/
  /************************** GAP MANAGEMENT  *************************/
  /********************************************************************/

  /***************** GAP MODIFICATION *******************/

  /** CIRCLE BTN MODIF CLICK **/
  modifGaps(gap) {
    gap.modif = true;
    this.modifExist = true;
  }

  displayModifGapBtn(gaps, gap) {
    this.otherGapsInmodif = [];
    gaps.map(e => {
      if (e.modif) {
        this.otherGapsInmodif.push(e);
      }
    });
    if (!gap.modif && !this.otherGapsInmodif.length) {
      return true;
    } else {
      return false;
    }
  }

  /********************* GAP DELETION *********************/

  /** CIRCLE BTN DELETE CLICK **/
  deleteGaps(gaps, gap) {
    gap.modif = false;
    gaps.pop();
    this.resetGaps = false;
  }

  /** BTN 'ANNULER' CLICK **/
  cancelGaps(gaps, gap) {
    gap.modif = false;
    if (gaps.indexOf(gap) === 0 && (!gap.first.length || !gap.last.length)) {
      gap.first = gap.oldFirst;
      gap.last = gap.oldLast;
    }
    if (
      (gaps.indexOf(gap) !== 0 && (!gap.first.length || !gap.last.length)) ||
      this.gapAdding
    ) {
      gaps.pop();
    }
    if (
      gap.first.length &&
      gap.last.length &&
      (gap.first !== gap.oldFirst[gap.oldFirst.length - 1] ||
        gap.last !== gap.oldLast[gap.oldLast.length - 1])
    ) {
      gap.first = gap.oldFirst[gap.oldFirst.length - 1];
      gap.last = gap.oldLast[gap.oldLast.length - 1];
    }
    this.resetGaps = false;
    this.gapAdding = false;
    this.modifExist = false;
  }

  displayCancelBtn(gaps, gap) {
    if (
      !gap.modif &&
      gaps.indexOf(gap) === gaps.length - 1 &&
      gaps.indexOf(gap)
    ) {
      return true;
    }
  }

  /************************ GAP ADDING ***********************/

  /** CIRCLE BTN ADD CLICK **/
  addGaps(gaps, gap) {
    gap.modif = false;
    this.gapAdding = true;
    gaps.push({
      first: '',
      oldFirst: [],
      oldLast: [],
      last: '',
      modif: true
    });
    this.resetGaps = true;
    this.modifExist = true;
  }

  /** DISPLAY CIRCLE ADD BTN **/
  displayAddBtn(oeuvre, gaps, gap) {
    this.checkTotalGaps(gaps);
    if (this.totalGaps < oeuvre.nombre_episodes && !gap.modif) {
      if (oeuvre.gaps.indexOf(gap) === oeuvre.gaps.length - 1) {
        return true;
      }
    } else {
      return false;
    }
  }

  /** DISPLAY VALIDE BTN **/
  displayValidBtn(gap) {
    if (gap.modif && gap.first.length && gap.last.length) {
      if (
        gap.first.match(/^[0-9]+$/) &&
        gap.last.match(/^[0-9]+$/) &&
        gap.errorMessage !== 'too much' && //
        gap.errorMessage !== 'same value' && // on ne peut pas forcer ces 3 erreurs contairement aux autres
        Number(gap.first) <= Number(gap.last)//
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /** DISPLAY INVALIDE BTN **/
  displayInvalidBtn(gap) {
    if (gap.modif && gap.first.length && gap.last.length) {
      if (
        !gap.first.match(/^[0-9]+$/) ||
        !gap.last.match(/^[0-9]+$/) ||
        gap.errorMessage === 'too much' || //
        gap.errorMessage === 'same value' || // on ne peut pas forcer ces deux erreurs contairement aux autres
        gap.errorMessage === 'change order' //
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /** BTN 'Valider' CLICK **/
  validGaps(gap) {
    gap.modif = false;
    gap.oldLast.push(gap.last);
    gap.oldFirst.push(gap.first);
    this.modifExist = false;
  }

  /*********************** GAP ERRORS ***********************/

  /** DISPLAY WARNING ICON **/
  checkIfErrorExist(gaps) {
    let errors = [];
    gaps.map((gap) => {
      if (gap.error) {
        errors.push(gap.errorMessage);
      }
    });
    if (errors.length) {
      return true;
    }
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

  /** CHECK NUMBER TOTAL GAPS**/
  checkTotalGaps(gaps) {
    this.arrayGaps = gaps.map(e => {
      return e.last - e.first + 1;
    });
    this.totalGaps = this.arrayGaps.reduce((a, b) => a + b);
  }

  /** CHECK SAME EPISODE NUMBER**/
  displayErrorSameNumber(oeuvre, gaps, gap) {
    this.checkAllNumbers(oeuvre, gaps);
    this.noSameValue = oeuvre.numFichesMateriel.filter(
      (el, i, a) => i === a.indexOf(el)
    );
  }

  /** CHECK INTERVAL CREATION **/
  checkGapsInterval(gaps, gap) {
    this.arrayFirst = [];
    this.arrayLast = [];
    gaps.map(e => {
      this.arrayFirst.push(Number(e.first) - 2),
        this.arrayFirst.push(Number(e.first) - 1),
        this.arrayLast.push(Number(e.last) + 1),
        this.arrayLast.push(Number(e.last) + 2);
    });
    this.foundFirst = this.arrayLast.find(function(element) {
      return element === Number(gap.first);
    });
    this.foundLast = this.arrayFirst.find(function(element) {
      return element === Number(gap.last);
    });
  }

  /** DISTRIBUTES ERROR MESSAGE **/
  checkTotal(oeuvre, gaps, gap) {
    gap.error = false;
    this.checkTotalGaps(gaps);
    this.displayErrorSameNumber(oeuvre, gaps, gap);
    this.checkGapsInterval(gaps, gap);
    if (!gap.first.length || !gap.last.length) {
      gap.error = true;
      gap.errorMessage = 'no data';
    } else if (!gap.first.match(/^[0-9]+$/) || !gap.last.match(/^[0-9]+$/)) {
      gap.error = true;
      gap.errorMessage = 'not number';
    } else if (Number(gap.last) < Number(gap.first)) {
      gap.error = true;
      gap.errorMessage = 'change order';
    } else if (oeuvre.numFichesMateriel.length !== this.noSameValue.length) {
      gap.error = true;
      gap.errorMessage = 'same value';
    } else if (this.totalGaps > oeuvre.nombre_episodes) {
      gap.error = true;
      gap.errorMessage = 'too much';
    } else if ((this.foundFirst || this.foundLast) && (gap.first && gap.last)) {
      gap.error = true;
      gap.errorMessage = 'too little gap';
    } else if (this.totalGaps && this.totalGaps < oeuvre.nombre_episodes) {
      gap.error = true;
      gap.errorMessage = 'not enough';
    } else {
      gap.error = false;
      gap.errorMessage = '';
    }
  }

  /** DISPLAY WARNING MESSAGE FOR REMAINING EPISODES **/
  displayRestOfEps(oeuvre, gaps) {
    this.gapInModif = [];
    this.checkTotalGaps(gaps);
    gaps.map(e => {
      if (e.modif) {
        this.gapInModif.push(e);
      }
    });
    if (this.totalGaps < oeuvre.nombre_episodes && !this.gapInModif.length) {
      this.remainingEps = oeuvre.nombre_episodes - this.totalGaps;
      return true;
    } else {
      return false;
    }
  }

  /** DISPLAY CREATION BTN OR CREATION DISABLED BTN **/
  displayCreateBtn(oeuvreWithGaps) {
    const gapInModif = [];
    if (oeuvreWithGaps.length > 1) {
      oeuvreWithGaps.map((item) => {
        item.gaps.map((gap) => {
          if (gap.modif === true) {
            gapInModif.push(gap);
          }
        });
      });
    } else {
      oeuvreWithGaps[0].gaps.map((gap) => {
        if (gap.modif === true) {
          gapInModif.push(gap);
        }
      });
    }
    if (!gapInModif.length) {
        return true;
    } else {
      return false;
    }
  }

  /********************************************************************/
  /************************** MODALS MANAGEMENT  **********************/
  /********************************************************************/

  /******* check crationState event from creation-fiches-materiel component *******/
  checkCreationState(event) {
    this.creationState = event;
      this.confirmCreation();
  }

  /******* Modal : creation with succes *******/
  confirmCreation() {
    document
      .querySelector('#' + 'recap-fiche-achat')
      .classList.remove('md-show');
    setTimeout(
      () => { if (this.creationState) {
        swal({
          text: 'Les fiches materiel ont été crées avec succès',
          showCancelButton: true,
          type: 'success',
          cancelButtonText: 'Fermer',
          confirmButtonText: 'Voir les fiches matériel',
          confirmButtonColor: '#17AAB2'
        }).then(result => {
          if (result.value) {
            this.router.navigate([`/material-sheets/my-material-sheets/6/desc`]);
          }
        });
      } else {
        swal({
          text: 'Une erreur est survenue, veuillez réessayer ultérieurement',
          showCancelButton: false,
          type: 'error',
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#979696'
        });
      }
    }, 500);
    setTimeout(() => {
      this.initStep.emit((this.step = 1));
      this.creationState = false;
    }, 1000);
  }

  /***** Close modal creation-details *****/
  closeMyModal(event) {
    this.creationState = false;
    event.target.parentElement.parentElement.parentElement.parentElement.classList.remove(
      'md-show'
    );
    setTimeout(() => this.initStep.emit((this.step = 1)), 1000);
  }
}
