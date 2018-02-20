import { Injectable } from '@angular/core';
import { KaiWaiting } from '../models/kai-waiting';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlIngestsKai, urlKaiInProgress } from '../../../../../.privates-url';

@Injectable()
export class KaiWaitingService {
  constructor(private http: HttpClient) {}

  getIngestsInProgress(days: number): Observable<KaiWaiting[]> {
    return this.http
      .get(urlIngestsKai + days + urlKaiInProgress)
      .map((res: any) => {
        return JSON.parse(res) as KaiWaiting[];
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

