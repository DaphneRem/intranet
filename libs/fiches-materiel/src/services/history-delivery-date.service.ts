import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { HistoryDeliveryDate } from '../models/history-delivery-date';

// temporary imports :
import { urlFicheMateriel, urlHistoryDeliveryDate } from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class HistoryDeliveryDateService {
  constructor(private http: HttpClient) {}

  /* GET ONE FICHE MATERIEL BY ID */
  getHistoryDeliveryDate(idFicheMateriel): Observable<HistoryDeliveryDate[]> {
    return this.http
      .get(urlFicheMateriel + urlHistoryDeliveryDate + idFicheMateriel)
      .map((res: HistoryDeliveryDate[]) => {
        console.log(res);
        return res as HistoryDeliveryDate[];
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
