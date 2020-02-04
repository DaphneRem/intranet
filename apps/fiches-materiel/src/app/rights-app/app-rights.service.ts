import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';

import { UsersInAppRights } from './users-in-app-rights';
import { UserInAppRights } from './user-in-app-rights';

// temporary imports :
import {
    authUrlUser, // '/utilisateur/Info/'
    authUrlUserRights, // '/utilisateur/Droit/'
    authUrlByUserForApp1, // '/Module/'
    authUrlByUserForApp2, // '/utilisateur/'
    rightsForApp, // '/ApplicationWeb/fichemateriel'
    fmRightsUsersUrl, // '/ApplicationWeb/fichemateriel/DroitUser'
    fmRightsUsersEmailUrl // '/ApplicationWeb/fichemateriel/Utilisateurs'
} from '../../../../../.privates-url';
import { resAirlinesData } from '@ab/k-planner-lib/src/datasource';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class AppRightsService {
    constructor(private http: HttpClient) { }

    getRightsUserFm(): Observable<UsersInAppRights[]> { // '/ApplicationWeb/fichemateriel/DroitUser'
        return this.http
            .get(fmRightsUsersUrl)
            .map((res: any) => {
                console.log('fmRightsUsersUrl => ', fmRightsUsersUrl);
                console.log('all users rights for app fichemateriel => ', res);
                return res as UsersInAppRights[];
            });
    }

    getRightsByAppAndUser(appName, userEmail) { // '/ApplicationWeb/fichemateriel/DroitUser'
        let url = authUrlByUserForApp1 + appName + authUrlByUserForApp2 + userEmail;
        return this.http
            .get(url)
            .map((res: any) => {
                console.log('rights for user in app => ', res);
                return res;
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