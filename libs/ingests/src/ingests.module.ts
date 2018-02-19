import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

import { CustomDatatablesModule } from '@ab/custom-datatables';

import { IngestsWidgetsViewComponent } from './ingests-widgets-view/ingests-widgets-view.component';
import { IngestsTablesViewComponent } from './ingests-tables-view/ingests-tables-view.component';
import { IngestsTablePurgeComponent } from './ingests-table-purge/ingests-table-purge.component';

import { IngestsInProgressComponent } from './ingests-in-progress/ingests-in-progress.component';
import { IngestsInProgressDetailsComponent } from './ingests-in-progress-details/ingests-in-progress-details.component';

@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    IngestsInProgressComponent,
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent,
    IngestsInProgressDetailsComponent,
    IngestsTablePurgeComponent
  ],
  exports : [
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent
  ]
})

export class IngestsModule {
}
