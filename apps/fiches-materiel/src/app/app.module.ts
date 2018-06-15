import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID, } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

/*********** from fiches-materiel **********/

// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';

/*********** from Libs **********/

import { RouterStateModule } from '@ab/router-state';
import { RootModule, navbarReducer } from '@ab/root';
import { SubHeaderModule } from '@ab/sub-header';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    EffectsModule.forRoot([]),
    HttpClientModule,
    NxModule.forRoot(),
    RootModule,
    SubHeaderModule,
    StoreModule.forRoot({
      navbar: navbarReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    RouterStateModule.forRoot()
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
