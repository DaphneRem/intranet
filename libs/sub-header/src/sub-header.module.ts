import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChangeViewComponent } from './buttons/change-view/change-view.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { GoBackComponent } from './buttons/go-back/go-back.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ChangeViewComponent,
    SubHeaderComponent,
    GoBackComponent
  ],
  exports : [
    ChangeViewComponent,
    SubHeaderComponent
  ]
})
export class SubHeaderModule {
}
