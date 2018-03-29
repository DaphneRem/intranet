import { Component, OnInit, Input } from '@angular/core';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { KarinaWaitingService } from '../../services/karina-waiting.service';
import { KarinaWaiting } from '../../models/karina-waiting';

@Component({
  selector: 'karina-waiting',
  templateUrl: './karina-waiting.component.html',
  styleUrls: ['./karina-waiting.component.scss'],
    providers : [
    KarinaWaitingService
  ]
})
export class KarinaWaitingComponent implements OnInit {
  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;
  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'en attente Karina',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: false,
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme : 'yellow theme',
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

  constructor( private karinaWaitingService: KarinaWaitingService ) {}

  ngOnInit() {
    this.getKarinaWaiting();
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

  getKarinaWaiting() {
    this.karinaWaitingService.getKarinaWaiting().subscribe(data => {
      this.customdatatablesOptions.data = data;
      this.dataReady = true;
    });
  }

}



