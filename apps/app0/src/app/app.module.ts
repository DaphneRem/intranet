import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
// import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

/*********** from app0 **********/
// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';
import { UsersListComponent } from './users-list/users-list.component';

/*********** from Libs **********/
import { CustomDatatablesModule } from '@ab/custom-datatables';

import { RootModule, navbarReducer } from '@ab/root';
import { RouterStateModule } from '@ab/router-state';
import { IngestsModule } from '@ab/ingests';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

@NgModule({
  declarations:
  [
    AppComponent,
    UsersListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CustomDatatablesModule,
    EffectsModule.forRoot([]),
    HttpModule,
    NxModule.forRoot(),
    RootModule,
    RouterStateModule.forRoot(),
    IngestsModule,
    StoreModule.forRoot({
      navbar: navbarReducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    SubHeaderModule,
    WidgetsModule
  ],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
