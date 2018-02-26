import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLinkComponent } from './widget-link/widget-link.component';
import { RouterModule } from '@angular/router';
import { WidgetDataComponent } from './widget-data/widget-data.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    WidgetLinkComponent,
    WidgetDataComponent
  ],
  exports : [
    WidgetLinkComponent,
    WidgetDataComponent
  ]
})
export class WidgetsModule {
}
