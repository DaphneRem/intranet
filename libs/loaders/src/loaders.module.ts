import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components imports
import { LoaderAnimationComponent } from './loader-animation/loader-animation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoaderAnimationComponent
  ],
  exports : [
    LoaderAnimationComponent
  ]
})
export class LoadersModule {
}
