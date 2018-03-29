import { Injectable } from '@angular/core';
import { InformationsKai } from '../models/informations-kai';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry, map } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlTraceSegmentKai, urlSegment } from '../../../../.privates-url';

@Injectable()
export class InformationsKaiService {
  constructor(
    private http: HttpClient
  ) {}


  getInformationsKai(idSupport: string, numSegment: number): Observable<InformationsKai> {
    return this.http
      .get<InformationsKai>(urlTraceSegmentKai + idSupport + urlSegment + numSegment)
      .map((res: any ) => {
        // return JSON.parse(res);
        console.log(JSON.parse(res)[0]);
        return JSON.parse(res)[0] as InformationsKai;
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
