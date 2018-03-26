import { Component, OnInit, Input } from '@angular/core';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { IngestsCompletedService } from '../../services/ingests-completed.service';
import { IngestsCompleted } from '../../models/ingests-completed';

@Component({
  selector: 'ingests-completed',
  templateUrl: './ingests-completed.component.html',
  styleUrls: ['./ingests-completed.component.scss'],
  providers : [
    IngestsCompletedService
  ]
})
export class IngestsCompletedComponent implements OnInit {
  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;

  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'terminés',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: false,
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme: 'green theme',
    renderOption: true,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true
    }
  };

  constructor( private ingestsCompletedService: IngestsCompletedService ) {}

  ngOnInit() {
    this.getIngestsInProgress(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
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

  getIngestsInProgress(number) {
    this.ingestsCompletedService
      .getIngestsInProgress(number)
      .subscribe(data => {
        this.customdatatablesOptions.data = data;
        this.dataReady = true;
    });
  }
}




