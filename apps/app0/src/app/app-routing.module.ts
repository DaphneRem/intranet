import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersListComponent } from './users-list/users-list.component';

import {
  IngestsWidgetsViewComponent,
  IngestsTablesViewComponent,
  IngestsPurgedComponent,
  IngestsInProgressDetailsComponent,
  IngestsCompletedDetailsComponent,
  IngestsKaiComponent
} from '@ab/ingests';

const routes: Routes = [
  { path: '*', component: IngestsWidgetsViewComponent },
  { path: '', redirectTo: 'ingests', pathMatch: 'full' },
  {
    path: 'ingests',
    children :
    [
      {
        path: '',
        children :
        [
          {
            path: '',
            component: IngestsWidgetsViewComponent,
            data: { title : 'Numérisation' },
          },
          {
            path: 'tables-view',
            component:  IngestsTablesViewComponent,
            data: { title : 'Numérisation' },

          }
        ]
      },
      {
        path: 'in-progress',
        component: IngestsInProgressDetailsComponent,
        data: { title : 'Fichiers en cours de traitement' }
      },
      {
        path: 'completed',
        component: IngestsCompletedDetailsComponent,
        data: { title : 'Fichiers Terminés' }
      },
      {
        path: 'kai-waiting',
        component:  IngestsKaiComponent,
        data: { title : 'Numérisation KAI' }
      },
      {
        path: 'karina-waiting',
        component: UsersListComponent,
        data: { title : 'En attente KARINA' }
      }
    ]
  },
  {
    path: 'detail-file',
    component: UsersListComponent,
    data: { title : 'Détails fichier' }

  },
  {
    path: 'purged',
    component: IngestsPurgedComponent,
    data: { title : 'Fichiers purgés' }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

