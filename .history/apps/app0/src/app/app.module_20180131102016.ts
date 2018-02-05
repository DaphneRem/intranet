import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { NxModule } from '@nrwl/nx';
import { StoreModule } from '@ngrx/store';


/*********** from app0 **********/
// modules :
import { AppRoutingModule } from './app-routing.module';

// components :
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './users-list/users-list.component';

/*********** from Libs **********/
import { navbarReducer } from '../../../../libs/root/src/+state/navbar.reducer';
import { RootModule } from '../../../../libs/root/index';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsersListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RootModule,
    NxModule.forRoot(),
    StoreModule.forRoot({
      navbar: navbarReducer
    }),
    EffectsModule.forRoot([])
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
