import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { UserAppRights } from './user-app-rights';

// temporary imports :
import { fmRightsUsersUrl } from '../../../../../.privates-url';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class UserAppRightsService {
    constructor(private http: HttpClient) { }

    getRightsUserFm(): Observable<UserAppRights[]> {
        return this.http
            .get(fmRightsUsersUrl)
            .map((res: any) => {
                console.log('fmRightsUsersUrl => ', fmRightsUsersUrl);
                console.log('all users rights for app fichemateriel => ', res);
                return res as UserAppRights[];
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