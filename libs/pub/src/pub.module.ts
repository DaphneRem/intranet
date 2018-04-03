import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// libs import
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { LoadersModule } from '@ab/loaders';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// components import
import { PubInProgressComponent } from './pub-tables/pub-in-progress/pub-in-progress.component';
import { PubCompletedComponent } from './pub-tables/pub-completed/pub-completed.component';

// Pages imports
import { PubTablesViewComponent } from './pub-pages/pub-tables-view/pub-tables-view.component';
import { PubWidgetsViewComponent } from './pub-pages/pub-widgets-view/pub-widgets-view.component';
import { PubInProgressDetailsComponent } from './pub-pages/pub-in-progress-details/pub-in-progress-details.component';
import { PubCompletedDetailsComponent } from './pub-pages/pub-completed-details/pub-completed-details.component';

@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    LoadersModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    PubCompletedComponent,
    PubInProgressComponent,
    PubTablesViewComponent,
    PubWidgetsViewComponent,
    PubInProgressDetailsComponent,
    PubCompletedDetailsComponent
  ]
})
export class PubModule {}
