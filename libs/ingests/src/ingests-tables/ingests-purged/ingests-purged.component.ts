import { Component, OnInit } from '@angular/core';

// lib imports
import { CustomDatatablesOptions } from '@ab/custom-datatables';

import { IngestsPurgedService } from '../../services/ingests-purged.service';
import { IngestsPurged } from '../../models/ingests-purged';

@Component({
  selector: 'ingests-purged',
  templateUrl: './ingests-purged.component.html',
  styleUrls: ['./ingests-purged.component.scss'],
  providers: [
    IngestsPurgedService
  ]
})
export class IngestsPurgedComponent implements OnInit {

  constructor( private ingestsPurgedService: IngestsPurgedService ) {}

  public datas: any = [];
  public dataReady = false;
  public headerTableLinkExist = false;
  public customdatatablesOptions: CustomDatatablesOptions = {
    tableTitle: 'Fichiers purgés',
    data: [],
    headerTableLinkExist: false,
    headerTableLink: '',
    customColumn: false,
    paging: true,
    search: true,
    rowsMax: 20,
    lenghtMenu: [5, 10, 15],
    theme: 'blue theme',
    renderOption : false,
    buttons: {
      buttons: true,
      allButtons: true,
      colvisButtonExiste: true,
      copyButtonExiste: true,
      printButtonExiste: true,
      excelButtonExiste: true,
    }
  };

  ngOnInit() {
    this.getIngestsInProgress(3);
  }

  checkDataReady() {
    return this.dataReady;
  }

  getIngestsInProgress(number) {
    this.ingestsPurgedService.getIngestsPurged(number).subscribe(data => {
      this.customdatatablesOptions.data = data;
      this.dataReady = true;
    });
  }
}
