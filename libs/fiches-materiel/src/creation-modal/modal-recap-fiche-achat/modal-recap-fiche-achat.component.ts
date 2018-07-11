import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { transition, trigger, style, animate } from '@angular/animations';
import swal from 'sweetalert2';

// lib import
import { CustomIconBadge } from '@ab/custom-icons';

// service import
import { FichesAchatService } from '@ab/fiches-achat';
import { FicheAchatDetails } from '@ab/fiches-achat';

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

export class ModalRecapFicheAchatComponent implements OnInit, OnChanges {
  @Input() visible: boolean;
  @Input() ficheAchat;

  public showDialog = false;
  public myFicheAchat;
  public config: any;
  public detailsFicheAchat;
  public dataReady = false;
  public step = 1;
  public seriesExist = false;
  public init = 1;
  public series = [];

  constructor(
    private router: Router,
    private fichesAchatService: FichesAchatService
  ) { }

  ngOnInit() {
    this.step = 1;
    console.log(this.step);
  }

  changeStep(event) {
    this.step = event;
  }

  ngOnChanges(changes: SimpleChanges) {
    const ficheAchat: SimpleChange = changes.ficheAchat;
    this.myFicheAchat = ficheAchat.currentValue;
    if (this.init > 1) {
      this.getFicheAchatDetails(ficheAchat.currentValue.id_fiche);
      // this.getFicheAchatDetails(18);
    }
    this.init++;
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
    setTimeout(() => this.step = 1, 500);
  }

  checkSeries(data) {
    data.map((e) => {
      if (e.nombre_episodes > 1) {
        this.series.push(e);
      } else {
        this.series = [];
      }
    });
    if (this.series.length) {
      this.seriesExist = true;
    } else {
      this.seriesExist = false;
    }
  }

  getFicheAchatDetails(id) {
    this.fichesAchatService
      .getFichesAchatDetails(id)
      .subscribe( data => {
        this.detailsFicheAchat = data;
        this.checkSeries(data);
        this.dataReady = true;
      });
  }

}
