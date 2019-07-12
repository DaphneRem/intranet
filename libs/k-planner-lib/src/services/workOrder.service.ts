import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import {
  urlKPlanner,
  urlPlanningEventsByidContainer,
  urlPlanningEventsByidGroup,
  urlPanningEventsById
} from '.privates-url';
import { Workorder } from '../models/workorder';

@Injectable()
export class WorkOrderService {
  constructor(private http: HttpClient) {}


  getWorkOrderByContainerId(id: number): Observable<Workorder[]> { // GET /PlanningEvents/idcontainer/{idcontainer}
    return this.http
    .get(urlKPlanner + urlPlanningEventsByidContainer + id)
    .map((res: any) => {
      // console.log('GETworkorderByIdContainer res : ', res);
      res.map(data =>{
        data.Id_Planning_Events =  data.Id_Planning_Events.toString() 
      })
      return res as Workorder[];
    });
  }

  getWorkOrderByidGroup(idGroup: number): Observable<Workorder[]> { // GET /PlanningEvents/backlog/idgroupe//{idgroupe}
    return this.http
      .get(urlKPlanner + urlPlanningEventsByidGroup + idGroup)
      .map((res: any) => {
        // console.log('GETworkorderByIdGroup present in backlog => res : ', res);
        res.map(data =>{
          data.Id_Planning_Events =  data.Id_Planning_Events.toString() 
        })
        return res as Workorder[];
    });
  }

  /************************* PUT ************************/

  updateWorkOrder(id: number, workorder): Observable<Workorder> {
    return this.http
      .put<Workorder>(
        urlKPlanner + urlPanningEventsById + id,
        workorder
      )
      .pipe(catchError(this.handleError));
  }

  /*********************** ERROR ************************/

  private handleError(error: HttpErrorResponse) {
      console.log(error);
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${error.error}`
        );
      }
      return new ErrorObservable(
        'Something bad happened; please try again later.'
      );
    }
}