import { Injectable } from '@angular/core';
import { IngestsInProgress } from '../models/ingests-in-progress';


import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// temporary imports :
import { urlIngests, urlInProgress } from '../../../../.privates-url';

@Injectable()
export class IngestsInProgressService {

  constructor(
      private http: Http,
    ) {}

    getIngestsInProgress(days: number) {
        return this.http
          .get(urlIngests + days + urlInProgress)
          .map((res: any) => {
            return JSON.parse(res.json()) as IngestsInProgress[];
          })
          .catch((error: any) => {
            return Observable.throw(error.json ? error.json().error : error || 'Server error');
          });
    }

}
