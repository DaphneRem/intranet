import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MonteursData } from '../models/monteurs-data';
import { urlKPlanner, urlMonteurs, urlGroupMonteurs, urlTypeRessources } from '.privates-url';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { TypeRessources } from '../models/type-ressource-user';


@Injectable()
export class MonteursService {
  constructor(private http: HttpClient) {}

getMonteur():  Observable< MonteursData[]>{
    return this.http
    .get(urlKPlanner + urlMonteurs)
    .map((res: any) => {
      if (!res) {
        res = 0;
        return res;
      }
      // console.log(res);
      return res as MonteursData[];
    })
    .catch(this.handleError);
}

getGroupMonteur(id: number): Observable<MonteursData[]> {
  return this.http
  .get(urlKPlanner + urlGroupMonteurs + id)
  .map((res: any) => {
    console.log(res);
    return res as MonteursData[];
  });
}
 getTypeRessource(): Observable<TypeRessources[]>{
  return this.http
  .get(urlKPlanner + urlTypeRessources )
  .map((res: any) => {
    console.log(res);
    return res as TypeRessources[];
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