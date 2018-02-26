import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// lib imports
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';
// components imports
import { TraceSegmentComponent } from './trace-segment/trace-segment.component';
import { CurrentStepComponent } from './current-step/current-step.component';
import { SupportSegmentComponent } from './support-segment/support-segment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    CurrentStepComponent,
    SupportSegmentComponent,
    TraceSegmentComponent
  ]
})
export class TraceSegmentModule {}
