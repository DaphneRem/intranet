import { Component, OnInit } from '@angular/core';
import { IngestPurgeService } from '../services/ingest-purge.service';
import { IngestPurge } from '../modules/ingests-purge.class';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'ingests-table-purge',
  templateUrl: './ingests-table-purge.component.html',
  styleUrls: ['./ingests-table-purge.component.scss']
})

export class IngestsTablePurgeComponent implements OnInit {
  constructor(private getIngest: IngestPurgeService ) {}

  datas: any = [];

  ngOnInit() {
    this.getIngest.getPurgeList('1').subscribe(
      data => {
        this.datas = data;
      }
    );
  }


}
