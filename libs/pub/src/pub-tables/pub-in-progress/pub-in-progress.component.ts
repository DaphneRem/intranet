import { Component, OnInit, Input } from '@angular/core';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { PubInProgressService } from '../../services/pub-in-progress.service';
import { PubInProgress } from '../../models/pub-in-progress';

@Component({
  selector: 'pub-in-progress',
  templateUrl: './pub-in-progress.component.html',
  styleUrls: ['./pub-in-progress.component.scss'],
  providers : [
    PubInProgressService
  ]
})
export class PubInProgressComponent implements OnInit {
  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink;

  public render: boolean;

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
    theme: 'blue theme',
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

  constructor( private pubInProgressService: PubInProgressService ) {}

  ngOnInit() {
    this.getPubInProgress(this.daysTableView);
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

  getPubInProgress(number) {
    this.pubInProgressService
      .getPubInProgress(number)
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
        } else {
          this.customdatatablesOptions.data = data;
        }
        this.dataReady = true;
        this.displayColumns(data);
    });
  }

  displayColumns(data) {
    this.customdatatablesOptions.columns = [
      {
        title : 'id',
        data : 'id'
      },
      {
        title : 'noseg',
        data : 'noseg'
      },
      {
        title : 'titreEpisFra',
        data : 'titreEpisFra'
      },
      {
        title : 'filename',
        data : 'filename'
      },
      {
        title : 'dateetat',
        data : 'dateetat'
      },
    ];
  }
}




