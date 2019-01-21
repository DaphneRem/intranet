import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { MonteursData } from "../models/monteurs-data";
import { urlKPlanner, urlMonteurs } from ".privates-url";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";


@Injectable()
export class MonteursService {
  constructor(private http: HttpClient) {}

getMonteur():  Observable< MonteursData[]>{
    return this.http
    .get(urlKPlanner + urlMonteurs)
    .map((res: any) => {
      if (!res) {
        res = 0;
        return res;
      }
      // console.log(res);
      return res as MonteursData[];
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