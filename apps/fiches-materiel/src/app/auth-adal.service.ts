import { Injectable } from '@angular/core';

import { Adal5HTTPService, Adal5Service } from 'adal-angular5';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthAdalService {

  constructor(
    private adal5HttpService: Adal5HTTPService,
    private adal5Service: Adal5Service
  ) { }

  public get(url: string): Observable<any> {
    const options = this.prepareOptions();
    this.adal5Service.acquireToken('http://localhost:4200');
        return this.adal5HttpService.get(url, options);
  }

  prepareOptions(): any {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.adal5Service.userInfo.token}`);
    return { headers };
  }
}
