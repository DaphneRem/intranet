import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

import { IngestsWidgetsViewComponent } from './ingests-widgets-view/ingests-widgets-view.component';
import { IngestsTablesViewComponent } from './ingests-tables-view/ingests-tables-view.component';


@NgModule({
  imports: [
    CommonModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent
  ],
  exports : [
    IngestsWidgetsViewComponent,
    IngestsTablesViewComponent
  ]
})
export class IngestsModule {
}
