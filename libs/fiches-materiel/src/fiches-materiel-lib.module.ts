import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// lib imports
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';
import { CustomIconsModule } from '@ab/custom-icons';

// components imports
import { FichesMaterielCreationComponent } from './fiches-materiel-pages/fiches-materiel-creation/fiches-materiel-creation.component';
import {
  FichesMaterielWidgetViewComponent
} from './fiches-materiel-pages/fiches-materiel-widget-view/fiches-materiel-widget-view.component';
import { DisplayFichesAchatsComponent } from './fiches-materiel-pages/display-fiches-achats/display-fiches-achats.component';
import { MyFichesMaterielComponent } from './fiches-materiel-pages/my-fiches-materiel/my-fiches-materiel.component';
import { SearchFormComponent } from './search-form/search-form.component';

@NgModule({
  imports: [
    CommonModule,
    CustomIconsModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    FichesMaterielCreationComponent,
    FichesMaterielWidgetViewComponent,
    DisplayFichesAchatsComponent,
    MyFichesMaterielComponent,
    SearchFormComponent
  ]
})
export class FichesMaterielLibModule {
}
