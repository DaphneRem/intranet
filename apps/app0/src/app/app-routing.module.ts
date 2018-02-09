import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersListComponent } from './users-list/users-list.component';

import { IngestsWidgetsViewComponent, IngestsTablesViewComponent } from '@ab/ingests';

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
        component: UsersListComponent,
        data: { title : 'En cours de traitement' }
      },
      {
        path: 'completed',
        component: UsersListComponent,
        data: { title : 'Terminés' }
      },
      {
        path: 'kai-waiting',
        component: UsersListComponent,
        data: { title : 'En attente KAI' }
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
    component: UsersListComponent,
    data: { title : 'Fichiers purgés' }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

