import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Coordinateur } from '../models/coordinateur';

import { urlKPlanner, urlCoordinateurLib, urlCoordinateurLibUsername } from '.privates-url';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


@Injectable()
export class CoordinateurService {

  constructor(private http: HttpClient) {}

  getAllCoordinateurs(): Observable<Coordinateur[]> {
    return this.http
      .get(urlKPlanner + urlCoordinateurLib)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as Coordinateur[];
      })
      .catch(this.handleError);
  }

  getCoordinateurByUsername(username:string){
    return this.http
    .get(urlKPlanner + urlCoordinateurLibUsername + username)
    .map((res: any) => {
      if (!res) {
        res = 0;
        return res;
      }
       console.log(res);
      return res as Coordinateur[];
    })
    .catch(this.handleError);
  }


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
