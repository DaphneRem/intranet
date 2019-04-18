import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID, } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MsalModule } from '@azure/msal-angular';
import { OAuthSettings } from './../../../../.privates-url';
// import { Adal5HTTPService, Adal5Service } from 'adal-angular5';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

/*********** from fiches-materiel **********/

// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';

/*********** from Libs **********/

import { ErrorPagesModule } from '@ab/error-pages';
import { FichesMaterielLibModule } from '@ab/fiches-materiel';
import { RouterStateModule } from '@ab/router-state';
import { RootModule, navbarReducer } from '@ab/root';
import { SubHeaderModule } from '@ab/sub-header';
import { appReducer } from './+state/app.reducer';
import { appInitialState } from './+state/app.init';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    MsalModule.forRoot({
      clientID: OAuthSettings.appId
    }),
    BrowserModule,
    EffectsModule.forRoot([]),
    ErrorPagesModule,
    FichesMaterielLibModule,
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
    RouterStateModule.forRoot(),
    StoreModule.forRoot(
      { app: appReducer },
      { initialState: { app: appInitialState } }
    ),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    // Adal5Service,
    // {
    //   provide: Adal5HTTPService,
    //   useFactory: Adal5HTTPService.factory,
    //   deps: [HttpClient, Adal5Service]
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
