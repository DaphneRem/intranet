import { Injectable } from '@angular/core';
import { InfoTraitementKai } from '../models/info-traitement-kai';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry, map } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlTraitementKai, urlSegment } from '../../../../.privates-url';

@Injectable()
export class  InfoTraitementKaiService {
  constructor(
    private http: HttpClient
  ) {}


  getInfoTraitementKai(idSupport: string, numSegment: number): Observable<InfoTraitementKai> {
    console.log(urlTraitementKai + idSupport + urlSegment + numSegment);
    return this.http
      .get<InfoTraitementKai>(urlTraitementKai + idSupport + urlSegment + numSegment)
      .map((res: any) => {
        if (!res) {
          return 0;
        }
        // return JSON.parse(res);
        console.log(res[0]);
        return res[0] as InfoTraitementKai;
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
