import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import external lib
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import lib
import { ChangeViewComponent } from './buttons/change-view/change-view.component';
import { GoBackComponent } from './buttons/go-back/go-back.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  declarations: [
    ChangeViewComponent,
    GoBackComponent,
    SubHeaderComponent
  ],
  exports : [
    ChangeViewComponent,
    SubHeaderComponent
  ]
})
export class SubHeaderModule {
}
