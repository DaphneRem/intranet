import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'fiches-achat-details',
  templateUrl: './fiches-achat-details.component.html',
  styleUrls: [
    './fiches-achat-details.component.scss',
    '../../../../node_modules/sweetalert2/src/sweetalert2.scss',

  ]
})
export class FichesAchatDetailsComponent implements OnInit {
  @Input() ficheAchat;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  confirmCreation(event) {
    swal({
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
    });
    ((event.target.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');

  }
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

}
