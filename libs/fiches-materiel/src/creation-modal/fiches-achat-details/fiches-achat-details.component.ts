import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'fiches-achat-details',
  templateUrl: './fiches-achat-details.component.html',
  styleUrls: [
    './fiches-achat-details.component.scss',
    '../../../../../node_modules/sweetalert2/src/sweetalert2.scss'
  ]
})
export class FichesAchatDetailsComponent implements OnInit {
  @Input() detailsFicheAchat;
  @Input() step;

  @Output() nextStep = new EventEmitter();

  public creationState;

  constructor( private router: Router ) {}

  ngOnInit() {
  }

  goToNextStep() {
    this.step++;
    this.nextStep.emit(this.step);
  }

  checkCreationState(event) {
    this.creationState = event;
    this.confirmCreation();
  }

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
      this.nextStep.emit((this.step = 1));
      this.creationState = false;
    }, 1000);
  }

  closeMyModal(event) {
    event.target.parentElement.parentElement.parentElement.parentElement.classList.remove(
      'md-show'
    );
    this.step = 1;
    this.nextStep.emit(this.step);
  }
}
