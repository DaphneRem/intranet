import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';

import { Store } from '@ngrx/store';
import { App } from './../../../../../apps/fiches-materiel/src/app/+state/app.interfaces';

@Component({
  selector: 'fiches-materiel-all',
  templateUrl: './fiches-materiel-all.component.html',
  styleUrls: ['./fiches-materiel-all.component.scss'],
  providers: [
    FichesMaterielService,
    Store
  ]
})
export class FichesMaterielAllComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();

  public reloadOriginalData: boolean;
  public headerTableLinkExist = false;
  public tableTitle = 'Toutes les fiches Matériel';
  public tableTheme: string = 'default theme';
  public daysNumber = 100;
  public isArchived = 2;
  public changeView;
  public multiColumnsOrderExist: boolean = true;
  public multiColumnsOrder = [
    [10, 'desc'], // n°FA du plus récent au plus ancien
    [5, 'asc'], // TF par ordre alphabétique
    [7, 'asc'], // n° épidose AB par ordre croissant
  ];

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

  public autofields = {
      SuiviPar: '',
      TitreEpisodeVO: '',
      TitreEpisodeVF: '',
      isarchived: this.isArchived,
      distributeur: '',
      numficheachat: '',
      Isdeal: 2,
      Isurgence: false
  };
  public globalStore;
  public userModifRights: boolean;

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private appStore: Store<App>,
) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
    this.appStore.subscribe(data => (this.globalStore = data));
    console.log('globalStore => ', this.globalStore);
    this.userModifRights = this.globalStore.app.user.rights.modification;
    console.log('this.userModifRights => ', this.userModifRights);
    /********** GET ON COMPONENT INIT FOR DISPLAYING TABLE (OLD VERSION) **********/
    // this.getFichesMaterielByIntervalCreationIsArchived(this.daysNumber, this.isArchived);
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

  displayReloadOriginalData(event: boolean) {
    this.reloadOriginalData = event;
    this.dataReady = false;
    this.getFichesMaterielByIntervalCreationIsArchived(this.daysNumber, this.isArchived);
  }

  displayNewDataFromComplexSearch(event: FicheMateriel[]) {
    console.log('displayNewDataFromComplexSearch => ', this.dataReady);
    this.dataReady = false;
    this.data = event;
    console.log('displayNewDataFromComplexSearch 2 => ', this.dataReady);
    console.log('data event  => ', this.data);
    this.dataReady = true;
    console.log('displayNewDataFromComplexSearch 3 => ', this.dataReady);

  }
}
