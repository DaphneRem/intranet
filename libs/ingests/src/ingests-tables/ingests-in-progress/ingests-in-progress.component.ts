import { Component, OnInit, Input } from '@angular/core';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { IngestsInProgressService } from '../../services/ingests-in-progress.service';
import { IngestsInProgress } from '../../models/ingests-in-progress';

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
  public data: IngestsInProgress[];

  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'en cours de traitement',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme : 'blue theme',
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

  constructor( private ingestsInProgressService: IngestsInProgressService ) {}

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

  getIngestsInProgress(e: number) {
    this.ingestsInProgressService
      .getIngestsInProgress(e)
      .subscribe(data => {
        this.data = data;
        this.customdatatablesOptions.data = this.data;
        this.dataReady = true;
        this.displayColumns(data);
      });
  }

  displayColumns(data) {
    console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'titreSeg',
        data : 'titreSeg'
      },
      {
        title : 'id',
        data : 'id'
      },
      {
        title : 'noseg',
        data : 'noseg'
      },
      {
        title : 'nomfichier',
        data : 'nomfichier'
      },
      {
        title : 'stockage',
        data : 'stockage'
      },
      {
        title : 'idSuppSuivant',
        data : 'idSuppSuivant'
      },
      {
        title : 'noSegSuivant',
        data : 'noSegSuivant'
      },
      {
        title : 'statutSupport',
        data : 'statutSupport'
      },
      {
        title : 'typeSupport',
        data : 'typeSupport'
      },
      {
        title : 'tstamp',
        data : 'tstamp'
      },
      {
        title : 'commentaires',
        data : 'commentaires'
      },
    ];
  }
}
