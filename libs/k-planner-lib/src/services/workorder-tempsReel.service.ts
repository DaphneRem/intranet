import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { EventModel } from '../models/Events';
import { urlKPlanner, urlPlanningEventsTempsReel, urlPlanningEventsTempsReelBystartDate, urlPlanningEventsTempsReelByendDate, urlPlanningEventsTempsReelByIdGroupe } from '.privates-url';



@Injectable()
export class WorkOrderTempsReelService {
  constructor(private http: HttpClient) {}

  getWorkorderTempsReelByIdGroupeStartDateEndDate(
    idGroupe: number,
    datedebut: Date | string,
    datefin: Date | string
  ): Observable<EventModel[]> {
      return this.http
        .get(
          urlKPlanner +
          urlPlanningEventsTempsReel + // /DW_Planning_Events_TempsReel
          urlPlanningEventsTempsReelBystartDate + // /datedebut/
          datedebut +
          urlPlanningEventsTempsReelByendDate+ // /datefin/
          datefin +
          urlPlanningEventsTempsReelByIdGroupe+ //  /idgroupe/
          idGroupe
        )
        .map((res: any) => {
          console.log(res);
          res.map(data =>{
            data.Id_Planning_Events =  data.Id_Planning_Events.toString() 
          })
          return res as EventModel[];
        });
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