import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule
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
