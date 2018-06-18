import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CustomIconBadgeComponent } from './custom-icon-badge/custom-icon-badge.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [CustomIconBadgeComponent],
  exports: [CustomIconBadgeComponent]
})
export class CustomIconsModule {}
