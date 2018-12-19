import {
  JsonpModule,
  Jsonp,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from '@angular/http';
import { TestBed, fakeAsync, tick, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { InfoTraitementKaiService } from './info-traitement-kai.service';

describe('Service: InfoTraitementKaiService', () => {
  let service: InfoTraitementKaiService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonpModule,
        HttpClientModule,
        HttpClientTestingModule
    ],
      providers: [
        InfoTraitementKaiService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Jsonp,
          useFactory: (backend, options) => new Jsonp(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    backend = TestBed.get(MockBackend);
    service = TestBed.get(InfoTraitementKaiService);
  });

    beforeEach(inject([InfoTraitementKaiService], s => {
        service = s;
      }));

    it(`should issue a request`, async(
          inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
            http.get('/foo/bar').subscribe();
            backend.expectOne({
              url: '/foo/bar',
              method: 'GET'
            });
          })
        )
   );

});
