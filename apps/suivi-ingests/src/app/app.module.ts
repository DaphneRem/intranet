import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID, } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

/*********** from suivi-ingests **********/

// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';

/*********** from Libs **********/

import { CustomDatatablesModule } from '@ab/custom-datatables';
import { ErrorPagesModule } from '@ab/error-pages';
import { IngestsModule } from '@ab/ingests';
import { PlaylistsModule } from '@ab/playlists';
import { PubModule } from '@ab/pub';
import { RouterStateModule } from '@ab/router-state';
import { RootModule, navbarReducer } from '@ab/root';
import { SubHeaderModule } from '@ab/sub-header';
import { TraceSegmentModule, lastSearchReducer } from '@ab/trace-segment';
import { WidgetsModule } from '@ab/widgets';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CustomDatatablesModule,
    EffectsModule.forRoot([]),
    ErrorPagesModule,
    HttpClientModule,
    IngestsModule,
    NxModule.forRoot(),
    PlaylistsModule,
    PubModule,
    RootModule,
    RouterStateModule.forRoot(),
    StoreModule.forRoot({
      navbar: navbarReducer,
      lastSearch: lastSearchReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    SubHeaderModule,
    TraceSegmentModule,
    WidgetsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
