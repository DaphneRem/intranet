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
  constructor(
    private http: HttpClient
  ) {}


  getSupportSegment(idSupport: string, numSegment: number): Observable<SupportSegment> {
    return this.http
      .get<SupportSegment>(urlTraceSegment + idSupport + urlSegment + numSegment)
      .map((res: SupportSegment ) => {
        // return JSON.parse(res);
        // console.log(typeof res[0].markout);
        console.log(res);
        if (!res) {
          return 0;
        }
        return (res[0] = new SupportSegment().deserialize(res[0]));

        // return res[0] = new SupportSegment(
        //           res[0].id,
        //           res[0].TypeSupport,
        //           res[0].Formatsupport,
        //           res[0].StatutSupport,
        //           res[0].numprogram,
        //           res[0].numepisode,
        //           res[0].titreseg,
        //           res[0].markin,
        //           res[0].markout,
        //           res[0].durant,
        //           res[0].idsuppsuivant,
        //           res[0].nosegsuivant,
        //           res[0].diffusionid,
        //           res[0].objid,
        //           res[0].datecre,
        //           res[0].datemaj,
        //           res[0].userma
        // );
        // return res[0] as SupportSegment;
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
