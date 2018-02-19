import { Component, OnInit } from '@angular/core';
import { IngestPurgeService } from '../services/ingest-purge';
import { IngestPurge } from '../models/ingests-purge';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'ingests-table-purge',
  templateUrl: './ingests-table-purge.component.html',
  styleUrls: ['./ingests-table-purge.component.scss']
})

export class IngestsTablePurgeComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  constructor(private getIngest: IngestPurgeService ) {}

  datas: any = [];
  loading = true;

  tableInit() {
    this.dtOptions = {
      data : this.datas,
      columns: [{
        title: 'DIFFUSION_ID',
        data: 'DIFFUSION_ID'
      }, {
        title: 'STATUTDETAIL',
        data: 'STATUTDETAIL'
      }, {
        title: 'POSSTATUT',
        data: 'POSSTATUT'
      }, {
        title: 'IDCHAINE',
        data: 'IDCHAINE'
      }, {
        title: 'COMMENTAIRE',
        data: 'COMMENTAIRE'
      }, {
        title: 'TSTAMP',
        data: 'TSTAMP'
      }]
    };
  }

  ngOnInit() {
    this.getIngest.getPurgeList('1').subscribe(
      data => {
        this.datas = data;
        this.datas = JSON.parse( this.datas );
        this.loading = false;
        this.tableInit();
      }
    );
  }
}
