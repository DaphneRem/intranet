import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

// temporary imports :
import { urlPlaylists, urlPlaylistsAll } from '../../../../.privates-url';

import { Playlist } from '../models/playlist';

@Injectable()
export class PlaylistsAllService {
  constructor(private http: HttpClient) {}

  getPlaylistsAll(days: number): Observable<Playlist[]> {
    return this.http
      .get(urlPlaylists + days + urlPlaylistsAll)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        console.log(res);
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
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return new ErrorObservable(
      'Something bad happened; please try again later.'
    );
  }
}
