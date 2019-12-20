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
  FichesMaterielAllComponent,
  DealInProgressComponent
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
        path: 'my-material-sheets/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        path: 'my-material-sheets/modification',
        component : FichesMaterielModificationComponent,
        data : { title : 'Modification Fiche Matériel'}
      },
      {
        path: 'my-material-sheets',
        component : MyFichesMaterielComponent,
        data : { title : 'Mes Fiches Matériel En Cours'}
      },
      {
        path: 'my-deals-in-progress',
        component : DealInProgressComponent,
        data : { title : 'Mes Deals En Cours'}
      },
      {
        path: 'my-deals-in-progress/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        // path: 'my-material-sheets/archived/:columnIndex/:order',
        path: 'my-material-sheets-archived',
        component: MyFichesMaterielArchivedComponent,
        data: { title: 'Mes Fiches Matériel Archivées' }
      },
      {
        path: 'my-material-sheets/archived/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        path: 'my-material-sheets/all',
        component: MyFichesMaterielAllComponent,
        data: { title: 'Toutes Mes Fiches Matériel' }
      },
      {
        path: 'my-material-sheets/all/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'}
      },
      {
        path: 'all',
        component: FichesMaterielAllComponent,
        data: { title: 'Toutes les Fiches Matériel' }
      },
      {
        path: 'all/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
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

