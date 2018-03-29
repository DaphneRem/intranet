import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components imports
import { WidgetDataComponent } from './widget-data/widget-data.component';
import { WidgetLinkComponent } from './widget-link/widget-link.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    WidgetDataComponent,
    WidgetLinkComponent
  ],
  exports : [
    WidgetDataComponent,
    WidgetLinkComponent
  ]
})
export class WidgetsModule {
}
