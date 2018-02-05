import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  { path: '*', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UsersListComponent },

  { path: 'scan', component: HomeComponent },
  { path: 'detail-file', component: HomeComponent },
  { path: 'purged', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

