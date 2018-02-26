import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

/*********** from app0 **********/

// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';

/*********** from Libs **********/

import { CustomDatatablesModule } from '@ab/custom-datatables';
import { IngestsModule } from '@ab/ingests';
import { RouterStateModule } from '@ab/router-state';
import { RootModule, navbarReducer } from '@ab/root';
import { SubHeaderModule } from '@ab/sub-header';
import { TraceSegmentModule } from '@ab/trace-segment';
import { WidgetsModule } from '@ab/widgets';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CustomDatatablesModule,
    EffectsModule.forRoot([]),
    HttpClientModule,
    IngestsModule,
    NxModule.forRoot(),
    RootModule,
    RouterStateModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    StoreModule.forRoot({
      navbar: navbarReducer,
    }),
    SubHeaderModule,
    TraceSegmentModule,
    WidgetsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
