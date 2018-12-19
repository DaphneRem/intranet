import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlIngests, urlCompleted } from '../../../../.privates-url';

import { IngestsCompleted } from '../models/ingests-completed';

@Injectable()
export class IngestsCompletedService {

  constructor( private http: HttpClient ) {}

  getIngestsCompleted(days: number): Observable<IngestsCompleted[]> {
    return this.http
      .get(urlIngests + days + urlCompleted)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(JSON.parse(res));
        console.log(res);
        return res as IngestsCompleted[];
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
