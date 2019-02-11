import { Component, OnInit } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';

@Component({
  selector: 'my-fiches-materiel-all',
  templateUrl: './my-fiches-materiel-all.component.html',
  styleUrls: ['./my-fiches-materiel-all.component.scss'],
    providers: [
    FichesMaterielService
  ]
})
export class MyFichesMaterielAllComponent implements OnInit {

 public headerTableLinkExist: boolean = false;
  public tableTitle: string = 'Toutes les fiches Matériel';
  public daysNumber: number = 100;
  public isArchived: number = 2;

  public data: FicheMateriel[];
  public dataReady: boolean;

  public widgetLink = '/';
  public icons = [];
  public fichesMaterielCreation: CustomIconBadge = {
    littleIcon: {
      circleColor: '#0EC93D',
      icon: 'icofont icofont-ui-add',
      iconSize: '1em',
      iconMargin: '6px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3'
    },
    link: '/creation',
    tooltip: true,
    tooltipMessage: 'Créer des fiches Matériel'
  };
  public fichesAchatView: CustomIconBadge = {
    littleIcon: {
      circleColor: '#3383FF',
      icon: 'icofont icofont-eye',
      iconSize: '1.5em',
      iconMargin: '2px'
    },
    bigIcon: {
      icon: 'icofont icofont-tag',
      circleColor: '#999898',
      circleColorHover: '#b5b3b3'
    },
    link: '/displaying-purchase-sheets',
    tooltip: true,
    tooltipMessage: 'Voir les fiches Achat'
  };

  constructor( private fichesMaterielService: FichesMaterielService ) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
    this.getFichesMaterielByIntervalCreationIsArchived(this.daysNumber, this.isArchived);
  }

  getFichesMaterielByIntervalCreationIsArchived(intervalModif: number, isArchived: number) {
    this.fichesMaterielService
      .getFichesMaterielByIntervalCreationIsArchived(intervalModif, isArchived)
      .subscribe(data => {
        if (!data) {
          this.data = [];
          this.dataReady = true;
          console.log(data);
        } else {
          this.data = data;
          this.dataReady = true;
          console.log(data);
        }
      });
  }
}

