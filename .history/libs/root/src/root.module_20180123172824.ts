import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';

import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { AccordionDirective } from './accordion/accordion.directive';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class RootModule {
}