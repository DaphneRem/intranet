import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

// lib imports
import { LoadersModule } from '@ab/loaders';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// components imports
import { TraceSegmentComponent } from './trace-segment/trace-segment.component';
import { SupportSegmentComponent } from './support-segment/support-segment.component';
import { InfoTraitemantKaiComponent } from './info-traitemant-kai/info-traitemant-kai.component';
import { SupportSearchComponent } from './support-search/support-search.component';
import { StepInProcessComponent } from './step-in-process/step-in-process.component';

// +state
import { lastSearchReducer } from './support-search/+state/support-search.reducer';
import { lastSearchInitialState } from './support-search/+state/support-search.init';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadersModule,
    NgbModule,
    RouterModule,
    StoreModule.forFeature('lastSearch', lastSearchReducer, {
      initialState: lastSearchInitialState
    }),
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    SupportSegmentComponent,
    TraceSegmentComponent,
    InfoTraitemantKaiComponent,
    SupportSearchComponent,
    StepInProcessComponent
  ]
})
export class TraceSegmentModule {}
