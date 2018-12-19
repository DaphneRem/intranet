import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// lib Imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { LoadersModule } from '@ab/loaders';
import { ScrollToTopModule } from '@ab/scroll-to-top';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// pages imports
import { IngestsCompletedDetailsComponent } from './ingests-pages/ingests-completed-details/ingests-completed-details.component';
import { IngestsInProgressDetailsComponent } from './ingests-pages/ingests-in-progress-details/ingests-in-progress-details.component';
import { IngestsPurgedComponent } from './ingests-tables/ingests-purged/ingests-purged.component';
import { IngestsTablesViewComponent } from './ingests-pages/ingests-tables-view/ingests-tables-view.component';
import { IngestsWidgetsViewComponent } from './ingests-pages/ingests-widgets-view/ingests-widgets-view.component';

// components imports
import { IngestsCompletedComponent } from './ingests-tables/ingests-completed/ingests-completed.component';
import { IngestsInProgressComponent } from './ingests-tables/ingests-in-progress/ingests-in-progress.component';
import { IngestsKaiComponent } from './ingests-kai/ingests-kai.component';
import { KaiEchecComponent } from './ingests-kai/kai-echec/kai-echec.component';
import { KaiWaitingComponent } from './ingests-kai/kai-waiting/kai-waiting.component';
import { KarinaWaitingComponent } from './ingests-tables/karina-waiting/karina-waiting.component';
import { KarinaWaitingDetailsComponent } from './ingests-pages/karina-waiting-details/karina-waiting-details.component';
import { IngestsErrorsComponent } from './ingests-tables/ingests-errors/ingests-errors.component';

@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    LoadersModule,
    ScrollToTopModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    IngestsCompletedComponent,
    IngestsInProgressComponent,
    IngestsKaiComponent,
    IngestsPurgedComponent,
    KaiEchecComponent,
    KaiWaitingComponent,
    IngestsCompletedDetailsComponent,
    IngestsInProgressDetailsComponent,
    IngestsPurgedComponent,
    IngestsTablesViewComponent,
    IngestsWidgetsViewComponent,
    KarinaWaitingComponent,
    KarinaWaitingDetailsComponent,
    IngestsErrorsComponent,
  ]
})
export class IngestsModule {}
