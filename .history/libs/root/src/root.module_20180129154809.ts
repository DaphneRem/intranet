import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';

import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { AccordionDirective } from './accordion/accordion.directive';

import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { navbarReducer } from './+state/navbar.reducer';
import { navbarInitialState } from './+state/navbar.init';
import { NavbarEffects } from './+state/navbar.effects';
// import { StoreModule, ReducerManager, ReducerManagerDispatcher } from '@ngrx/store';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    HttpClientModule,
    StoreModule.forFeature('navbar', navbarReducer, {initialState: navbarInitialState}),
    EffectsModule.forFeature([NavbarEffects]),
  ],
  declarations: [
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  exports: [HeaderComponent, FooterComponent, ClickOutsideModule],
  providers: [
    NavbarEffects,
    // {
    //   provide: ReducerManager,
    //   useValue: ReducerManagerDispatcher
    // },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    }
  ]
})
export class RootModule {}