import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
// import { urlIngests, urlCompleted } from '../../../../.privates-url';
import { urlFicheAchat, urlDetailFicheAchat, urlFicheAchatTraitee } from '../../../../.privates-url';

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
        // if (!res) {
        //   res = 0;
        //   return res;
        // }
        // console.log(JSON.parse(res));
        console.log(res);
        return res as FicheAchat[];
      })
      .catch(this.handleError);
  }

  getGlobalFIcheAchat(id): Observable<FicheAchat[]> {
    console.log(urlFicheAchat + '/FicheAchat' + id);
    return this.http
      .get(urlFicheAchat + '/FicheAchat'  + id)
      .map((res: any) => {
        // if (!res) {
        //   res = 0;
        //   return res;
        // }
        // console.log(JSON.parse(res));
        console.log(res);
        return res as FicheAchat[];
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

  getFichesAchatDetails(id: number): Observable<FicheAchatDetails[]> {
    return this.http
      .get(urlFicheAchat + urlDetailFicheAchat + id)
      .map((res: any) => {
        // if (!res) {
        //   res = 0;
        //   return res;
        // }
        // console.log(JSON.parse(res));
        console.log(res);
        return res as FicheAchatDetails[];
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
