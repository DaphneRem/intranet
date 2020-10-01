import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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
export class MyFichesMaterielArchivedComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();

  public tableTheme = 'green theme';
  public reloadOriginalData: boolean = false;
  public headerTableLinkExist: boolean = false;
  public tableTitle: string = 'Toutes mes fiches Matériel Archivées';
  public daysNumber: number = 100;
  public isArchived: number = 1;
  public data: FicheMateriel[];
  public dataReady: boolean;
  public user: string;
  public multiColumnsOrderExist: boolean = true;
  public multiColumnsOrder = [
    [10, 'desc'], // n°FA du plus récent au plus ancien
    [5, 'asc'], // TF par ordre alphabétique
    [7, 'asc'], // n° épidose AB par ordre croissant
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
      SuiviPar: '',
      TitreEpisodeVO: '',
      TitreEpisodeVF: '',
      isarchived: this.isArchived,
      distributeur: '',
      numficheachat: '',
      Isdeal : 2,
      Isurgence: false
  }; 

  constructor(
    private fichesMaterielService: FichesMaterielService,
    private store: Store<App>
  ) {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesAchatView];
    this.storeAppSubscription();
    /********** GET ON COMPONENT INIT FOR DISPLAYING TABLE (OLD VERSION) **********/
    // this.getFichesMaterielByIntervalCreationSuiviParIsArchived(this.daysNumber, this.user, this.isArchived);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  storeAppSubscription() {
    this.store.subscribe(data => {
        this.user = data['app'].user.shortUserName;
        this.autofields.SuiviPar = this.user;
        console.log(this.user);
    });
  }

  getFichesMaterielByIntervalCreationSuiviParIsArchived(intervalModif: number, suiviPar: string, isArchived: number) {
    this.fichesMaterielService
      .getFichesMaterielByIntervalCreationSuiviParIsArchived(intervalModif, suiviPar, isArchived)
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
    this.getFichesMaterielByIntervalCreationSuiviParIsArchived(this.daysNumber, this.user, this.isArchived);
  }

  displayNewDataFromComplexSearch(event: FicheMateriel[]) {
    this.dataReady = false;
    this.data = event;
    this.dataReady = true;
  }

}