import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

import { CustomDatatablesModule } from '@ab/custom-datatables';

import { IngestsWidgetsViewComponent } from './ingests-widgets-view/ingests-widgets-view.component';
import { IngestsTablesViewComponent } from './ingests-tables-view/ingests-tables-view.component';
import { IngestsPurgedComponent } from './ingests-purged/ingests-purged.component';

import { IngestsInProgressComponent } from './ingests-in-progress/ingests-in-progress.component';
import { IngestsInProgressDetailsComponent } from './ingests-in-progress-details/ingests-in-progress-details.component';
import { IngestsCompletedComponent } from './ingests-completed/ingests-completed.component';
import { IngestsCompletedDetailsComponent } from './ingests-completed-details/ingests-completed-details.component';
import { KaiWaitingComponent } from './ingests-kai/kai-waiting/kai-waiting.component';
import { IngestsKaiComponent } from './ingests-kai/ingests-kai.component';
import { KaiEchecComponent } from './ingests-kai/kai-echec/kai-echec.component';

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
    IngestsPurgedComponent,
    IngestsCompletedComponent,
    IngestsCompletedDetailsComponent,
    KaiWaitingComponent,
    IngestsKaiComponent,
    KaiEchecComponent
  ],
  exports : [
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent
  ]
})

export class IngestsModule {
}
