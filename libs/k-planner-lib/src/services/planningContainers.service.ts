import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { Container } from "../models/container";
import { urlKPlanner, urlPlanningContainers, urlOnePlanningContainers } from ".privates-url";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PlanningContainersService {
  

    constructor(private http: HttpClient) {}

    getPlanningContainers():  Observable<Container[]>{
        return this.http
        .get(urlKPlanner + urlPlanningContainers)
        .map((res: any) => {
          if (!res) {
            res = 0;
            return res;
          }
          // console.log(res);
          return res as Container[];
        })
        .catch(this.handleError);
    }
    getPlanningOneContainers(id: number): Observable<Container> {
        return this.http
          .get(urlKPlanner + urlPlanningContainers + id)
          .map((res: any) => {
            console.log(res);
            return res as Container;
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
