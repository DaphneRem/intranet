import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'history-steps-status-modal',
  templateUrl: './history-steps-status-modal.component.html',
  styleUrls: [
    './history-steps-status-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'

  ],
})
export class HistoryStepsStatusModalComponent implements OnInit {
  closeResult: string;

  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit() {
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' , centered: true});
  }

}
