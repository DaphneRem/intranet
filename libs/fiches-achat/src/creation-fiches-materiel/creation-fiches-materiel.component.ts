import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'creation-fiches-materiel',
  templateUrl: './creation-fiches-materiel.component.html',
  styleUrls: [
    './creation-fiches-materiel.component.scss',
    '../../../../node_modules/sweetalert2/src/sweetalert2.scss',

  ]
})
export class CreationFichesMaterielComponent implements OnInit {
  @Input() step;
  @Input() detailsFicheAchat;

  @Output() initStep = new EventEmitter;

  public series = [];

  constructor( private router: Router ) { }

  ngOnInit() {
    this.checkSeries();
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
    setTimeout(() => this.initStep.emit(this.step = 1), 1000);
  }

  checkSeries() {
    this.detailsFicheAchat.map((oeuvre) => {
      if (oeuvre.nombre_episodes > 1) {
        return this.series.push(oeuvre);
      }
    });
    console.log(this.series);
  }


  closeMyModal(event) {
    ((event.target.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
    setTimeout(() => this.initStep.emit((this.step = 1)), 1000);
  }


}
