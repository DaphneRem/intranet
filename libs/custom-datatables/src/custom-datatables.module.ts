import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// external imports
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoadersModule } from '@ab/loaders';

// components imports
import { CustomDatatablesComponent } from './custom-datatables/custom-datatables.component';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    NgbModule,
    LoadersModule,
    RouterModule
  ],
  declarations: [
    CustomDatatablesComponent
  ],
  exports : [
    DataTablesModule,
    CustomDatatablesComponent
  ]
})
export class CustomDatatablesModule {
}
