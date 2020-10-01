import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { Adal5Service, Adal5HTTPService } from 'adal-angular5';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { OAuthSettings, config } from './../../../../.privates-url';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/auth.service';

import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { appReducer } from './+state/app.reducer';
import { appInitialState } from './+state/app.init';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { RootModule, navbarReducer } from '@ab/root';
import { SubHeaderModule } from '@ab/sub-header';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateModule } from '@ab/router-state';
import { EffectsModule } from '@ngrx/effects';
import { KPlannerLibModule } from '@ab/k-planner-lib/src/k-planner-lib.module';
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { AppRoutingModule } from './app-routing.module';
import { ErrorPagesModule } from '@ab/error-pages';

registerLocaleData(localeFr, 'fr');

@NgModule({
  imports: [
    BrowserModule,
    KPlannerLibModule,
    AppRoutingModule,
    MsalModule.forRoot({
      clientID: OAuthSettings.appId,
    
      // protectedResourceMap : OAuthSettings.protectedResourceMap,
      authority: OAuthSettings.authority,
      // validateAuthority: true,
    }),
    RootModule,
    ErrorPagesModule,
    StoreModule.forRoot({
      navbar: navbarReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    SubHeaderModule,
    RouterStateModule.forRoot(),
    EffectsModule.forRoot([]),
    HttpClientModule,

    NxModule.forRoot(),
    StoreRouterConnectingModule,
    StoreModule.forRoot(
      { app: appReducer },
      { initialState: { app: appInitialState } }
    )
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' },
    // Adal5Service,
    // {
    //   provide: Adal5HTTPService,
    //   useFactory: Adal5HTTPService.factory,
    //   deps: [HttpClient, Adal5Service]
    // }
    // {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true}
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
