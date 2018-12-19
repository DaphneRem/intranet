import { NgModule } from "@angular/core";
import { RouterModule, Route, Routes } from "@angular/router";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { MonPlanningComponent } from "@ab/k-planner-lib/src/kplanner-pages/mon-planning/mon-planning.component";
import { Page404Component } from "@ab/error-pages";





const routes: Routes =[
    { path: '*', component: MonPlanningComponent},
    { path: '', redirectTo: 'k-planner', pathMatch: 'full' },
    {
        path: 'k-planner',
        children :
        [
          {
            path: '',
            component: MonPlanningComponent,
            data : { title : 'Mon planning'}
          },
          
        ]
      },
      { path: '**', component: Page404Component },
    ];




@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
  })
export class AppRoutingModule { }