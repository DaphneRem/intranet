import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlPlaylists, urlPlaylistsErrors } from '../../../../.privates-url';

import { Playlist } from '../models/playlist';

@Injectable()
export class PlaylistsErrorsService {

  constructor( private http: HttpClient ) {}

  getPlaylistsErrors(days: number): Observable<Playlist[]> {
    return this.http
      .get(urlPlaylists + days + urlPlaylistsErrors)
      .map((res: any) => {
        if (!res) {
          res = [];
          return res;
        }
        console.log(res);
        res.map(e => {
            let diff = new Date(e.datediff);
            let ordre = new Date(e.dateordre);
            e.datediff = diff.toLocaleString();
            e.dateordre = ordre.toLocaleString();
        });
        return res as Playlist[];
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }

}
