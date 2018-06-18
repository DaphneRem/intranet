import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FichesMaterielCreationComponent } from './fiches-materiel-pages/fiches-materiel-creation/fiches-materiel-creation.component';
import { SubHeaderModule } from '@ab/sub-header';

@NgModule({
  imports: [
    CommonModule,
    SubHeaderModule
  ],
  declarations: [
    FichesMaterielCreationComponent
  ]
})
export class FichesMaterielLibModule {
}
