import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlIngestsKai, urlKaiEchec } from '../../../../../.privates-url';

import { KaiEchec } from '../models/kai-echec';

@Injectable()
export class KaiEchecService {

  constructor(private http: HttpClient) {}

  getIngestsKaiEchec(days: number): Observable<KaiEchec[]> {
    return this.http
      .get(urlIngestsKai + days + urlKaiEchec)
      .map((res: any) => {
        return JSON.parse(res) as KaiEchec[];
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

