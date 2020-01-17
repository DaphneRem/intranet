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

// Routing Guards
import { CanActivateApp } from './routing-guards/app-guard.interface';
import { CanActivateModification } from './routing-guards/modification-guard.interface';

const routes: Routes = [
  { path: '', redirectTo: 'material-sheets', pathMatch: 'full' },
  {
    path: 'material-sheets',
    canActivate: [CanActivateApp],
    children : [
      {
        path: '',
        component : FichesMaterielWidgetViewComponent,
        data : { title : 'Suivi Fiches Matériel'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-material-sheets/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-material-sheets/modification',
        component : FichesMaterielModificationComponent,
        data : { title : 'Modification Fiche Matériel'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-material-sheets',
        component : MyFichesMaterielComponent,
        data : { title : 'Mes Fiches Matériel En Cours'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-deals-in-progress',
        component : DealInProgressComponent,
        data : { title : 'Mes Deals En Cours'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-deals-in-progress/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'},
        canActivate: [CanActivateModification]
      },
      {
        // path: 'my-material-sheets/archived/:columnIndex/:order',
        path: 'my-material-sheets-archived',
        component: MyFichesMaterielArchivedComponent,
        data: { title: 'Mes Fiches Matériel Archivées' },
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-material-sheets-archived/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-material-sheets-all',
        component: MyFichesMaterielAllComponent,
        data: { title: 'Toutes Mes Fiches Matériel' },
        canActivate: [CanActivateModification]
      },
      {
        path: 'my-material-sheets-all/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'},
        canActivate: [CanActivateModification]
      },
      {
        path: 'all',
        component: FichesMaterielAllComponent,
        data: { title: 'Toutes les Fiches Matériel' },
        canActivate: [CanActivateApp]
      },
      {
        path: 'all/details/:idFicheMateriel/:idFicheAchat/:idFicheAchatDetail',
        component : FicheMaterielDetailsComponent,
        data : { title : 'Détails Fiche Matériel'},
        canActivate: [CanActivateApp]
      },
    ]
  },
  {
    path: 'creation',
    component: FichesMaterielCreationComponent,
    data: { title : 'Création Fiches Matériel' },
    canActivate: [CanActivateApp, CanActivateModification]
  },
  {
    path: 'displaying-purchase-sheets',
    component: DisplayFichesAchatsComponent,
    data: { title : 'Fiches Achat' },
    canActivate: [CanActivateApp]
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, CanActivateModification, CanActivateApp]
})
export class AppRoutingModule {}

