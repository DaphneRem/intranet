import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  RequestOptions,
  URLSearchParams,
  Headers
} from '@angular/http';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import { DiffusionsDates } from '../models/diffusions-dates';
import { DiffusionsChanel } from '../models/diffusions-chanels';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';

import { catchError, retry } from 'rxjs/operators';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { urlDiffDates, urlDiffDates_chanels, urlDiffDates_checkProgramNumber } from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable()
export class DatesDiffusionsService {
  constructor(private http: HttpClient) { }

  public headers: Headers;

  getChanelsDiffusions(): Observable<DiffusionsChanel[]> {
    return this.http
      .get(urlDiffDates_chanels)
      .map((res: any) => {
        return JSON.parse(res) as DiffusionsChanel[];
      })
      .catch(this.handleError);
  }

  checkProgramNumber(numProg) {
    return this.http
      .get(urlDiffDates_checkProgramNumber + numProg)
      .map((res: any) => {
        return res;
      })
      .catch(this.handleError);
  }

  getDiffusionsDates(datasForm: any): Observable<DiffusionsDates[]> {
    const bodyString = JSON.stringify(datasForm);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post<DiffusionsChanel[]>(urlDiffDates, bodyString, httpOptions)
      .map((res: any) => {
        return JSON.parse(res) as DiffusionsDates[];
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.'
    );
  }
}
