import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { urlKPlanner, urlStatut } from '.privates-url';
import { Statut } from '../models/statuts';


@Injectable()
export class StatutService {
  constructor(private http: HttpClient) {}


getStatut(): Observable<Statut[]> {
  return this.http
  .get(urlKPlanner + urlStatut)
  .map((res: any) => {
    console.log(res);
    return res as Statut[];
  })
  .catch(this.handleError);
}


private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return new ErrorObservable(
      'Something bad happened; please try again later.'
    );
  }
}