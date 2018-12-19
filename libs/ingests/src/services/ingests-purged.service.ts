import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IngestsPurged } from '../models/ingests-purged';

// temporary imports :
import { urlIngestsKai, urlKaiPurged } from '../../../../.privates-url';

@Injectable()
export class IngestsPurgedService {

  constructor( private http: HttpClient ) {}

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
