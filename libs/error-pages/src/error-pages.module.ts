import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components imports
import { ErrorWidgetComponent } from './error-widget/error-widget.component';
import { Page404Component } from './page-404/page-404.component';
import { Page403Component } from './page-403/page-403.component';
import { Page403AppComponent } from './page-403-app/page-403-app.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ErrorWidgetComponent,
    Page404Component,
    Page403Component,
    Page403AppComponent
  ],
  exports : [
    Page404Component,
    Page403Component,
    Page403AppComponent
  ]
})
export class ErrorPagesModule {
}
