import { Component, OnInit } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

@Component({
  selector: 'fiches-materiel-archived',
  templateUrl: './fiches-materiel-archived.component.html',
  styleUrls: ['./fiches-materiel-archived.component.scss']
})
export class FichesMaterielArchivedComponent implements OnInit {

  public headerTableLinkExist = false;

  public widgetLink = '/';
  public icons = [];
  public fichesMaterielCreation: CustomIconBadge = {
      littleIcon : {
        circleColor: '#0EC93D',
        icon : 'icofont icofont-ui-add',
        iconSize: '1em',
        iconMargin: '6px',
      },
      bigIcon : {
        icon: 'icofont icofont-file-text',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
      },
      link : '/creation',
      tooltip : true,
      tooltipMessage : 'Créer des fiches Matériel'
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
      circleColor: '#999898',
      circleColorHover: '#b5b3b3',
      },
      link : '/displaying-purchase-sheets',
      tooltip : true,
      tooltipMessage : 'Voir les fiches Achat'
  };

  constructor() { }

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
  }

}
