import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { Version, VersionLib } from '../models/version';

// temporary imports :
import { urlFicheMateriel, urlFicheMatVersion, urlFicheAchat, urlVersionLib, urlVersion } from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class VersionService {
  constructor(private http: HttpClient) {}


  getVersionFicheMateriel(id): Observable<Version[]> {
    return this.http
      .get(urlFicheMateriel + urlVersion + urlFicheMatVersion + id)
      .map((res: any) => {
        console.log(res);
        return res as Version[];
      });
  }

  getVersionLib(): Observable<VersionLib[]> {
    return this.http
      .get(urlFicheAchat + urlVersionLib)
      .map((res: any) => {
        console.log(res);
        return res as VersionLib[];
      });
  }

  postVersion(version) {
    return this.http
      .post(
        urlFicheMateriel + urlVersion,
        version
      )
      .pipe(catchError(this.handleError));
  }

  patchVersion(version) {
    return this.http
      .patch(
        urlFicheMateriel + urlVersion,
        version
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
