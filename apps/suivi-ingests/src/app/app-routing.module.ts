import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {
    IngestsCompletedDetailsComponent,
    IngestsInProgressDetailsComponent,
    IngestsKaiComponent,
    IngestsPurgedComponent,
    IngestsTablesViewComponent,
    IngestsWidgetsViewComponent,
    KarinaWaitingDetailsComponent
} from '@ab/ingests';
import { Page404Component } from '@ab/error-pages';
import {
  PlaylistsAllDetailsComponent,
  PlaylistsErrorsDetailsComponent,
  PlaylistsTablesViewComponent,
  PlaylistsWidgetsViewComponent,
} from '@ab/playlists';
import { PubCompletedDetailsComponent, PubInProgressDetailsComponent, PubTablesViewComponent, PubWidgetsViewComponent } from '@ab/pub';
import { TraceSegmentComponent } from '@ab/trace-segment';

const routes: Routes = [

  { path: '', redirectTo: 'ingests', pathMatch: 'full' },
  {
    path: 'ingests',
    children :
    [
      {
        path: '',
        component: IngestsTablesViewComponent,
        data: { title : 'Numérisation' },
      },
      // {
      //   path: 'tables-view',
      //   component:  IngestsTablesViewComponent,
      //   data: { title : 'Numérisation' },
      // },
      // {
      //   path: 'in-progress',
      //   component: IngestsInProgressDetailsComponent,
      //   data: { title : 'Fichiers en cours de traitement' }
      // },
      {
        path: 'completed',
        component: IngestsCompletedDetailsComponent,
        data: { title : 'Fichiers Terminés' }
      },
      // {
      //   path: 'kai-waiting',
      //   component:  IngestsKaiComponent,
      //   data: { title : 'Numérisation KAI' }
      // },
      // {
      //   path: 'karina-waiting',
      //   component: KarinaWaitingDetailsComponent,
      //   data: { title : 'En attente KARINA' }
      // }
    ]
  },
  {
    path: 'detail-file',
    component: TraceSegmentComponent,
    data: { title : 'Détails fichier' },
    children : [
      {
        path: 'support/:idSupport/seg/:numSegment',
        component: TraceSegmentComponent,
      }
    ]
  },
  {
    path: 'advertising',
    children : [
      // {
      //   path: '',
      //   component: PubWidgetsViewComponent,
      //   data: { title : 'Publicité' }
      // },
      // {
      //   path: 'tables-view',
      //   component: PubTablesViewComponent,
      //   data: { title : 'Publicité' }
      // },
      {
        path: '',
        component: PubTablesViewComponent,
        data: { title : 'Publicité' }
      },
      // {
      //   path: 'in-progress',
      //   component: PubInProgressDetailsComponent,
      //   data: { title : 'Publicités en cours de traitement' }
      // },
      {
        path: 'completed',
        component: PubCompletedDetailsComponent,
        data: { title : 'Publicités Terminés' }
      },
    ]
  },
  {
    path: 'purged',
    component: IngestsPurgedComponent,
    data: { title : 'Fichiers purgés' }
  },
  {
    path: 'playlists',
    children :
    [
      {
        path: '',
        component: PlaylistsWidgetsViewComponent,
        data: { title : 'Playlists' }
      },
      {
        path: 'tables-view',
        component: PlaylistsTablesViewComponent,
        data: { title : 'Playlists' }

      },
      {
        path: 'errors',
        component: PlaylistsErrorsDetailsComponent,
        data: { title : 'Erreurs Playlists' }
      },
      {
        path: 'all',
        component: PlaylistsAllDetailsComponent,
        data: { title : 'Toutes les Playlists' }
      }
    ]
  },
  { path: '**', component: Page404Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})

export class AppRoutingModule { }

