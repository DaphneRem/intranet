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

  public results = [];

  public getChanelsDiffusions(): Observable<DiffusionsChanel[]> {
    return this.http
      .get(urlDiffDates_chanels)
      .map((res: any) => {
        return JSON.parse(res) as DiffusionsChanel[];
      })
      .catch(this.handleError);
  }

/*********************** */
  public searchProgNumbersByName(progName): Observable<any>{
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
      const frameRat = '30'; // fps
      let secondes = 0;
      for (let i = 0; i < data.length; i++) {
        const secs = this.convertTimeCodeToSeconds(data[i].Duree, frameRat);
        secondes = Number(secondes) + Number(secs);
      }
      return this.convertTime(secondes, frameRat);
    } catch (err) {
      console.log('Error calcul nbr heures totales ' + err);
    }
  }

  public convertTimeCodeToSeconds(timeString, framerate) {
    const timeArray = timeString.split(':');
    const hours = timeArray[0] * 60 * 60;
    const minutes = timeArray[1] * 60;
    const seconds = timeArray[2];
    const frames = timeArray[3] * (1 / framerate);
    const str =
      'h:' + hours + '\nm:' + minutes + '\ns:' + seconds + '\f:' + frames;
    const totalTime = hours + minutes + seconds + frames;
    return totalTime;
  }
  public convertTime(frames, fps) {
    fps = typeof fps !== 'undefined' ? fps : 30;
    const pad = function(input) {
        return input < 10 ? '0' + input : input;
      },
      seconds = typeof frames !== 'undefined' ? frames / fps : 0;
    return [
      pad(Math.floor(seconds / 3600)),
      pad(Math.floor((seconds % 3600) / 60)),
      pad(Math.floor(seconds % 60)),
      pad(Math.floor(frames % fps))
    ].join(':');
  }
  private handleError2<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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
