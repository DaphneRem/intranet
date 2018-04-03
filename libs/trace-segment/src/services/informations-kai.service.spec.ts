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

import { InformationsKaiService } from './informations-kai.service';

describe('Service: InformationsKaiService', () => {
  let service: InformationsKaiService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonpModule,
        HttpClientModule,
        HttpClientTestingModule
    ],
      providers: [
        InformationsKaiService,
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
    service = TestBed.get(InformationsKaiService);
  });

    beforeEach(inject([InformationsKaiService], s => {
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

 it('should return array of InformationsKai objects for get request', fakeAsync(() => {
      let response = [
        {
            ObectId: '10995118155665',
            Status: 'UPDATED',
            WorkStatus: 'FAIT',
            objgroup: '/std_20180208',
            technicalStatus: 'PAD',
            datemaj: null
        }
    ];
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      service.getInformationsKai('555555', 0).subscribe(res => {
        expect(res).toBeDefined();
        expect(typeof res).toBe('object');
        expect(res[0].ObectId).toContain(response[0].ObectId);
        expect(res[0].Status).toContain(response[0].Status);
        expect(res[0].WorkStatus).toContain(response[0].WorkStatus);
        expect(res[0].objgroup).toContain(response[0].objgroup);
        expect(res[0].technicalStatus).toContain(response[0].technicalStatus);
        expect(res[0].datemaj).toContain(response[0].datemaj);

      });
    })
  );

});
