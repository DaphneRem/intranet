import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { Page404Component } from '@ab/error-pages';
import {
  MyFichesMaterielArchivedComponent,
  FichesMaterielCreationComponent,
  FicheMaterielDetailsComponent,
  FichesMaterielModificationComponent,
  FichesMaterielWidgetViewComponent,
  DisplayFichesAchatsComponent,
  MyFichesMaterielComponent,
  MyFichesMaterielAllComponent,
  FichesMaterielAllComponent
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
        path: 'my-material-sheets/details/:idFicheMateriel/:idFicheAchatDetails',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        path: 'my-material-sheets/modification',
        component : FichesMaterielModificationComponent,
        data : { title : 'Modification Fiche Matériel'}
      },
      {
        path: 'my-material-sheets/:columnIndex/:order',
        component : MyFichesMaterielComponent,
        data : { title : 'Mes Fiches Matériel En Cours'}
      },
      {
        path: 'my-material-sheets/archived/:columnIndex/:order',
        component: MyFichesMaterielArchivedComponent,
        data: { title: 'Mes Fiches Matériel Archivées' }
      },
      {
        path: 'my-material-sheets/archived/details/:idFicheMateriel/:idFicheAchatDetails',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        path: 'my-material-sheets/all/:columnIndex/:order',
        component: MyFichesMaterielAllComponent,
        data: { title: 'Toutes Mes Fiches Matériel' }
      },
      {
        path: 'my-material-sheets/all/details/:idFicheMateriel/:idFicheAchatDetails',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        path: 'all/:columnIndex/:order',
        component: FichesMaterielAllComponent,
        data: { title: 'Toutes les Fiches Matériel' }
      },
      {
        path: 'all/details/:idFicheMateriel/:idFicheAchatDetails',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
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

