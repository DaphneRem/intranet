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

import { IngestsPurgedService } from './ingests-purged.service';

describe('Service: IngestsPurgedService', () => {
  let service: IngestsPurgedService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonpModule,
        HttpClientModule,
        HttpClientTestingModule
    ],
      providers: [
        IngestsPurgedService,
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
    service = TestBed.get(IngestsPurgedService);
  });

    beforeEach(inject([IngestsPurgedService], s => {
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

  it('should return array of IngestsPurged objects for get request', fakeAsync(() => {
      let response = [
        {
            DIFFUSION_ID: '0_20893198_0',
            STATUTDETAIL: 'PURGE KARINA',
            POSSTATUT: 'TERMINE',
            IDCHAINE: null,
            COMMENTAIRE: null,
            TSTAMP: '2018-03-28T15:48:54'
        }
    ];
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      service.getIngestsPurged(3).subscribe(res => {
        expect(res).toBeDefined();
        expect(typeof res).toBe('object');
        expect(res[0].DIFFUSION_ID).toContain(response[0].DIFFUSION_ID);
        expect(res[0].STATUTDETAIL).toContain(response[0].STATUTDETAIL);
        expect(res[0].POSSTATUT).toContain(response[0].POSSTATUT);
        expect(res[0].IDCHAINE).toContain(response[0].IDCHAINE);
        expect(res[0].COMMENTAIRE).toContain(response[0].COMMENTAIRE);
        expect(res[0].TSTAMP).toContain(response[0].TSTAMP);
      });
    })
  );

});
