import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

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
export class ModalFicheAchatDetailComponent implements OnInit, OnChanges {
  @Input() ficheAchat;
  @Input() dataReloadReady;

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

  getFicheAchatDetails(id) {
    this.fichesAchatService
      .getFichesAchatDetails(id)
      .subscribe( data => {
        console.log(data);
        data.map(e => {
          this.debutDesDroitsDate = new Date(e.debut_des_droits);
          e.debut_des_droits = this.debutDesDroitsDate.toLocaleString();
        });
        this.detailsFicheAchat = data;
        this.dataReady = true;
      });
  }

  closeMyModal(event) {
    document.querySelector('#' + 'modal-detail-fiche-achat').classList.remove('md-show');
  }

}
