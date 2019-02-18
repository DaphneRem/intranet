import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { urlKPlanner,  urlPlanningEventsByidContainer, urlPlanningEventsByidGroup } from ".privates-url";
import { Workorder } from "../models/workorder";


@Injectable()
export class WorkOrderService {
  constructor(private http: HttpClient) {}


getWorkOrderByContainerId(id: number): Observable<Workorder[]> { //GET /PlanningEvents/idcontainer/{idcontainer}
  return this.http
  .get(urlKPlanner + urlPlanningEventsByidContainer + id)
  .map((res: any) => {
    
    return res as Workorder[];
  });
}

getWorkOrderByidGroup(idGroup: number): Observable<Workorder[]> { //GET /PlanningEvents/backlog/idgroupe//{idgroupe}
return this.http
.get(urlKPlanner + urlPlanningEventsByidGroup + idGroup)
.map((res: any) => {

  return res as Workorder[];
  
});
}



}