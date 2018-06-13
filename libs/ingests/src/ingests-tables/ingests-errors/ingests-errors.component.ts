import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { IngestsErrorsService } from '../../services/ingests-errors.service';
import { IngestsErrors } from '../../models/ingests-errors';

@Component({
  selector: 'ingests-errors',
  templateUrl: './ingests-errors.component.html',
  styleUrls: ['./ingests-errors.component.scss'],
    providers : [
    IngestsErrorsService
  ]
})
export class IngestsErrorsComponent implements OnInit {

  @Input() daysTableView: number;
  @Input() headerTableLinkExist: boolean;
  @Input() headerTableLink?: string;


  public render: boolean;

  public dataReady = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Erreurs',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: true,
    columns: [],
    // columnDefs : [],
    paging: true,
    search: true,
    rowsMax: 10,
    lenghtMenu: [5, 10, 15],
    theme: 'error theme',
    renderOption: true,
    dbClickActionExist: true,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true
    }
  };

  constructor(
    private ingestsErrorsService: IngestsErrorsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getIngestsErrors(this.daysTableView);
    this.checkDaysViews();
    this.checkLinks();
    this.displayAction();
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

  getIngestsErrors(number) {
    this.ingestsErrorsService
      .getIngestsErrors(number)
      .subscribe(data => {
        if (!data) {
          this.customdatatablesOptions.data = [];
        } else {
          this.customdatatablesOptions.data = data;
        }
        this.dataReady = true;
        // this.displayCreatedRow(data);
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
      },
      {
        title : 'nomfichier',
        data : 'nomfichier',
      },
      {
        title : 'stockage',
        data : 'stockage',
      },
      {
        title : 'idSuivant',
        data : 'idSuppSuivant',
        className: 'long-data'
      },
      // {
      //   title : 'noSegSuivant',
      //   data : 'noSegSuivant'
      // },
      // {
      //   title : 'statut',
      //   data : 'statutSupport',
      // },
      {
        title : 'diffusion ID',
        data : 'diffusionid'
      },
      {
        title : 'type',
        data : 'typeSupport',
      },
      {
        title : 'date état',
        data : 'tstamp',
      },
      {
        title : 'commentaires',
        data : 'commentaires',
        className: 'long-data'
      },
    ];
  }

}

