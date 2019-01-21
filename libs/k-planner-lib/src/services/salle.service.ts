import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Salle } from "../models/salle";
import { Observable } from "rxjs/Observable";
import { urlSalle, urlKPlanner } from ".privates-url";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";



@Injectable()
export class SalleService {
  constructor(private http: HttpClient) {}

getSalle():  Observable<Salle[]>{
    return this.http
    .get(urlKPlanner + urlSalle)
    .map((res: any) => {
      if (!res) {
        res = 0;
        return res;
      }
      // console.log(res);
      return res as Salle[];
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