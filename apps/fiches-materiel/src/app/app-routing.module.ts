import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { Page404Component } from '@ab/error-pages';
import {
  FichesMaterielCreationComponent,
  FichesMaterielWidgetViewComponent,
  DisplayFichesAchatsComponent,
  MyFichesMaterielComponent
} from '@ab/fiches-materiel';

const routes: Routes = [
  { path: '', redirectTo: 'material-sheets', pathMatch: 'full' },
  {
    path: 'material-sheets',
    children : [
      {
        path: '',
        component : FichesMaterielWidgetViewComponent,
        data : { title : 'Suivi Fiches Matériel'}
      },
      {
        path: 'my-material-sheets',
        component : MyFichesMaterielComponent,
        data : { title : 'Mes Fiches Matériel'}
      }
    ]
  },
  {
    path: 'creation',
    component: FichesMaterielCreationComponent,
     data: { title : 'Création Fiches Matériel' }
  },
  {
    path: 'displaying-purchase-sheets',
    component: DisplayFichesAchatsComponent,
     data: { title : 'Fiches Achat' }
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule {}

