import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ContainerKP } from '../models/container';
import {
  urlKPlanner,
  urlPlanningContainers,
  urlOnePlanningContainers,
  urlPlanningContainersByRessource,
  urlPlanningContainersBystartDate,
  urlPlanningContainersByendDate
} from '.privates-url';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContainersService {


    constructor(private http: HttpClient) {}

  getAllContainers():  Observable<ContainerKP[]> {
      return this.http
      .get(urlKPlanner + urlPlanningContainers)
      .map((res: any) => {
        if (!res) {
          res = 0;
          return res;
        }
        // console.log(res);
        return res as ContainerKP[];
      })
      .catch(this.handleError);
  }

  getContainer(id: number): Observable<ContainerKP> {
      return this.http
        .get(urlKPlanner + urlPlanningContainers + id)
        .map((res: any) => {
          console.log(res);
          return res as ContainerKP;
        });
    }

  getContainersByRessource(coderessource: number): Observable<ContainerKP[]> {
      return this.http
        .get(urlKPlanner + urlPlanningContainersByRessource + coderessource)
        .map((res: any) => {
          console.log(res);
          return res as ContainerKP[];
        });
    }

  getContainersByRessourceStartDateEndDate(coderessource: number, datedebut: Date, datefin: Date): Observable<ContainerKP[]> {
      return this.http
        .get(
          urlKPlanner +
          urlPlanningContainersByRessource +
          coderessource +
          urlPlanningContainersBystartDate +
          datedebut +
          urlPlanningContainersByendDate +
          datefin
        )
        .map((res: any) => {
          console.log(res);
          return res as ContainerKP[];
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
