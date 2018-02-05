import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RootModule } from '../../../../libs/root/index';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './users-list/users-list.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { navbarReducer } from '../../../../libs/root/src/+state/navbar.reducer';
import { navbarInitialState } from '../../../../libs/root/src/+state/navbar.init';
import { NavbarEffects } from '../../../../libs/root/src/+state/navbar.effects';

@NgModule({
  declarations: [AppComponent, HomeComponent, UsersListComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RootModule,
    StoreModule.forFeature('navbar', navbarReducer, {
      initialState: navbarInitialState
    }),
    EffectsModule.forFeature([NavbarEffects])
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
