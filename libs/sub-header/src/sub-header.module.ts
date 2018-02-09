import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChangeViewComponent } from './change-view/change-view.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ChangeViewComponent,
    SubHeaderComponent
  ],
  exports : [
    ChangeViewComponent,
    SubHeaderComponent
  ]
})
export class SubHeaderModule {
}
