
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// external imports
import { ClickOutsideModule } from 'ng-click-outside';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

// components
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';

// directives
import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { AccordionDirective } from './accordion/accordion.directive';

// +state
import { navbarReducer } from './+state/navbar.reducer';
import { navbarInitialState } from './+state/navbar.init';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ClickOutsideModule,
    CommonModule,
    HttpClientModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    RouterModule,
    StoreModule.forFeature('navbar', navbarReducer, {
      initialState: navbarInitialState
    })
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionDirective,
    AccordionLinkDirective,
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
  ],
  exports: [
    ClickOutsideModule,
    FooterComponent,
    HeaderComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class RootModule {}
