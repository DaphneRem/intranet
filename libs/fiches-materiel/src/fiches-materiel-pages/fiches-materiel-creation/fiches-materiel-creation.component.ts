import { CustomIconBadge } from '@ab/custom-icons';
import { Component, Input, OnInit } from '@angular/core';


import swal from 'sweetalert2';

@Component({
  selector: 'fiches-materiel-creation',
  templateUrl: './fiches-materiel-creation.component.html',
  styleUrls: [
    './fiches-materiel-creation.component.scss'],
})
export class FichesMaterielCreationComponent implements OnInit {

  /* OPTIONS FICHES ACHAT TABLE */
  public headerTableLinkExist = false;
  public displayActionType = 'modal';
  public modalName = '#recap-fiche-achat';
  public stateFIcheAchat = {
      id: 2,
      name: 'Fiches Achats non traitées'
  };

  public icons = [];
  // public fichesMaterielView: CustomIconBadge = {
  //     littleIcon : {
  //       circleColor: '#3383FF',
  //       icon : 'icofont icofont-eye',
  //       iconSize: '1.5em',
  //       iconMargin: '2px',
  //     },
  //     bigIcon : {
  //       icon: 'icofont icofont-file-text',
  //     circleColor: '#999898',
  //     circleColorHover: '#b5b3b3',
  //     },
  //     link : '../material-sheets/my-material-sheets/0/asc',
  //     tooltip : true,
  //     tooltipMessage : 'Voir les fiches Matériel'
  // };
  public fichesAchatView: CustomIconBadge = {
      littleIcon : {
        circleColor: '#3383FF',
        icon : 'icofont icofont-eye',
        iconSize: '1.5em',
        iconMargin: '2px',
      },
      bigIcon : {
        icon: 'icofont icofont-tag',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
      },
      link : '/displaying-purchase-sheets',
      tooltip : true,
      tooltipMessage : 'Voir les Fiches Achat'
  };

  constructor() { }

  ngOnInit() {
    this.icons = [this.fichesAchatView];
    // this.icons = [this.fichesMaterielView, this.fichesAchatView];
  }

}
