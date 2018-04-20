import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// lib Imports
import { CustomDatatablesModule } from '@ab/custom-datatables';
import { LoadersModule } from '@ab/loaders';
import { NotificationsModule } from '@ab/notifications';
import { ScrollToTopModule } from '@ab/scroll-to-top';
import { SubHeaderModule } from '@ab/sub-header';
import { WidgetsModule } from '@ab/widgets';

// pages import
import { PlaylistsAllDetailsComponent } from './playlists-pages/playlists-all-details/playlists-all-details.component';
import { PlaylistsErrorsDetailsComponent } from './playlists-pages/playlists-errors-details/playlists-errors-details.component';
import { PlaylistsTablesViewComponent } from './playlists-pages/playlists-tables-view/playlists-tables-view.component';
import { PlaylistsWidgetsViewComponent } from './playlists-pages/playlists-widgets-view/playlists-widgets-view.component';

// components import
import { PlaylistsErrorsTableComponent } from './playlists-tables/playlists-errors-table/playlists-errors-table.component';

@NgModule({
  imports: [
    CommonModule,
    LoadersModule,
    NotificationsModule,
    ScrollToTopModule,
    SubHeaderModule,
    WidgetsModule
  ],
  declarations: [
    PlaylistsAllDetailsComponent,
    PlaylistsErrorsTableComponent,
    PlaylistsErrorsDetailsComponent,
    PlaylistsTablesViewComponent,
    PlaylistsWidgetsViewComponent
  ],
  exports: [
    PlaylistsAllDetailsComponent,
    PlaylistsErrorsDetailsComponent,
    PlaylistsErrorsTableComponent,
    PlaylistsTablesViewComponent,
    PlaylistsWidgetsViewComponent
  ]
})
export class PlaylistsModule {}
