import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// lib imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { CustomIconsModule } from '@ab/custom-icons';
import { LoadersModule } from '@ab/loaders';
import { ModalsModule } from '@ab/modals';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// components imports
import { FichesMaterielCreationComponent } from './fiches-materiel-pages/fiches-materiel-creation/fiches-materiel-creation.component';
import {
  FichesMaterielWidgetViewComponent
} from './fiches-materiel-pages/fiches-materiel-widget-view/fiches-materiel-widget-view.component';
import { DisplayFichesAchatsComponent } from './fiches-materiel-pages/display-fiches-achats/display-fiches-achats.component';
import { MyFichesMaterielComponent } from './fiches-materiel-pages/my-fiches-materiel/my-fiches-materiel.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { FichesAchatsTableComponent } from './fiches-materiel-tables/fiches-achats-table/fiches-achats-table.component';
import { ModalRecapFicheAchatComponent } from './modal-recap-fiche-achat/modal-recap-fiche-achat.component';

@NgModule({
  imports: [
    CommonModule,
    CustomDatatablesModule,
    CustomIconsModule,
    LoadersModule,
    ModalsModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    FichesMaterielCreationComponent,
    FichesMaterielWidgetViewComponent,
    DisplayFichesAchatsComponent,
    MyFichesMaterielComponent,
    SearchFormComponent,
    FichesAchatsTableComponent,
    ModalRecapFicheAchatComponent
  ]
})
export class FichesMaterielLibModule {
}
