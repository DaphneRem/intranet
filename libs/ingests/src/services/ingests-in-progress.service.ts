import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IngestsInProgress } from '../models/ingests-in-progress';

// temporary imports :
import { urlIngests, urlInProgress } from '../../../../.privates-url';

@Injectable()
export class IngestsInProgressService {

  constructor( private http: HttpClient ) {}

  getIngestsInProgress(days: number): Observable<IngestsInProgress[]> {
    return this.http
      .get<IngestsInProgress[]>(urlIngests + days + urlInProgress)
      .map((res: any) => {
        if (!res) {
          console.log(res);
          res = 0;
          return res;
        }
        // return JSON.parse(res) as IngestsInProgress[];
        console.log(res);
        return res as IngestsInProgress[];
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }

}