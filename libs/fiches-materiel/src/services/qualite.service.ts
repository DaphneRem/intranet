import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { Qualite, QualiteByFM } from '../models/qualite';

// temporary imports :
import { urlFicheMateriel, urlLibQualite, urlFicheMatQualite, urlQualite } from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class QualiteService {
  constructor(private http: HttpClient) {}

  /* GET ONE FICHE MATERIEL BY ID */
  getQualite(): Observable<Qualite[]> {
    return this.http
      .get(urlFicheMateriel + urlLibQualite)
      .map((res: any) => {
        console.log(res);
        return res as Qualite[];
      });
  }

  getQualiteFicheMateriel(id): Observable<QualiteByFM[]> {
    return this.http
      .get(urlFicheMateriel + urlFicheMatQualite + id)
      .map((res: any) => {
        console.log(res);
        return res as QualiteByFM[];
      });
  }

  postQualite(qualite) {
    return this.http
      .post(
        urlFicheMateriel + urlQualite,
        qualite
      )
      .pipe(catchError(this.handleError));
  }

  patchQualite(qualite) {
    return this.http
      .patch(
        urlFicheMateriel + urlQualite,
        qualite
      )
      .pipe(catchError(this.handleError));
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
