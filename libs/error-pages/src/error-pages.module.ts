import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components imports
import { ErrorWidgetComponent } from './error-widget/error-widget.component';
import { Page404Component } from './page-404/page-404.component';
import { Page403Component } from './page-403/page-403.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ErrorWidgetComponent,
    Page404Component,
    Page403Component,
  ],
  exports : [
    Page404Component,
    Page403Component
  ]
})
export class ErrorPagesModule {
}
