import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { FicheMateriel } from '../models/fiche-materiel';
import { FicheMaterielCreation } from '../models/fiche-materiel-creation';

// temporary imports :
import { urlFicheMateriel, urlAllFichesMateriel } from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class FichesMaterielService {
  constructor(private http: HttpClient) {}

  getFichesMateriel(): Observable<FicheMateriel[]> {
    return this.http
      .get(urlFicheMateriel + urlAllFichesMateriel)
      .map((res: any) => {
        // if (!res) {
        //   res = 0;
        //   return res;
        // }
        // console.log(JSON.parse(res));
        console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

  /** POST: add a new hero to the database */
  postFicheMateriel(ficheMateriel: FicheMaterielCreation): Observable<FicheMaterielCreation> {
    return this.http
      .post<FicheMaterielCreation>(
        urlFicheMateriel + urlAllFichesMateriel,
        ficheMateriel
      )
      .pipe(
        catchError(this.handleError)
    );
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
