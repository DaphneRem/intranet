import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


/*********** from app0 **********/
// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';
import { ScanComponent } from './scan/scan.component';
import { UsersListComponent } from './users-list/users-list.component';

/*********** from Libs **********/

import { RootModule, navbarReducer } from '@ab/root';
import { RouterStateModule } from '@ab/router-state';
import { WidgetsModule } from '@ab/widgets';
import { SubHeaderModule } from '@ab/sub-header';


@NgModule({
  declarations: [
    AppComponent,
    ScanComponent,
    UsersListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    EffectsModule.forRoot([]),
    NxModule.forRoot(),
    RootModule,
    RouterStateModule.forRoot(),
    StoreModule.forRoot({
      navbar: navbarReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    SubHeaderModule,
    WidgetsModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
