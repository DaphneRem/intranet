import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { FichesAchatLibModule } from '@ab/fiches-achat';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// components pages imports
import { DisplayFichesAchatsComponent } from './fiches-materiel-pages/display-fiches-achats/display-fiches-achats.component';
import { FichesMaterielCreationComponent } from './fiches-materiel-pages/fiches-materiel-creation/fiches-materiel-creation.component';
import {
  FichesMaterielWidgetViewComponent } from './fiches-materiel-pages/fiches-materiel-widget-view/fiches-materiel-widget-view.component';
import { MyFichesMaterielComponent } from './fiches-materiel-pages/my-fiches-materiel/my-fiches-materiel.component';

// components tables imports
import { FichesAchatTableComponent } from './fiches-achat-table/fiches-achat-table.component';
import { FichesMaterielTableComponent } from './fiches-materiel-tables/fiches-materiel-table/fiches-materiel-table.component';

// components modals imports
import { CreationFichesMaterielComponent } from './creation-modal/creation-fiches-materiel/creation-fiches-materiel.component';
import {
  CreativeFormFichesMaterielComponent } from './creation-modal/creative-form-fiches-materiel/creative-form-fiches-materiel.component';
import { FichesAchatDetailsComponent } from './creation-modal/fiches-achat-details/fiches-achat-details.component';
import { ModalFicheAchatDetailComponent } from './modal-fiche-achat-detail/modal-fiche-achat-detail.component';
import { ModalRecapFicheAchatComponent } from './creation-modal/modal-recap-fiche-achat/modal-recap-fiche-achat.component';

import { SearchFormComponent } from './search-form/search-form.component';


@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    CustomIconsModule,
    FichesAchatLibModule,
    FormsModule,
    LoadersModule,
    ModalsModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    CreativeFormFichesMaterielComponent,
    CreationFichesMaterielComponent,
    DisplayFichesAchatsComponent,
    FichesAchatDetailsComponent,
    FichesAchatTableComponent,
    FichesMaterielCreationComponent,
    FichesMaterielTableComponent,
    FichesMaterielWidgetViewComponent,
    ModalFicheAchatDetailComponent,
    ModalRecapFicheAchatComponent,
    MyFichesMaterielComponent,
    SearchFormComponent
  ],
  exports: [
    CreativeFormFichesMaterielComponent,
    CreationFichesMaterielComponent,
    DisplayFichesAchatsComponent,
    FichesAchatDetailsComponent,
    FichesAchatTableComponent,
    FichesMaterielCreationComponent,
    FichesMaterielTableComponent,
    FichesMaterielWidgetViewComponent,
    ModalFicheAchatDetailComponent,
    ModalRecapFicheAchatComponent,
    MyFichesMaterielComponent,
    SearchFormComponent
  ]
})
export class FichesMaterielLibModule {}
