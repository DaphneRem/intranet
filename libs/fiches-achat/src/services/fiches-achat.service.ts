import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

// temporary imports :
// import { urlIngests, urlCompleted } from '../../../../.privates-url';
import {
  urlFicheAchat,
  urlDetailFicheAchat,
  urlFicheAchatTraitee,
  urlFicheAchatStatut,
  urlFicheAchatImport,
  urlFicheAchatDetail,
  urlFicheAchatGlobalPut,
  urlFicheAchatPatch,
  urlImportMaterielPatch,
  urlImportOeuvrePatch,
} from '../../../../.privates-url';

import { FicheAchat } from '../models/fiche-achat';
import { FicheAchatDetails } from '../models/fiche-achat-details';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable()
export class FichesAchatService {
  constructor(private http: HttpClient) {}

  getFichesAchat(days: number): Observable<FicheAchat[]> {
    return this.http
      .get(urlFicheAchat + urlFicheAchatTraitee)
      .map((res: any) => {
        return res as FicheAchat[];
      })
      .catch(this.handleError);
  }

  getGlobalFIcheAchat(id): Observable<FicheAchat[]> {
    console.log(urlFicheAchat + '/FicheAchat/' + id);
    return this.http
      .get(urlFicheAchat + '/FicheAchat/'  + id)
      .map((res: any) => {
        console.log(res);
        return res as FicheAchat[];
      })
      .catch(this.handleError);
  }

  getFicheAchatByImport(statut: number, imported: number): Observable<FicheAchat[]> {
    return this.http
      .get(urlFicheAchat + urlFicheAchatStatut + statut + urlFicheAchatImport + imported)
      .map((res: any) => {
        console.log(res);
        if (res === []) {
          return res;
        } else {
          return res as FicheAchat[];

        }
      })
      .catch(this.handleError);
  }

  // getFichesAchat2(view: number): Observable<FicheAchat[]> {
  //   return this.http
  //     .get(urlFicheAchat + urlFicheAchatTraitee)
  //     .map((res: any) => {
  //       // if (!res) {
  //       //   res = 0;
  //       //   return res;
  //       // }
  //       // console.log(JSON.parse(res));
  //       console.log(res);
  //       return res as FicheAchat[];
  //     })
  //     .catch(this.handleError);
  // }

  getFichesAchatDetails(id: number | string): Observable<FicheAchatDetails[]> {
    return this.http
      .get(urlFicheAchat + urlDetailFicheAchat + id)
      .map((res: any) => {
        console.log(res);
        console.log(urlFicheAchat + urlDetailFicheAchat + id);
        return res as FicheAchatDetails[];
      })
      .catch(this.handleError);
  }

  /* PUT FICHE ACHAT DETAIL */
  putFicheAchatDetail(id: number, ficheAchatDetail: FicheAchatDetails) {
    return this.http
      .put(
        urlFicheAchat + urlFicheAchatDetail + id,
        ficheAchatDetail
      )
      .pipe(catchError(this.handleError));
  }

  /* PUT FICHE ACHAT GLOBAL */
  putFicheAchatGlobal(id: number, ficheAchat: FicheAchat) {
    return this.http
      .put(
        urlFicheAchat + urlFicheAchatGlobalPut + id,
        ficheAchat
      )
      .pipe(catchError(this.handleError));
  }

  /* PATCH FICHE ACHAT GLOBAL */
  patchMaterielImportFicheAchatGlobal(id: number | string, value: number, ficheAchat: FicheAchat) {
    return this.http
      .patch(
        urlFicheAchat + urlFicheAchatPatch + id + urlImportMaterielPatch + value,
        ficheAchat
      )
      .pipe(catchError(this.handleError));
  }

  patchOeuvreImportFicheAchatGlobal(id: number | string, value: number) {
    return this.http
      .patch(
        urlFicheAchat + urlFicheAchatPatch + id  + urlImportOeuvrePatch + value,
        value
      )
      .pipe(catchError(this.handleError));
  }

  patchMaterielImportFicheAchatDetail(id: number, value: number) {
    return this.http
      .patch(
        urlFicheAchat + urlFicheAchatDetail + id + urlImportMaterielPatch + value,
        {id: id, import: value}
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
