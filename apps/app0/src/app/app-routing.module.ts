import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    IngestsCompletedDetailsComponent,
    IngestsInProgressDetailsComponent,
    IngestsKaiComponent,
    IngestsPurgedComponent,
    IngestsTablesViewComponent,
    IngestsWidgetsViewComponent,
    KarinaWaitingDetailsComponent
} from '@ab/ingests';

import { TraceSegmentComponent } from '@ab/trace-segment';

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
        component: KarinaWaitingDetailsComponent,
        data: { title : 'En attente KARINA' }
      }
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
        data: { title : 'Détails fichier' }
      }
    ]
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

