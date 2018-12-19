import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HistoryStepsStatusService } from '../../services/history-steps-status.service';
import { HistoryStepsStatus } from '../../models/history-steps-status';

@Component({
  selector: 'history-steps-status-modal',
  templateUrl: './history-steps-status-modal.component.html',
  styleUrls: [
    './history-steps-status-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    HistoryStepsStatusService
  ]
})
export class HistoryStepsStatusModalComponent implements OnInit {
  @Input() myFicheMateriel;
  @Input() statusLib;
  @Input() stepLib;

  closeResult: string;

  public historyStepsStatus;
  public historyStepsStatusReady: Boolean = false;

  constructor(
    private modalService: NgbModal,
    private historyStepsStatusService: HistoryStepsStatusService
  ) {}

  ngOnInit() {
    this.getHistoryStepsStatus(this.myFicheMateriel.IdFicheMateriel);
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' , centered: true});
  }

  getHistoryStepsStatus(idFicheMateriel) {
    this.historyStepsStatusService
      .getHistoryStepsStatus(idFicheMateriel)
      .subscribe(data => {
        console.log(data);
        if (data === null || data === []) {
          this.historyStepsStatus = [];
          this.historyStepsStatusReady = true;
        } else if (data.length === 0 ){
          this.historyStepsStatus = data;
          this.historyStepsStatusReady = true;
          this.addStepStatusLibelleToHistory();
        } else {
          this.historyStepsStatus = data.reverse();
          this.historyStepsStatusReady = true;
          this.addStepStatusLibelleToHistory();
        }
      });
  }

  addStepStatusLibelleToHistory() {
    this.historyStepsStatus.forEach(history => {
      this.statusLib.forEach(status => {
        if (status.IdLibstatut === history.IdLibstatut) {
          Object.assign(this.historyStepsStatus[this.historyStepsStatus.indexOf(history)], { libelleStatus: status.Libelle });
          console.log(this.historyStepsStatus);
        }
      });
      this.stepLib.forEach(step => {
        if (step.IdLibEtape === history.IdEtape) {
          Object.assign(this.historyStepsStatus[this.historyStepsStatus.indexOf(history)], { libelleStep: step.Libelle });
        }
      });
    });
  }

}
