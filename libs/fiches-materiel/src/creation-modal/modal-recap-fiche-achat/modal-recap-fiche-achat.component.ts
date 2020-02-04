import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { transition, trigger, style, animate } from '@angular/animations';
import swal from 'sweetalert2';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// lib import
import { CustomIconBadge } from '@ab/custom-icons';

// service & model import
import { FicheAchatDetails } from '@ab/fiches-achat';
import { FichesAchatService } from '@ab/fiches-achat';

@Component({
  selector: 'modal-recap-fiche-achat',
  templateUrl: './modal-recap-fiche-achat.component.html',
  styleUrls: [
    './modal-recap-fiche-achat.component.scss',
    '../../../../../node_modules/sweetalert2/src/sweetalert2.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    FichesAchatService
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})

export class ModalRecapFicheAchatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ficheAchat;

  private onDestroy$: Subject<any> = new Subject();

  public myFicheAchat;
  public detailsFicheAchat;
  public dataReady = false;
  public step = 1;
  public init = 1;
  public faMajExist: boolean = false;

  constructor(
    private router: Router,
    private fichesAchatService: FichesAchatService
  ) {}

  ngOnInit() {
    this.step = 1;
  }

  changeStep(event) {
    this.step = event;
  }

  ngOnChanges(changes: SimpleChanges) {
    const ficheAchat: SimpleChange = changes.ficheAchat;
    this.myFicheAchat = ficheAchat.currentValue;
    if (this.init > 1) {
      this.detailsFicheAchat = null;
      this.getFicheAchatDetails(ficheAchat.currentValue.id_fiche);
    }
    this.init++;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  getFicheAchatDetails(id) {
    this.fichesAchatService
      .getFichesAchatDetails(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe( data => {
        console.log('getFicheAchatDétail res => ', data);
        this.detailsFicheAchat = data;
        this.checkFmImportForOeuvre();
        this.dataReady = true;
      });
  }

  closeMyModal(event) {
    document
      .querySelector('#' + 'recap-fiche-achat')
      .classList.remove('md-show');
    setTimeout(() => (this.step = 1), 500);
  }


  checkFmImportForOeuvre() {
    this.faMajExist = false;
    // let importFmOeuvre = this.detailsFicheAchat.filter(item => item.Import_FM === 1);
    // console.log('importFmOeuvre => ', importFmOeuvre);
    // if (importFmOeuvre.length > 0) {
    //   this.faMajExist = true;
    // } else {
    //   this.faMajExist = false;
    // }
  }


}
