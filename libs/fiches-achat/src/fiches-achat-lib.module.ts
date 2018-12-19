import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';
import { SubHeaderModule } from '@ab/sub-header';


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
  declarations: [],
  exports: []
})
export class FichesAchatLibModule {}
