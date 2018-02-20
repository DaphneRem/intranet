import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { RouterModule } from '@angular/router';

import { CustomDatatablesComponent } from './custom-datatables/custom-datatables.component';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
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
