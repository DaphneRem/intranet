import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';

@Component({
  selector: 'fiches-materiel-all',
  templateUrl: './fiches-materiel-all.component.html',
  styleUrls: ['./fiches-materiel-all.component.scss'],
  providers: [
    FichesMaterielService
  ]
})
export class FichesMaterielAllComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();

  public headerTableLinkExist = false;
  public tableTitle = 'Toutes les fiches Matériel';
  public daysNumber = 100;
  public isArchived = 2;

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

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  getFichesMaterielByIntervalCreationIsArchived(intervalModif: number, isArchived: number) {
    this.fichesMaterielService
      .getFichesMaterielByIntervalCreationIsArchived(intervalModif, isArchived)
      .pipe(takeUntil(this.onDestroy$))
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
