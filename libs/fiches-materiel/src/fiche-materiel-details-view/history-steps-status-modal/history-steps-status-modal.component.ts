import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HistoryStepsStatusService } from '../../services/history-steps-status.service';
import { HistoryStepsStatus } from '../../models/history-steps-status';

import { StatusLibService } from '../../services/status-lib.service';
import { Status } from '../../models/status';

import { StepsLibService } from '../../services/steps-lib.service';
import { Step } from '../../models/step';

@Component({
  selector: 'history-steps-status-modal',
  templateUrl: './history-steps-status-modal.component.html',
  styleUrls: [
    './history-steps-status-modal.component.scss',
    '../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [
    HistoryStepsStatusService,
    StatusLibService,
    StepsLibService
  ]
})
export class HistoryStepsStatusModalComponent implements OnInit {
  @Input() myFicheMateriel;

  closeResult: string;

  public historyStepsStatus;
  public historyStepsStatusReady: Boolean = false;

  public statusLib: Status[];
  public statusReady: Boolean = false;

  public stepsLib: Step[];
  public stepsReady: Boolean = false;

  constructor(
    private modalService: NgbModal,
    private historyStepsStatusService: HistoryStepsStatusService,
    private statusLibService: StatusLibService,
    private stepsLibService: StepsLibService
  ) {}

  ngOnInit() {
    this.getStatusLib();
    this.getStepsLib();
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

  getStatusLib() {
    this.statusLibService
      .getStatusLib()
      .subscribe(data => {
        console.log(data);
        this.statusLib = data;
        this.statusReady = true;
      });
  }

  getStepsLib() {
    this.stepsLibService
      .getStepsLib()
      .subscribe(data => {
        console.log(data);
        this.stepsLib = data;
        this.stepsReady = true;
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
      this.stepsLib.forEach(step => {
        if (step.IdLibEtape === history.IdEtape) {
          Object.assign(this.historyStepsStatus[this.historyStepsStatus.indexOf(history)], { libelleStep: step.Libelle });
        }
      });
    });
  }

}
