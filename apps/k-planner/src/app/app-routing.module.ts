import { NgModule } from '@angular/core';
import { RouterModule, Route, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MonPlanningComponent } from '@ab/k-planner-lib/src/kplanner-pages/mon-planning/mon-planning.component';
import { Page404Component } from '@ab/error-pages';
import { LoaderAnimationComponent } from '@ab/loaders/src/loader-animation/loader-animation.component';
import { config } from '.privates-url';

const routes: Routes = [
    { path: '', redirectTo: 'k-planner', pathMatch: 'full'},
    {
      path: 'k-planner',
      children :
        [
          {
            path: '',
            component: MonPlanningComponent,
            data : { title : 'Mon planning'}
          }
        ]
      },
      { path: '**', component: Page404Component },
      // { path: '**', component: LoaderAnimationComponent  },
      // { path: config.tenant , component: LoaderAnimationComponent  },
      // { path: config.clientId , component: LoaderAnimationComponent  },
      // { path: config.redirectUri , component: LoaderAnimationComponent  },
    ];




@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
  })
export class AppRoutingModule {}