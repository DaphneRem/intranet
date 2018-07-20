import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';
import { SubHeaderModule } from '@ab/sub-header';
import { FichesAchatTableComponent } from './fiches-achat-table/fiches-achat-table.component';

@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    CustomIconsModule,
    FormsModule,
    LoadersModule,
    ModalsModule,
    SubHeaderModule
  ],
  declarations: [FichesAchatTableComponent],
  exports: [FichesAchatTableComponent]
})
export class FichesAchatLibModule {}
