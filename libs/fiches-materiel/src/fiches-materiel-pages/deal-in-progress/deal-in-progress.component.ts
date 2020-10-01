import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FicheMateriel } from '../../models/fiche-materiel';
import { DealsService } from '../../services/deals.service';

import { App } from '../../../../../apps/fiches-materiel/src/app/+state/app.interfaces';
import { Store } from '@ngrx/store';

@Component({
  selector: 'deal-in-progress',
  templateUrl: './deal-in-progress.component.html',
  styleUrls: ['./deal-in-progress.component.scss'],
  providers: [
    DealsService,
    Store
  ]
})
export class DealInProgressComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();
  public getDataOnInit: boolean = true;
  public isArchived: number = 2;
  public reloadOriginalData;

  public headerTableLinkExist = false;
  public tableTitle = 'Mes Deals en cours';
  public tableTheme: string = 'light blue theme';
  public globalStore;
  public user;
  public data: FicheMateriel[];
  public dataReady: boolean;
  public multiColumnsOrderExist = true;
  public multiColumnsOrder = [
    [10, 'asc'], // n°FA du plus ancien au plus récent
    [5, 'asc'], // TF par ordre alphabétique
    [7, 'asc'], // n° épidose AB par ordre croissant

    // [5, 'asc'], // TF par ordre alphabétique
    // [7, 'asc'], // n° épidose AB par ordre croissant
    // [10, 'asc'] // n°FA du plus ancien au plus récent
  ];

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

  public autofields = {
    SuiviPar: this.user,
    TitreEpisodeVO: '',
    TitreEpisodeVF: '',
    isarchived: this.isArchived,
    distributeur: '',
    numficheachat: '',
    Isdeal: 1,
    Isurgence: false
  };

  constructor(
    private dealsService: DealsService,
    private store: Store<App>
  ) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
    this.storeAppSubscription();
    // this.getDealsInProgress(this.user);
  }

  storeAppSubscription() {
    this.store
      .subscribe(data => {
        this.user = data['app'].user.shortUserName;
        this.autofields.SuiviPar = this.user;
        console.log(this.user);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  getDealsInProgress(user: string) {
    this.dealsService
      .getDealsInProgress(user)
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

  displayReloadOriginalData(event: boolean) {
    console.log('displayReloadOriginalData CALL');
    this.reloadOriginalData = event;
    this.dataReady = false;
    this.getDealsInProgress(this.user);
  }

  displayNewDataFromComplexSearch(event: FicheMateriel[]) {
    this.dataReady = false;
    this.data = event;
    this.dataReady = true;
  }

}
