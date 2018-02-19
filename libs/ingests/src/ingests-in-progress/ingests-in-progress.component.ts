import { Component, OnInit, Input } from '@angular/core';

import { IngestsInProgressService } from '../services/ingests-in-progress.service';
import { IngestsInProgress } from '../models/ingests-in-progress';

import { CustomDatatablesOptions } from '@ab/custom-datatables';

@Component({
  selector: 'ingests-in-progress',
  templateUrl: './ingests-in-progress.component.html',
  styleUrls: ['./ingests-in-progress.component.scss'],
  providers: [
    IngestsInProgressService,
    CustomDatatablesOptions
  ]
})
export class IngestsInProgressComponent implements OnInit {

  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;

  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {

    tableTitle: 'en cours de traitement',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: false,
    paging: true,
    search: true,
    rowsMax: 5,
    lenghtMenu: [5, 10, 15],
    theme : 'blue theme',
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true,
    }
  };

  constructor(private ingestsInProgressService: IngestsInProgressService) {}

  ngOnInit() {
    this.getIngestsInProgress(this.daysTableView);
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
      console.log(this.headerTableLink);
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
  
  getIngestsInProgress(number) {
    this.ingestsInProgressService
      .getIngestsInProgress(number)
      .subscribe(data => {
        this.customdatatablesOptions.data = data;
        this.dataReady = true;
        console.log(this.customdatatablesOptions.data);
      });
  }
}
