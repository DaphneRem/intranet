import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import {
  AnnexElementStatus,
  AnnexElementCategory,
  AnnexElementSubCategory,
  AnnexElementFicheMAteriel
} from '../models/annex-element';

// temporary imports :
import {
  urlFicheMateriel,
  urlIdFicheMateriel,
  urlLibAnnexElements,
  urlFicheMatAnnexElements,
  urlCategoryAnnexElements,
  urlAllSubCategoryAnnexElements,
  urlSubCategoryByCategoryAnnexElements
} from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class AnnexElementsService {
  constructor(private http: HttpClient) {}

  /* GET ANNEXES ELEMENTS STATUS */
  getAnnexElementsStatus(): Observable<AnnexElementStatus[]> {
    return this.http
      .get(urlFicheMateriel + urlLibAnnexElements)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElementStatus[];
      });
  }

  /* GET ANNEXES ELEMENTS BY FM */
  getAnnexElementsFicheMateriel(IdFicheMateriel): Observable<AnnexElementFicheMAteriel[]> {
    return this.http
      .get(urlFicheMateriel + urlFicheMatAnnexElements + urlIdFicheMateriel + IdFicheMateriel)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElementFicheMAteriel[];
      });
  }

  /* GET ANNEXES ELEMENTS LIB ALL CATEGORIES */
  getAnnexElementsCategories(): Observable<AnnexElementCategory[]> {
    return this.http
      .get(urlFicheMateriel + urlCategoryAnnexElements)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElementCategory[];
      });
  }

  /* GET ANNEXES ELEMENTS LIB ALL SUB-CATEGORIES */
  getAnnexElementsAllSubCategories(): Observable<AnnexElementSubCategory[]> {
    return this.http
      .get(urlFicheMateriel + urlAllSubCategoryAnnexElements)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElementSubCategory[];
      });
  }

  /* GET ANNEXES ELEMENTS LIB SUB-CATEGORIES BY CATEGORIES */
  getAnnexElementsSubCategoriesByCategory(IdLibCategorieElementsAnnexes): Observable<AnnexElementSubCategory[]> {
    return this.http
      .get(
        urlFicheMateriel +  urlSubCategoryByCategoryAnnexElements + IdLibCategorieElementsAnnexes
      )
      .map((res: any) => {
        console.log(res);
        return res as AnnexElementSubCategory[];
      });
  }

  /* PUT ANNEXES ELEMENTS TO FM */
  putAnnexElementsFicheMateriel(annexesElements): Observable<AnnexElementFicheMAteriel[]> {
    return this.http
      .put<AnnexElementFicheMAteriel[]>(
        urlFicheMateriel + urlFicheMatAnnexElements,
        annexesElements
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
