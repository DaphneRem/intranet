import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  RequestOptions,
  URLSearchParams,
  Headers,
  Jsonp
} from '@angular/http';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';

import { DiffusionsDates } from '../models/diffusions-dates';
import { DiffusionsChanel } from '../models/diffusions-chanels';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';

import { catchError, retry, map, tap } from 'rxjs/operators';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {
  urlDiffDates,
  urlDiffDates_chanels,
  urlDiffDates_checkProgramNumber,
  urlDiffDates_searchProgNumbersByTitle,
  urlDiffDates_AutocompleteList
} from '../../../../.privates-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable()
export class DatesDiffusionsService {


  constructor(private http: HttpClient) { }

  public headers: Headers;
  public getChanelsDiffusions(): Observable<DiffusionsChanel[]> {
    return this.http
      .get(urlDiffDates_chanels)
      .map((res: any) => {
        return JSON.parse(res) as DiffusionsChanel[];
      })
      .catch(this.handleError);
  }

  /*********************** */
  public searchProgNumbersByName(progName): Observable<any> {
    return this.http
      .get(urlDiffDates_searchProgNumbersByTitle + progName)
      .map((res: any) => {
        return JSON.parse(res) as DiffusionsChanel[];
      })
      .catch(this.handleError);
  }

  /*********************** */

  public getAutocompleteList() {
    return this.http
      .get(urlDiffDates_AutocompleteList)
      .map((res: any) => {
        return JSON.parse(res);
      })
      .catch(this.handleError);
  }



  public checkProgramNumber(numProg) {
    return this.http
      .get(urlDiffDates_checkProgramNumber + numProg)
      .map((res: Boolean) => {
        return res;
      })
      .catch(this.handleError);

  }

  public getDiffusionsDates(datasForm: any): Observable<DiffusionsDates[]> {
    const bodyString = JSON.stringify(datasForm);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post<DiffusionsChanel[]>(urlDiffDates, bodyString, httpOptions)
      .map((res: any) => {
        return JSON.parse(res) as DiffusionsDates[];
      })
      .catch(this.handleError);
  }

  public calculateTotalHours(data) {
    try {
      let hours: any = 0;
      let minutes: any = 0;
      let secondes: any = 0;
      let frames: any = 0;
      for (let i = 0; i < data.length; i++) {
        const times = data[i].Duree.split(':');
        hours += Number(times[0]);
        minutes += Number(times[1]);
        if (minutes > 60) { minutes = 0; hours += 1; }
        secondes += Number(times[2]);
        if (secondes > 60) { secondes = 0; minutes += 1; }
        frames += Number(times[3]);
        if (frames > 30) { frames = 0; secondes += 1; }
      }
      if (hours < 10) { hours = '0' + hours };
      if (minutes < 10) { minutes = '0' + minutes };
      if (secondes < 10) { secondes = '0' + secondes };
      if (frames < 10) { frames = '0' + frames };
      const totalTime = hours + ':' + minutes + ':' + secondes + ':' + frames;

      return totalTime;
    } catch (err) {
      console.log('Error calcul nbr heures totales ' + err);
    }
  }


  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.'
    );
  }
}
