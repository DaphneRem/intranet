import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubHeaderComponent } from './sub-header/sub-header.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SubHeaderComponent
  ],
  exports : [
    SubHeaderComponent
  ]
})
export class SubHeaderModule {
}
