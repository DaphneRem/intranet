import { Component, OnInit, Input, OnChanges, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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
export class HistoryDeliveryDateModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() myFicheMateriel;
  @Input() reload?;

  public closeResult: string;
  private onDestroy$: Subject<any> = new Subject();

  public count: number;
  public historyDeliveryDate: HistoryDeliveryDate[];

  constructor(
    private modalService: NgbModal,
    private historyDeliveryDateService: HistoryDeliveryDateService
  ) {}

  ngOnInit() {
    console.log(this.myFicheMateriel);
    this.getHistoryDeliveryDate(this.myFicheMateriel.IdFicheMateriel);
  }

  ngOnChanges(reload) {
    console.log('onChange reaload history delivery date ===================> ', reload);
    if (this.count === 0) {
      this.count++;
    } else {
      this.getHistoryDeliveryDate(this.myFicheMateriel.IdFicheMateriel);
      console.log(reload);
    }
    console.log('------------------------------------------------------------------> ', this.count);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  openLg(deliveryDateContent) {
    this.modalService.open(deliveryDateContent, { size: 'lg' , centered: true});
  }

  getHistoryDeliveryDate(idFicheMateriel) {
    this.historyDeliveryDateService
      .getHistoryDeliveryDate(idFicheMateriel)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: HistoryDeliveryDate[]) => {
        console.log(data);
        this.historyDeliveryDate = data.reverse();
      });
  }

}

