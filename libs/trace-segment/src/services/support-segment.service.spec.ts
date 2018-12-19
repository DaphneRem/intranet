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

import { SupportSegmentService } from './support-segment.service';

describe('Service: SupportSegmentService', () => {
  let service: SupportSegmentService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonpModule,
        HttpClientModule,
        HttpClientTestingModule
    ],
      providers: [
        SupportSegmentService,
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
    service = TestBed.get(SupportSegmentService);
  });

    beforeEach(inject([SupportSegmentService], s => {
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

 it('should return array of SupportSegment objects for get request', fakeAsync(() => {
      let response = [
        {
            id: '17678300',
            TypeSupport: 'PADI-SAT',
            Formatsupport: 'B BETA HD2',
            StatutSupport: 'Exploitable',
            numprogram: '2018-00049',
            numepisode: 42,
            titreseg: '11 - doomsday pastille 11 dim 20h45',
            markin: '01:11:50:00',
            markout: '01:12:01:20',
            durant: '00:00:11:20',
            idsuppsuivant: '20752549',
            nosegsuivant: '0',
            diffusionid: '',
            objid: '',
            datecre: '2018-02-08T09:06:11',
            datemaj: '2018-02-08T09:15:04',
            usermaj: 'KAI'
        }
    ];
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      service.getSupportSegment('555555', 0).subscribe(res => {
        expect(res).toBeDefined();
        expect(typeof res).toBe('object');
        expect(res[0].id).toContain(response[0].id);
        expect(res[0].TypeSupport).toContain(response[0].TypeSupport);
        expect(res[0].Formatsupport).toContain(response[0].Formatsupport);
        expect(res[0].StatutSupport).toContain(response[0].StatutSupport);
        expect(res[0].numprogram).toContain(response[0].numprogram);
        expect(res[0].numepisode).toContain(response[0].numepisode);
        expect(res[0].titreseg).toContain(response[0].titreseg);
        expect(res[0].markin).toContain(response[0].markin);
        expect(res[0].markout).toContain(response[0].markout);
        expect(res[0].durant).toContain(response[0].durant);
        expect(res[0].idsuppsuivant).toContain(response[0].idsuppsuivant);
        expect(res[0].nosegsuivant).toContain(response[0].nosegsuivant);
        expect(res[0].diffusionid).toContain(response[0].diffusionid);
        expect(res[0].objid).toContain(response[0].objid);
        expect(res[0].datecre).toContain(response[0].datecre);
        expect(res[0].datemaj).toContain(response[0].datemaj);
        expect(res[0].usermaj).toContain(response[0].usermaj);

      });
    })
  );

});
