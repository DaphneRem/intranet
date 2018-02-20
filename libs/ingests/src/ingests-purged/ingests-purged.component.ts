import { Component, OnInit } from '@angular/core';
import { IngestsPurgedService } from '../services/ingests-purged.service';
import { IngestsPurged } from '../models/ingests-purged';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { CustomDatatablesOptions } from '@ab/custom-datatables';

@Component({
  selector: 'ingests-purged',
  templateUrl: './ingests-purged.component.html',
  styleUrls: ['./ingests-purged.component.scss'],
  providers: [IngestsPurgedService]
})
export class IngestsPurgedComponent implements OnInit {
  constructor(private ingestsPurgedService: IngestsPurgedService) {}
  public dataReady = false;

  headerTableLinkExist = false;
  datas: any = [];
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
    // this.ingestsPurgedService.getIngestsPurged(3).subscribe(data => {
    //   this.datas = data;
    // });
        this.getIngestsInProgress(3);

  }

  checkDataReady() {
    return this.dataReady;
  }

  getIngestsInProgress(number) {
    this.ingestsPurgedService.getIngestsPurged(number).subscribe(data => {
      this.customdatatablesOptions.data = data;
      this.dataReady = true;
      console.log(this.customdatatablesOptions.data);
    });
  }
}
