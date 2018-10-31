import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'history-delivery-date-modal',
  templateUrl: './history-delivery-date-modal.component.html',
  styleUrls: [
    './history-delivery-date-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class HistoryDeliveryDateModalComponent implements OnInit {
  closeResult: string;

  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit() {
  }

  openLg(deliveryDateContent) {
    this.modalService.open(deliveryDateContent, { size: 'lg' , centered: true});
  }

}

