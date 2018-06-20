import { CustomIconBadge } from '@ab/custom-icons';
import {Component, Input, OnInit } from '@angular/core';


import swal from 'sweetalert2';

@Component({
  selector: 'fiches-materiel-creation',
  templateUrl: './fiches-materiel-creation.component.html',
  styleUrls: [
    './fiches-materiel-creation.component.scss'],
})
export class FichesMaterielCreationComponent implements OnInit {

  public openModal;


  public daysTableView = 3;
  public headerTableLinkExist = false;

  public icons = [];
  public fichesMaterielCreation: CustomIconBadge = {
      littleIcon : {
        circleColor: '#3383FF',
        icon : 'icofont icofont-eye',
        iconSize: '1.5em',
        iconMargin: '2px',
      },
      bigIcon : {
        icon: 'icofont icofont-file-text',
        circleColor:  '#999898',
      },
      link : '../material-sheets/my-material-sheets'
  };
  public fichesAchatView: CustomIconBadge = {
      littleIcon : {
        circleColor: '#3383FF',
        icon : 'icofont icofont-eye',
        iconSize: '1.5em',
        iconMargin: '2px',
      },
      bigIcon : {
        icon: 'icofont icofont-tag',
        circleColor:  '#999898',
      },
      link : '/displaying-purchase-sheets'
  };

  constructor() { }

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
  }

}
