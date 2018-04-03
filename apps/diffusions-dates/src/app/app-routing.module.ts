import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import { DiffusionsDatesTableComponent} from 'libs/diffusions-dates/src/diffusions-dates-table/diffusions-dates-table.component';

const routes: Routes = [
  { path: '*', component: DiffusionsDatesTableComponent },
  { path: '', redirectTo: 'diffusions-dates', pathMatch: 'full' },
  {
    path: 'diffusions-dates',
    children :
    [
      {
        path: '',
        component: DiffusionsDatesTableComponent,
        data: { title : 'Dates Diffusions' }
      },
      {
        path: 'diffusions-dates',
        component: DiffusionsDatesTableComponent,
        data: { title : 'Dates Diffusions' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})

export class AppRoutingModule { }

