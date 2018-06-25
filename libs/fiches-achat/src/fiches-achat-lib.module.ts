import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';

import { FichesAchatDetailsComponent } from './fiches-achat-details/fiches-achat-details.component';
import { FichesAchatsTableComponent } from './fiches-achat-tables/fiches-achats-table/fiches-achats-table.component';
import { ModalRecapFicheAchatComponent } from './modal-recap-fiche-achat/modal-recap-fiche-achat.component';
import { CreationFichesMaterielComponent } from './creation-fiches-materiel/creation-fiches-materiel.component';

@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    CustomIconsModule,
    LoadersModule,
    ModalsModule
  ],
  declarations: [
    FichesAchatDetailsComponent,
    FichesAchatsTableComponent,
    ModalRecapFicheAchatComponent,
    CreationFichesMaterielComponent
  ],
  exports: [
    FichesAchatDetailsComponent,
    FichesAchatsTableComponent,
    ModalRecapFicheAchatComponent
  ]
})
export class FichesAchatLibModule {}
