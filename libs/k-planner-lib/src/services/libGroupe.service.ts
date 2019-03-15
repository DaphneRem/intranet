import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { LibelleGroupe } from '../models/libelle-groupe';
import { urlGroupeLib, urlKPlanner } from '.privates-url';


@Injectable()
export class LibGroupeService {
  constructor(private http: HttpClient) {}


getLibGroupe(id: number): Observable<LibelleGroupe[]> {
  return this.http
  .get(urlKPlanner + urlGroupeLib + id)
  .map((res: any) => {
    console.log(res);
    return res as LibelleGroupe[];
  });
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