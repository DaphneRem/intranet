import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';

import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';

import { AppRoutingModule} from './app-routing.module';
import { DiffusionsDatesModule } from 'libs/diffusions-dates/src/diffusions-dates.module';

import { RootModule, navbarReducer } from '@ab/root';
import { RouterStateModule } from '@ab/router-state';
import { SubHeaderModule } from '@ab/sub-header';

import { CustomDatatablesModule } from '@ab/custom-datatables';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    RootModule,
    StoreModule.forRoot({
      navbar: navbarReducer,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    SubHeaderModule,
    RouterStateModule.forRoot(),
    EffectsModule.forRoot([]),
    DiffusionsDatesModule,
    NxModule.forRoot(),
    HttpClientModule,
    CustomDatatablesModule
  ],
  providers: [HttpClientModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
