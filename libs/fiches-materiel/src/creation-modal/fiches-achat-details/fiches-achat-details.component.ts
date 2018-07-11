import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'fiches-achat-details',
  templateUrl: './fiches-achat-details.component.html',
  styleUrls: [
    './fiches-achat-details.component.scss',
    '../../../../../node_modules/sweetalert2/src/sweetalert2.scss',

  ]
})
export class FichesAchatDetailsComponent implements OnInit {
  @Input() detailsFicheAchat;
  @Input() step;
  @Input() seriesExist;

  @Output() nextStep = new EventEmitter;

  constructor( private router: Router ) { }

  ngOnInit() {
    console.log(this.seriesExist);
  }

  goToNextStep() {
    this.step ++;
    this.nextStep.emit(this.step);
  }

  confirmCreation(event) {
      ((event.target.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
      setTimeout(() => swal({
        text: 'Les fiches materiel ont été crées avec succès',
        showCancelButton: true,
        type: 'success',
        cancelButtonText: 'Fermer',
        confirmButtonText: 'Voir les fiches matériel',
        confirmButtonColor: '#17AAB2',
      }).then((result) => {
        if (result.value) {
          this.router.navigate([`/material-sheets/my-material-sheets`]);
        }
      }), 500);
      setTimeout(() => this.nextStep.emit(this.step = 1), 1000);
    }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
    this.step = 1;
    this.nextStep.emit(this.step);
  }

}
