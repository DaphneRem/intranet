import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { DiffusionsDates } from '../models/diffusions-dates';
import { Observable } from 'rxjs/rx';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DatesDiffusionsService {

  headers: Headers;
  options: RequestOptions;
  currentRequest: any;



  constructor(
    private http: Http,
    private http2: HttpClient) {
      this.headers = new Headers({
          'Content-Type': 'application/json',
          'Accept': 'q=0.8;application/json;q=0.9'
      });
      this.options = new RequestOptions({ headers: this.headers });
  }

  killCurrentRequest() {
      this.currentRequest.unsubscribe();
  }

  getChanelsDiffusions() {
    this.currentRequest = this.http.get('http://vm-angular-rc:9081/api/LibChaine')
              .map((res: Response) => res.json())
              .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    return this.currentRequest;
  }

  getDiffusionsDates(datasForm) {
    const bodyString = JSON.stringify(datasForm);
    this.currentRequest = this.http.post('', bodyString, this.options)
              .map((res: Response) => res.json())
              .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    return this.currentRequest;
    }


}
