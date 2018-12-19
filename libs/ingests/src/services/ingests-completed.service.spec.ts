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

import { IngestsCompletedService } from './ingests-completed.service';

describe('Service: IngestsCompletedService', () => {
  let service: IngestsCompletedService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonpModule,
        HttpClientModule,
        HttpClientTestingModule
    ],
      providers: [
        IngestsCompletedService,
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
    service = TestBed.get(IngestsCompletedService);
  });

    beforeEach(inject([IngestsCompletedService], s => {
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

  it('should return array of IngestsCompleted objects for get request', fakeAsync(() => {
      let response = [
           {
                titreSeg: 'Pastille catch ppv ab1 v2',
                id: '16908530',
                noseg: 1,
                nomfichier: '',
                stockage: '',
                idSuppSuivant: '19082307',
                noSegSuivant: 0,
                commentaires: '',
                statutSupport: 'EXPLOITABLE',
                typeSupport: 'PADI-SAT',
                processname: null,
                refname: null,
                statut: null,
                tstamp: '2018-03-26T12:05:45'
            }
        ];
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      service.getIngestsCompleted(3).subscribe(res => {
        expect(res).toBeDefined();
        expect(typeof res).toBe('object');
        expect(res[0].titreSeg).toContain(response[0].titreSeg);
        expect(res[0].id).toContain(response[0].id);
        expect(res[0].noseg).toContain(response[0].noseg);
        expect(res[0].nomfichier).toContain(response[0].nomfichier);
        expect(res[0].stockage).toContain(response[0].stockage);
        expect(res[0].idSuppSuivant).toContain(response[0].idSuppSuivant);
        expect(res[0].noSegSuivant).toContain(response[0].noSegSuivant);
        expect(res[0].commentaires).toContain(response[0].commentaires);
        expect(res[0].statutSupport).toContain(response[0].statutSupport);
        expect(res[0].tstamp).toContain(response[0].tstamp);
      });

    })
  );

});
