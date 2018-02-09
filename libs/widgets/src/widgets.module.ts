import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLinkComponent } from './widget-link/widget-link.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    WidgetLinkComponent
  ],
  exports : [
    WidgetLinkComponent
  ]
})
export class WidgetsModule {
}
