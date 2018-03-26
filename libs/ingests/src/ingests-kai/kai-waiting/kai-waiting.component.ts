import { Component, OnInit, Input } from '@angular/core';

import { KaiWaitingService } from '../services/kai-waiting.service';
import { KaiWaiting } from '../models/kai-waiting';

import { CustomDatatablesOptions } from '@ab/custom-datatables';

@Component({
  selector: 'kai-waiting',
  templateUrl: './kai-waiting.component.html',
  styleUrls: ['./kai-waiting.component.scss'],
  providers : [
    KaiWaitingService
  ]
})
export class KaiWaitingComponent implements OnInit {

  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;
  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'en attente Kai',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: false,
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme : 'red theme',
    renderOption : true,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true,
    }
  };

  constructor(private kaiWaitingService: KaiWaitingService) {}

  ngOnInit() {
    this.getIngestsInProgress();
    this.checkDaysViews();
    this.checkLinks();
  }

  rerender(event) {
    this.render = event;
    // this.getIngestsInProgress(this.daysTableView);
    console.log(this.render);
  }

  checkLinks() {
    this.customdatatablesOptions.headerTableLinkExist = this.headerTableLinkExist;
    if (this.headerTableLinkExist) {
      this.customdatatablesOptions.headerTableLink = this.headerTableLink;
    }
  }

  checkDaysViews() {
    if (this.daysTableView === 1) {
      this.customdatatablesOptions.paging = true;
      this.customdatatablesOptions.search = true;
    } else {
      this.customdatatablesOptions.rowsMax = 15;
    }
  }

  checkDataReady() {
    return this.dataReady;
  }

  getIngestsInProgress() {
    this.kaiWaitingService.getIngestsInProgress().subscribe(data => {
      console.log(data);
      this.customdatatablesOptions.data = data;
      this.dataReady = true;
    });
  }
}


