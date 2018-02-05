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
import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './users-list/users-list.component';

/*********** from Libs **********/
import { navbarReducer } from '../../../../libs/root/src/+state/navbar.reducer';
import { RootModule } from '../../../../libs/root/index';
import { RouterStateModule } from '../../../../libs/router-state';

@NgModule({
  declarations: [AppComponent, HomeComponent, UsersListComponent],
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
    })
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
