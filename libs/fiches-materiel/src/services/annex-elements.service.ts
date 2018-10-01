import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { AnnexElement } from '../models/annex-element';

// temporary imports :
import { urlFicheMateriel, urlLibAnnexElements, urlFicheMatAnnexElements } from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class AnnexElementsService {
  constructor(private http: HttpClient) {}

  /* GET ONE FICHE MATERIEL BY ID */
  getAnnexElements(): Observable<AnnexElement[]> {
    return this.http
      .get(urlFicheMateriel + urlLibAnnexElements)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElement[];
      });
  }

  getAnnexElementsFicheMateriel(id) {
    return this.http
      .get(urlFicheMateriel + urlFicheMatAnnexElements + id)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElement[];
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
