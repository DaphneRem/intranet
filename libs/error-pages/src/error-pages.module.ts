import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components imports
import { ErrorWidgetComponent } from './error-widget/error-widget.component';
import { Page404Component } from './page-404/page-404.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ErrorWidgetComponent,
    Page404Component
  ],
  exports : [
    Page404Component
  ]
})
export class ErrorPagesModule {
}
