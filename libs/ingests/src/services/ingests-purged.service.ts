import { Injectable } from '@angular/core';
import { IngestsPurged } from '../models/ingests-purged';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlIngestsKai, urlKaiPurged } from '../../../../.privates-url';

@Injectable()
export class IngestsPurgedService {
  constructor(private http: HttpClient) {}

  getIngestsPurged(days: number): Observable<IngestsPurged[]> {
    return this.http
      .get(urlIngestsKai + days + urlKaiPurged)
      .map((res: any) => {
        return JSON.parse(res) as IngestsPurged[];
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
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }

}
