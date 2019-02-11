import { Component, OnInit } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';

import { App } from '../../../../../apps/fiches-materiel/src/app/+state/app.interfaces';
import { Store } from '@ngrx/store';

@Component({
  selector: 'my-fiches-materiel-archived',
  templateUrl: './my-fiches-materiel-archived.component.html',
  styleUrls: ['./my-fiches-materiel-archived.component.scss'],
  providers: [
    FichesMaterielService,
    Store
  ]
})
export class MyFichesMaterielArchivedComponent implements OnInit {

  public headerTableLinkExist: boolean = false;
  public tableTitle: string = 'Toutes mes fiches Matériel Archivées';
  public daysNumber: number = 100;
  public isArchived: number = 1;

  public data: FicheMateriel[];
  public dataReady: boolean;
  public user: string;

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

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private store: Store<App>
  ) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
    this.storeAppSubscription();
    this.getFichesMaterielByIntervalCreationSuiviParIsArchived(this.daysNumber, this.user, this.isArchived);
  }

  storeAppSubscription() {
    this.store.subscribe(data => {
        this.user = data['app'].user.shortUserName;
        console.log(this.user);
    });
  }

  getFichesMaterielByIntervalCreationSuiviParIsArchived(intervalModif: number, suiviPar: string, isArchived: number) {
    this.fichesMaterielService
      .getFichesMaterielByIntervalCreationSuiviParIsArchived(intervalModif, suiviPar, isArchived)
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