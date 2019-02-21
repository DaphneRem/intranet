import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HistoryDeliveryDateService } from '../../services/history-delivery-date.service';
import { HistoryDeliveryDate } from '../../models/history-delivery-date';

@Component({
  selector: 'history-delivery-date-modal',
  templateUrl: './history-delivery-date-modal.component.html',
  styleUrls: [
    './history-delivery-date-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    HistoryDeliveryDateService
  ]
})
export class HistoryDeliveryDateModalComponent implements OnInit {
  @Input() myFicheMateriel;

  closeResult: string;

  public historyDeliveryDate: HistoryDeliveryDate[];

  constructor(
    private modalService: NgbModal,
    private historyDeliveryDateService: HistoryDeliveryDateService
  ) {}

  ngOnInit() {
    console.log(this.myFicheMateriel);
    this.getHistoryDeliveryDate(this.myFicheMateriel.IdFicheMateriel);
  }

  openLg(deliveryDateContent) {
    this.modalService.open(deliveryDateContent, { size: 'lg' , centered: true});
  }

  getHistoryDeliveryDate(idFicheMateriel) {
    this.historyDeliveryDateService
      .getHistoryDeliveryDate(idFicheMateriel)
      .subscribe((data: HistoryDeliveryDate[]) => {
        console.log(data);
        this.historyDeliveryDate = data.reverse();
      });
  }

}

