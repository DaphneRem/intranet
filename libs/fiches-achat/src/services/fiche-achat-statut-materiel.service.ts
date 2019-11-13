import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { urlFicheAchatStatutMateriel } from '../../../../.privates-url';

import { FicheAchatStatutMateriel } from '../models/fiche-achat-statut-materiel';

@Injectable()
export class FicheAchatStatutMaterielService {

  constructor(private http: HttpClient) {}

  getFicheAchatStatutMateriel(idDetailFicheAchat: number): Observable<FicheAchatStatutMateriel[]> {
    return this.http
      .get(urlFicheAchatStatutMateriel)
      .map((res: any) => {
        return res as FicheAchatStatutMateriel[];
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
