import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlKarinaWaiting } from '../../../../.privates-url';

import { KarinaWaiting } from '../models/karina-waiting';

@Injectable()
export class KarinaWaitingService {

  constructor( private http: HttpClient ) {}

  getKarinaWaiting(): Observable<KarinaWaiting[]> {
    return this.http
      .get(urlKarinaWaiting)
      .map((res: any) => {
        return JSON.parse(res) as KarinaWaiting[];
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
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

