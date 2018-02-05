import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ]})
export class RootModule {
}
