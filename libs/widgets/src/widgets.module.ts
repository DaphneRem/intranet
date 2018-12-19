import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components imports
import { WidgetDataComponent } from './widget-data/widget-data.component';
import { WidgetErrorComponent } from './widget-error/widget-error.component';
import { WidgetLinkComponent } from './widget-link/widget-link.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    WidgetDataComponent,
    WidgetErrorComponent,
    WidgetLinkComponent,
  ],
  exports : [
    WidgetDataComponent,
    WidgetErrorComponent,
    WidgetLinkComponent
  ]
})
export class WidgetsModule {
}
