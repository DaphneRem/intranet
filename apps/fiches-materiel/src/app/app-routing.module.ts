import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {
    IngestsCompletedDetailsComponent,
    IngestsInProgressDetailsComponent,
    IngestsKaiComponent,
    IngestsPurgedComponent,
    IngestsTablesViewComponent,
    IngestsWidgetsViewComponent,
    KarinaWaitingDetailsComponent
} from '@ab/ingests';
import { Page404Component } from '@ab/error-pages';
import {
  PlaylistsAllDetailsComponent,
  PlaylistsErrorsDetailsComponent,
  PlaylistsTablesViewComponent,
  PlaylistsWidgetsViewComponent,
} from '@ab/playlists';
import { PubCompletedDetailsComponent, PubInProgressDetailsComponent, PubTablesViewComponent, PubWidgetsViewComponent } from '@ab/pub';
import { TraceSegmentComponent } from '@ab/trace-segment';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})

export class AppRoutingModule { }

