

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { catchError, retry } from 'rxjs/operators';
import { UserAccessRights } from './access-rights-model';
import { urlAccessRightsKP } from '.privates-url';

@Injectable()
export class UserAccessRightsService {
    constructor(private http: HttpClient) { }

    getAccessRightsUser(): Observable<UserAccessRights[]> {
        return this.http
            .get(urlAccessRightsKP)
            .map((res: any) => {
   
                console.log(res);
                return res as UserAccessRights[];
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