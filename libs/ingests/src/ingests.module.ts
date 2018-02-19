import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';
import { DataTablesModule } from 'angular-datatables';

import { IngestsWidgetsViewComponent } from './ingests-widgets-view/ingests-widgets-view.component';
import { IngestsTablesViewComponent } from './ingests-tables-view/ingests-tables-view.component';
import { IngestsTablePurgeComponent } from './ingests-table-purge/ingests-table-purge.component';

import { IngestPurgeService } from './services/ingest-purge';

@NgModule({
  imports: [
    CommonModule,
    SubHeaderModule,
    WidgetsModule,
    DataTablesModule
  ],
  declarations: [
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent,
    IngestsTablePurgeComponent
  ],
  exports : [
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent
  ],
  providers : [
    IngestPurgeService
  ]
})
export class IngestsModule {
}
