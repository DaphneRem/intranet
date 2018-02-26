import { Injectable } from '@angular/core';
import { IngestsInProgress } from '../models/ingests-in-progress';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, retry } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlIngests, urlInProgress } from '../../../../.privates-url';

@Injectable()
export class IngestsInProgressService {
  constructor(private http: HttpClient) {}

  getIngestsInProgress(days: number): Observable<IngestsInProgress[]> {
    return this.http
      .get<IngestsInProgress[]>(urlIngests + days + urlInProgress)
      .map((res: any) => {
        return JSON.parse(res) as IngestsInProgress[];
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }

}




// import { Injectable } from '@angular/core';
// import { IngestsInProgress } from '../models/ingests-in-progress';


// import { Http, URLSearchParams } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

// // temporary imports :
// import { urlIngests, urlInProgress } from '../../../../.privates-url';

// @Injectable()
// export class IngestsInProgressService {

//   constructor(
//       private http: Http,
//     ) {}

//     getIngestsInProgress(days: number) {
//         return this.http
//           .get(urlIngests + days + urlInProgress)
//           .map((res: any) => {
//             return JSON.parse(res.json()) as IngestsInProgress[];
//           })
//           .catch((error: any) => {
//             return Observable.throw(error.json ? error.json().error : error || 'Server error');
//           });
//     }

// }
