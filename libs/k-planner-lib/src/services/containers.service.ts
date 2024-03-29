import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ContainerKP } from '../models/container';
import {
  urlKPlanner,
  urlPlanningContainers,
  urlOnePlanningContainers,
  urlPlanningContainersByRessource,
  urlPlanningContainersBystartDate,
  urlPlanningContainersByendDate,
  urlPlanningContainersDetailsByRessource
} from '.privates-url';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ContainersService {

    constructor(private http: HttpClient) {}

  /************************* PUT *************************/

  getAllContainers(): Observable<ContainerKP[]> {
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

  getContainersByRessourceStartDateEndDate(
    coderessource: number,
    datedebut: Date | string,
    datefin: Date | string
  ): Observable<ContainerKP[]> {
      return this.http
        .get(
          urlKPlanner +
          urlPlanningContainersByRessource +
          // urlPlanningContainersDetailsByRessource +
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

  /************************* PUT *************************/

  updateContainer(id, container: ContainerKP): Observable<ContainerKP[]> {
    return this.http
      .put<ContainerKP>(
        urlKPlanner + urlOnePlanningContainers + id,
        container
      )
      .pipe(catchError(this.handleError));
  }
/************************************ Put onPromise**************************/
 extractData(res: HttpResponse<Object>) {
  return res || [];

//   var array = new Array();
//   var key, count = 0;
//   for(key in res.body) {
//       array.push(res.body[count++]);
//   }
//   return array;
// }
}
updateContainerPromise(id, container) {
  return this.http
    .put(
      urlKPlanner + urlOnePlanningContainers + id,
      container
    )
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError)
}
  /************************ POST *************************/

  postContainer(container: ContainerKP): Observable<ContainerKP> {
    return this.http
      .post<ContainerKP>(
        urlKPlanner + urlPlanningContainers,
        container
      )
      .pipe(catchError(this.handleError));
  }

  /*********************** DELETE ************************/

  deleteContainer(id): Observable<ContainerKP> {
    return this.http
      .delete<ContainerKP>(urlKPlanner + urlOnePlanningContainers + id)
      .pipe(catchError(this.handleError));
  }

  /*********************** ERROR ************************/

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
