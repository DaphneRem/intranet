import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { FicheMateriel } from '../models/fiche-materiel';
import { FicheMaterielComplexSearch } from '../models/fiche-materiel-complex-search';
import { FicheMaterielCreation } from '../models/fiche-materiel-creation';

// temporary imports :
import {
  urlFicheMateriel,
  urlAllFichesMateriel,
  urlOneFicheMateriel,
  urlFicheMaterielByFicheAchatDetail,
  urlFicheMaterielIntervalModification,
  urlFicheMaterielIntervalCreation,
  urlFicheMaterielIsArchived,
  urlFicheMaterielSuiviPar,
  urlFicheMaterielTitreVo,
  urlFicheMaterielTitreVf,
  urlFicheMeterielcomplexesearch
} from '../../../../.privates-url';
// /ficheMateriels/IdFicheMateriel/{IdFicheMateriel}


// fiches materiel
// export const urlAllFichesMateriel = '/fichemateriels';
// export const urlOneFicheMateriel = '/ficheMateriels/IdFicheMateriel/'; // +IdFicheMateriel (get and delete)
// export const urlFicheMaterielByFicheAchatDetail = '/ficheMateriels/idFicheAchatDetail/'; // +idFicheAchatDetail (delete)

// export const urlFicheMaterielIntervalModification = '/intervalmodification/'; // +{interval}
// export const urlFicheMaterielIntervalCreation = '/intervalcreation/'; // +{interval}
// export const urlFicheMaterielIsArchived = '/isarchived/'; // +{isarchived}
// export const urlFicheMaterielSuiviPar = '/suivipar/'; // +{suivipar}
// export const urlFicheMaterielTitreVo = '/titrevo/'; // +{titrevo}
// export const urlFicheMaterielTitreVf = '/titrevf/'; // +{titrevf}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class FichesMaterielService {
  constructor(private http: HttpClient) {}

  private extractData(res: Response) {
    let body = res;
    console.log('res api request fiches materiel => ', body);
    return body || [];
  }

  /* GET ONE FICHE MATERIEL BY ID */
  getOneFicheMateriel(id: number): Observable<FicheMateriel> {
    return this.http
      .get(urlFicheMateriel + urlOneFicheMateriel + id)
      .map((res: any) => {
        console.log(res);
        return res as FicheMateriel;
      });
  }

  /* GET ALL FICHES MATERIEL */
  getFichesMateriel(): Observable<FicheMateriel[]> {
    return this.http
      .get(urlFicheMateriel + urlAllFichesMateriel)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

  // GET /ficheMateriels/intervalmodification/{interval}/isarchived/{isarchived}
  getFichesMaterielByIntervalModifIsArchived(intervalModif: number, isArchived: number): Observable<FicheMateriel[]> {
    // intervalModif : nombre de jours
    // isArchived : (0 = false; 1 = true; else = all)
    let url = urlFicheMateriel + urlAllFichesMateriel + urlFicheMaterielIntervalModification 
              + intervalModif + urlFicheMaterielIsArchived + isArchived;
    return this.http
      .get(url)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

  // GET /ficheMateriels/intervalcreation/{interval}/suivipar/{suivipar}/isarchived/{isarchived}
  getFichesMaterielByIntervalCreationSuiviParIsArchived(
    intervalCreation: number,
    suiviPar: string,
    isArchived: number
  ): Observable<FicheMateriel[]> {
    // intervalCreation : nombre de jours
    // isArchived : (0 = false; 1 = true; else = all)
    let url = urlFicheMateriel + urlAllFichesMateriel + urlFicheMaterielIntervalCreation + intervalCreation 
              + urlFicheMaterielSuiviPar + suiviPar + urlFicheMaterielIsArchived + isArchived;
    console.log(url);
    return this.http
      .get(url)
      .map((res: any) => {
        console.log(res);
        if (!res) {
          console.log(res);
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

  // GET /ficheMateriels/intervalcreation/{interval}/isarchived/{isarchived}
  getFichesMaterielByIntervalCreationIsArchived(intervalCreation: number, isArchived: number): Observable<FicheMateriel[]> {
    // intervalCreation : nombre de jours
    // isArchived : (0 = false; 1 = true; else = all)
    let url = urlFicheMateriel + urlAllFichesMateriel + urlFicheMaterielIntervalCreation
              + intervalCreation + urlFicheMaterielIsArchived + isArchived;
    console.log(url);
    return this.http
      .get(url)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

// export const urlFicheMaterielTitreVf

  // GET /ficheMateriels/suivipar/{suivipar}/titrevo/{titrevo}/titrevf/{titrevf}/isarchived/{isarchived}
  getFichesMaterielBySuiviParTitreVoTitraVfIsArchived(
    suiviPar: string,
    titreVo: string,
    titreVf: string,
    isArchived: number
  ): Observable<FicheMateriel[]> {
    // isArchived : (0 = false; 1 = true; else = all)
    let url = urlFicheMateriel + urlAllFichesMateriel + urlFicheMaterielSuiviPar + suiviPar + urlFicheMaterielTitreVo 
              + titreVo + urlFicheMaterielTitreVf + titreVf + urlFicheMaterielIsArchived + isArchived;
    return this.http
      .get(url)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

  // GET /ficheMateriels/intervalmodification/{interval}/suivipar/{suivipar}/isarchived/{isarchived}
  getFichesMAterielByIntervalModifSuiviParIsArchived(
    intervalModif: number,
    suiviPar: string,
    isArchived: number
  ): Observable<FicheMateriel[]> {
    // intervalModif : nombre de jours
    // isArchived : (0 = false; 1 = true; else = all)
    let url = urlFicheMateriel + urlAllFichesMateriel + urlFicheMaterielIntervalModification + intervalModif 
              + urlFicheMaterielSuiviPar + suiviPar + urlFicheMaterielIsArchived + isArchived;
    return this.http
      .get(url)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .catch(this.handleError);
  }

  // WARNING !! => the request is POST in real
  getFichesMAterielWithComplexSearch(searchObject: FicheMaterielComplexSearch): Observable<FicheMateriel[]> {
    // searchObject = {
    //       IdFicheMateriel: string;
    //       SuiviPar: string;
    //       TitreEpisodeVO: string;
    //       TitreEpisodeVF: string;
    //       isarchived: number;
    //       distributeur: string;
    //       IdFicheAchat: string;
    // }
    let url = urlFicheMateriel + urlAllFichesMateriel + urlFicheMeterielcomplexesearch;
    return this.http
      .post(url, searchObject)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as FicheMateriel[];
      })
      .pipe(catchError(this.handleError));
  }

  /* POST FICHES MATERIEL WITH OBSERVABLE */
//  postFicheMateriel(ficheMateriel: FicheMaterielCreation): Observable<FicheMaterielCreation> {
//    return this.http
//      .post<FicheMaterielCreation>(
//        urlFicheMateriel + urlAllFichesMateriel,
//        ficheMateriel
//      )
//      .pipe(catchError(this.handleError));
//  }

  /* POST FICHES MATERIEL WITH PROMISE */
  postFicheMateriel(ficheMateriel) {
    return this.http
      .post(
      urlFicheMateriel + urlAllFichesMateriel,
      ficheMateriel
      )
      .toPromise()
      .then(this.extractData)
      .catch(this.handleErrorForPromise);
  }

  /* DELETE FICHES MATERIEL WITH OBSERVABLE */
//  deleteFicheMaterielByFicheAchatDetail(id: number): Observable<{}> {
//    return this.http
//      .delete(urlFicheMateriel + urlFicheMaterielByFicheAchatDetail + id)
//      .pipe(catchError(this.handleError));
//  }

  /* DELETE FICHES MATERIEL WITH PROMISE */
  deleteFicheMaterielByFicheAchatDetail(id: number) {
    return this.http
      .delete(urlFicheMateriel + urlFicheMaterielByFicheAchatDetail + id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleErrorForPromise);
  }

  /* PUT FICHES MATERIEL */
  updateFicheMateriel(ficheMateriel: FicheMaterielCreation[]): Observable<FicheMaterielCreation[]> {
    return this.http
      .put<FicheMaterielCreation[]>(
        urlFicheMateriel + urlAllFichesMateriel,
        ficheMateriel
      )
      .pipe(catchError(this.handleError));
  }

  /* PATCH FICHES MATERIEL */
  patchFicheMateriel(ficheMateriel) {
    return this.http
      .patch(
        urlFicheMateriel + urlAllFichesMateriel,
        ficheMateriel
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

  private handleErrorForPromise(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
