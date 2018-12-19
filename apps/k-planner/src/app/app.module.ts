import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { Adal5Service, Adal5HTTPService } from 'adal-angular5';
import { HttpClient, HttpClientModule } from '@angular/common/http';


import { RootModule, navbarReducer } from '@ab/root';
import { SubHeaderModule } from '@ab/sub-header';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateModule } from '@ab/router-state';
import { appReducer } from 'apps/fiches-materiel/src/app/+state/app.reducer';
import { appInitialState } from 'apps/fiches-materiel/src/app/+state/app.init';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { KPlannerLibModule } from '@ab/k-planner-lib/src/k-planner-lib.module';
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { AppRoutingModule } from './app-routing.module';
import { ErrorPagesModule } from '@ab/error-pages';


@NgModule({
  imports: [
  BrowserModule,
  KPlannerLibModule,
  AppRoutingModule,
  RootModule,
  SubHeaderModule,
  ErrorPagesModule,
  
  StoreModule.forRoot({
    navbar: navbarReducer,
  }),
  StoreDevtoolsModule.instrument({

    maxAge: 25 // Retains last 25 states
  }),
  SubHeaderModule,
  RouterStateModule.forRoot(),
  EffectsModule.forRoot([]),
  HttpClientModule,
  CustomDatatablesModule,
  NxModule.forRoot()],


  providers: [

    { provide: LOCALE_ID, useValue: 'fr' },
    Adal5Service,
    { provide: Adal5HTTPService, useFactory: Adal5HTTPService.factory, deps: [HttpClient, Adal5Service] }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }