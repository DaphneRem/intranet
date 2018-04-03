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
    
    // Get the MockBackend
    backend = TestBed.get(MockBackend);

    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.get(IngestsCompletedService);
  });

    beforeEach(inject([IngestsCompletedService], s => {
        service = s;
      }));

    it(`should issue a request`,
        // 1. declare as async test since the HttpClient works with Observables
        async(
          // 2. inject HttpClient and HttpTestingController into the test
          inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
            // 3. send a simple request
            http.get('/foo/bar').subscribe();
            // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
            // here two, it's significantly less boilerplate code needed to verify an expected request
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
      // When the request subscribes for results on a connection, return a fake response
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      // Perform a request and make sure we get the response we expect
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
