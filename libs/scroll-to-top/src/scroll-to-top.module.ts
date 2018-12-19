import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// external libs imports
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components imports
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [
    ScrollToTopComponent
  ],
  exports : [
    ScrollToTopComponent
  ]
})
export class ScrollToTopModule {
}
