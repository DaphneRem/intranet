import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


import { urlUtilisateur, urlUtilisateurByLogin } from '.privates-url';
import { Utilisateur } from '../models/utilisateur';


@Injectable()
export class UtilisateurService {
  constructor(private http: HttpClient) {}


getUtilisateurByLogin(email): Observable<Utilisateur[]> {
  return this.http
  .get( urlUtilisateurByLogin + email)
  .map((res: any) => {
    console.log(res);
    return res as Utilisateur[];
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