import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomIconBadge } from '@ab/custom-icons';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FicheMateriel } from '../../models/fiche-materiel';
import { FichesMaterielService } from '../../services/fiches-materiel.service';

import { App } from '../../../../../apps/fiches-materiel/src/app/+state/app.interfaces';
import { Store } from '@ngrx/store';

@Component({
  selector: 'my-fiches-materiel',
  templateUrl: './my-fiches-materiel.component.html',
  styleUrls: ['./my-fiches-materiel.component.scss'],
    providers: [
    FichesMaterielService,
    Store
  ]
})
export class MyFichesMaterielComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<any> = new Subject();

  public headerTableLinkExist: boolean = false;
  public tableTitle: string = 'Mes fiches Matériel en cours';
  public tableTheme: string = 'light blue theme';
  public daysNumber: number = 1000;
  public isArchived: number = 0;

  public getDataOnInit: boolean = true;
  public data: FicheMateriel[];
  public dataReady: boolean;
  public user: string;

  public reloadOriginalData: boolean;
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
    // this.getFichesMaterielByIntervalCreationSuiviParIsArchived(this.daysNumber, this.user, this.isArchived);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  storeAppSubscription() {
    this.store
      .subscribe(data => {
        this.user = data['app'].user.shortUserName;
        this.autofields.SuiviPar = this.user;
        console.log(this.user);
    });
  }

  getFichesMaterielByIntervalCreationSuiviParIsArchived(intervalModif: number, suiviPar: string, isArchived: number) {
    console.log('intervalCreation : ', intervalModif);
    console.log('suivi par : ', suiviPar);
    console.log('isArchived : ', isArchived);
    this.fichesMaterielService
      .getFichesMaterielByIntervalCreationSuiviParIsArchived(intervalModif, suiviPar, isArchived)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
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
    this.getFichesMaterielByIntervalCreationSuiviParIsArchived(this.daysNumber, this.user, this.isArchived);
  }

  displayNewDataFromComplexSearch(event: FicheMateriel[]) {
    this.dataReady = false;
    this.data = event;
    this.dataReady = true;
  }

}
