import { Component, OnInit, Input } from '@angular/core';

import { KaiEchecService } from '../services/kai-echec.service';
import { KaiEchec } from '../models/kai-echec';

import { CustomDatatablesOptions } from '@ab/custom-datatables';

@Component({
  selector: 'kai-echec',
  templateUrl: './kai-echec.component.html',
  styleUrls: ['./kai-echec.component.scss'],
  providers : [
    KaiEchecService
  ]
})

export class KaiEchecComponent implements OnInit {

  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;

  public render: boolean;
  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Ingests en echec',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 5,
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

  constructor( private kaiEchecService: KaiEchecService ) {}

  ngOnInit() {
    this.getIngestsKaiEchec(this.daysTableView);
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

  getIngestsKaiEchec(number) {
    this.kaiEchecService.getIngestsKaiEchec(number).subscribe(data => {
      this.customdatatablesOptions.data = data;
      this.dataReady = true;
      this.displayColumns(data);
    });
  }

    displayColumns(data) {
    console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'DIFFUSION_ID',
        data : 'DIFFUSION_ID'
      },
      {
        title : 'STATUTDETAIL',
        data : 'STATUTDETAIL'
      },
      {
        title : 'POSSTATUT',
        data : 'POSSTATUT'
      },
      {
        title : 'TSTAMP',
        data : 'TSTAMP'
      },
      {
        title : 'COMMENTAIRE',
        data : 'COMMENTAIRE',
        className: 'longer-data'
      }
    ];
  }
}


