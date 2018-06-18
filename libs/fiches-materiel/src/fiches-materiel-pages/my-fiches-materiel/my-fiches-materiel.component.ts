import { Component, OnInit } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';


@Component({
  selector: 'my-fiches-materiel',
  templateUrl: './my-fiches-materiel.component.html',
  styleUrls: [
    './my-fiches-materiel.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'

  ]
})
export class MyFichesMaterielComponent implements OnInit {


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
        circleColor:  '#999898',
      },
      link : '/creation'
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
