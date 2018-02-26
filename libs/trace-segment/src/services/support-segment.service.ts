import { Injectable } from '@angular/core';
import { SupportSegment } from '../models/support-segment';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry, map } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlTraceSegment, urlSegment } from '../../../../.privates-url';

@Injectable()
export class SupportSegmentService {
  constructor(private http: HttpClient) {}


  getSupportSegment(idSupport: string, numSegment: number) {
    return this.http
      .get(urlTraceSegment + idSupport + urlSegment + numSegment)
      .map((res: any) => {
        return JSON.parse(res);
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
