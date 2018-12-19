import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlPub, urlPubInProgress } from '../../../../.privates-url';

import { PubInProgress } from '../models/pub-in-progress';

@Injectable()
export class PubInProgressService {

  constructor( private http: HttpClient ) {}

  getPubInProgress(days: number): Observable<PubInProgress[]> {
    return this.http
      .get(urlPub + days + urlPubInProgress)
      .map((res: any) => {
        if (!res) {
          res = 0;
          console.log(res);
          return res;
        }
        console.log(res);
        return res as PubInProgress[];
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
