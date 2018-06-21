import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';

import {transition, trigger, style, animate} from '@angular/animations';

import swal from 'sweetalert2';

import { CustomIconBadge } from '@ab/custom-icons';

@Component({
  selector: 'modal-recap-fiche-achat',
  templateUrl: './modal-recap-fiche-achat.component.html',
  styleUrls: ['./modal-recap-fiche-achat.component.scss',
      '../../../../node_modules/sweetalert2/src/sweetalert2.scss',
      '../../../../assets/icon/icofont/css/icofont.scss'

  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})

export class ModalRecapFicheAchatComponent implements OnInit {
  showDialog = false;
  @Input() visible: boolean;
  @Input() ficheAchat;
  public config: any;

  public fichesMaterielCreation: CustomIconBadge = {
      littleIcon : {
        circleColor: '#0EC93D',
        icon : 'icofont icofont-ui-add',
        iconSize: '0.9em',
        iconMargin: '6px',
      },
      bigIcon : {
        icon: 'icofont icofont-file-text',
        circleColor:  '#999898',
        iconSize: '1.8em'
      }
  };
  constructor( private router: Router ) { }

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
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');

  }

  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  ngOnInit() {
  }

}
