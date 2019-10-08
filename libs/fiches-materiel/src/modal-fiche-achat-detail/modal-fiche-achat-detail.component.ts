import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  OnDestroy
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// service & model import
import { FicheAchatDetails } from '@ab/fiches-achat';
import { FichesAchatService } from '@ab/fiches-achat';

import swal from 'sweetalert2';

@Component({
  selector: 'modal-fiche-achat-detail',
  templateUrl: './modal-fiche-achat-detail.component.html',
  styleUrls: [
    './modal-fiche-achat-detail.component.scss',
    '../../../../node_modules/sweetalert2/src/sweetalert2.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers : [
    FichesAchatService
  ]
})
export class ModalFicheAchatDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ficheAchat;
  @Input() dataReloadReady;

  private onDestroy$: Subject<any> = new Subject();

  public detailsFicheAchat;
  public dataReady;
  public myFicheAchat;
  public init = 0;
  public debutDesDroitsDate;

  constructor( private fichesAchatService: FichesAchatService ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const ficheAchat: SimpleChange = changes.ficheAchat;
    this.myFicheAchat = ficheAchat.currentValue;
    console.log(this.myFicheAchat);
    if (this.init) {
      this.getFicheAchatDetails(ficheAchat.currentValue.id_fiche);
    } else {
      this.init++;
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  getFicheAchatDetails(id) {
    this.fichesAchatService
      .getFichesAchatDetails(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
        data.map(e => {
          console.log('debut des droits ===> ', e.debut_des_droits);
          if (e.debut_des_droits !== null) {
            this.debutDesDroitsDate = new Date(e.debut_des_droits);
            e.debut_des_droits = this.debutDesDroitsDate.toLocaleString().split('').slice(0, 10).join('');
            console.log('e.debut_des_droits => ', e.debut_des_droits);
          }
        });
        this.detailsFicheAchat = data;
        this.dataReady = true;
      });
  }

  closeMyModal(event) {
    document.querySelector('#' + 'modal-detail-fiche-achat').classList.remove('md-show');
  }

}
