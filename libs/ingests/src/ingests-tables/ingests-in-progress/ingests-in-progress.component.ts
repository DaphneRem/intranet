import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

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
    importantData : [
      {
        index : 4,
        className: 'warning',
        cellData: ['Bad Storage']
      }
    ],
    lenghtMenu: [5, 10, 15],
    theme : 'blue theme',
    renderOption : true,
    dbClickActionExist: true,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true,
    }
  };

  constructor(
    private ingestsInProgressService: IngestsInProgressService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getIngestsInProgress(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
    this.displayAction();
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

  displayAction() {
    this.customdatatablesOptions.dbClickAction = (dataRow) => {
      this.router.navigate([`/detail-file/support/${dataRow.id}/seg/${dataRow.noseg}`]);
    };
    this.customdatatablesOptions.tooltipHeader = 'Double cliquer sur un fichier pour avoir une vue détaillée';
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
        console.log(data);
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
    console.log('data columns :' + data[0]);
    this.customdatatablesOptions.columns = [
      {
        title : 'titreSeg',
        data : 'titreSeg',
        className: 'long-data'

      },
      {
        title : 'id',
        data : 'id',
      },
      {
        title : 'noseg',
        data : 'noseg',
        className: 'small-data'
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
        title : 'idSuivant',
        data : 'idSuppSuivant'
      },
      // {
      //   title : 'noSegSuivant',
      //   data : 'noSegSuivant'
      // },
      // {
      //   title : 'statut',
      //   data : 'statutSupport'
      // },
      {
        title : 'diffusion ID',
        data : 'diffusionid'
      },
      {
        title : 'type',
        data : 'typeSupport'
      },
      {
        title : 'date état',
        data : 'tstamp'
      },
      {
        title : 'commentaires',
        data : 'commentaires',
        className: 'long-data'
      },
    ];
  }
}
