import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlIngests, urlErrors } from '../../../../.privates-url';

import { IngestsErrors } from '../models/ingests-errors';


@Injectable()
export class IngestsErrorsService {

  constructor( private http: HttpClient ) {}

  getIngestsErrors(days: number): Observable<IngestsErrors[]> {
    return this.http
      .get(urlIngests + days + urlErrors)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(JSON.parse(res));
        console.log(res);
        return res as IngestsErrors[];
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
