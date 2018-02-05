import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RootModule } from '../../../../libs/root/index';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './users-list/users-list.component';


@NgModule({
  declarations: [
    // AppComponent,
    // HomeComponent,
    // UsersListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    // RootModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }