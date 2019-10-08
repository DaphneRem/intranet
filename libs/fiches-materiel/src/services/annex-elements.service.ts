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
  AnnexElementFicheMAteriel,
} from '../models/annex-element';
import { AnnexElementCommentsFicheMAteriel } from '../models/annex-elements-comments';

// temporary imports :
import {
  urlFicheMateriel,
  urlIdFicheMateriel,
  urlLibAnnexElements,
  urlFicheMatAnnexElements,
  urlCategoryAnnexElements,
  urlAllSubCategoryAnnexElements,
  urlSubCategoryByCategoryAnnexElements,
  urlCategoryCommentAnnexElements,
  urlElementsAnnexesFMComments
} from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class AnnexElementsService {
  constructor(private http: HttpClient) {}

  private extractData(res: Response) {
    // let body = res.json();
    console.log('res api request versions => ', res);
    return res || [];
  }

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

  /* GET ANNEXES ELEMENTS LIB ALL CATEGORIES  (with comment) */
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
  // putAnnexElementsFicheMateriel(annexesElements): Observable<AnnexElementFicheMAteriel[]> {
  //   return this.http
  //     .put<AnnexElementFicheMAteriel[]>(
  //       urlFicheMateriel + urlFicheMatAnnexElements,
  //       annexesElements
  //     )
  //     .pipe(catchError(this.handleError));
  // }


  /* COMMENTAIRES CATEGORY EA */
  getCommentaireAnnexElementsFicheMateriel(IdFicheMateriel): Observable<AnnexElementCommentsFicheMAteriel[]> {
    return this.http
      .get(urlFicheMateriel + urlElementsAnnexesFMComments + IdFicheMateriel)
      .map((res: any) => {
        console.log(res);
        return res as AnnexElementCommentsFicheMAteriel[];
      });
  }

  // putCommentaireAnnexElementsFicheMateriel(annexesElements): Observable<AnnexElementCommentsFicheMAteriel[]> {
  //   return this.http
  //     .put<AnnexElementCommentsFicheMAteriel[]>(
  //       urlFicheMateriel + urlCategoryCommentAnnexElements,
  //       annexesElements
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  // postCommentaireAnnexElementsFicheMateriel(annexesElements): Observable<AnnexElementCommentsFicheMAteriel[]> {
  //   return this.http
  //     .post<AnnexElementCommentsFicheMAteriel[]>(
  //       urlFicheMateriel + urlCategoryCommentAnnexElements,
  //       annexesElements
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  /***************** Requests with Promises ***************/

  /* PUT ANNEXES ELEMENTS TO FM */
  putAnnexElementsFicheMateriel(annexesElements) {
    return this.http
      .put(
      urlFicheMateriel + urlFicheMatAnnexElements,
      annexesElements
      )
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

 /* COMMENTAIRES CATEGORY EA */
  putCommentaireAnnexElementsFicheMateriel(annexesElements) {
    return this.http
      .put(
      urlFicheMateriel + urlCategoryCommentAnnexElements,
      annexesElements
      )
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  postCommentaireAnnexElementsFicheMateriel(annexesElements) {
    return this.http
      .post(
      urlFicheMateriel + urlCategoryCommentAnnexElements,
      annexesElements
      )
      .toPromise()
      .then(this.extractData)
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
