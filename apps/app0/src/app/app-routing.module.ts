import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScanComponent } from './scan/scan.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  { path: '*', component: ScanComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ScanComponent },
  { path: 'users', component: UsersListComponent },

  {
    path: 'scan',
    component: ScanComponent,
    data: { title : 'Numérisation' }
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

