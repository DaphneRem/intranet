import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalAnimationComponent } from './modal-animation/modal-animation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ModalAnimationComponent
  ],
  exports: [
    ModalAnimationComponent
  ]
})
export class ModalsModule {}
