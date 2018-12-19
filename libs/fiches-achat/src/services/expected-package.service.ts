import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { urlFicheAchat, urlFicheAchatDetail, urlExpectedPackage} from '../../../../.privates-url';

import { ExpectedPackage } from '../models/expected-package';

@Injectable()
export class ExpectedPackageService {

  constructor(private http: HttpClient) {}

  getExpectedPackage(idDetailFicheAchat: number): Observable<ExpectedPackage[]> {
    return this.http
      .get(urlFicheAchat + urlFicheAchatDetail + urlExpectedPackage + idDetailFicheAchat)
      .map((res: any) => {
        return res as ExpectedPackage[];
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
