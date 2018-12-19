import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';

import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ToastyModule.forRoot()
  ],
  declarations: [NotificationComponent],
  exports: [
    NotificationComponent,
    BrowserModule,
    ToastyModule
  ]
})
export class NotificationsModule {}
