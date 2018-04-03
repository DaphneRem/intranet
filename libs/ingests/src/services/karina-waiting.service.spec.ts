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

import { KarinaWaitingService } from './karina-waiting.service';

describe('Service: KarinaWaitingServiceService', () => {
  let service: KarinaWaitingService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JsonpModule,
        HttpClientModule,
        HttpClientTestingModule
    ],
      providers: [
        KarinaWaitingService,
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
    service = TestBed.get(KarinaWaitingService);
  });

    beforeEach(inject([KarinaWaitingService], s => {
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

 it('should return array of KarinaWaiting objects for get request', fakeAsync(() => {
      let response = [
        {
            idsupport: '16075430',
            noseg: 0,
            idsupportnum: null,
            nosegnum: 0,
            diffusion_id: null,
            chaine: 1,
            Statut: 'ECHEC',
            typeIng: 'GRILLE',
            previsionaldate: '2018-03-31T16:53:12',
            demandeur: null,
            datemaj: '2018-03-01T01:20:37'
        }
    ];
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      service.getKarinaWaiting().subscribe(res => {
        expect(res).toBeDefined();
        expect(typeof res).toBe('object');
        expect(res[0].idsupport).toContain(response[0].idsupport);
        expect(res[0].noseg).toContain(response[0].noseg);
        expect(res[0].idsupportnum).toContain(response[0].idsupportnum);
        expect(res[0].nosegnum).toContain(response[0].nosegnum);
        expect(res[0].diffusion_id).toContain(response[0].diffusion_id);
        expect(res[0].chaine).toContain(response[0].chaine);
        expect(res[0].Statut).toContain(response[0].Statut);
        expect(res[0].typeIng).toContain(response[0].typeIng);
        expect(res[0].previsionaldate).toContain(response[0].previsionaldate);
        expect(res[0].demandeur).toContain(response[0].demandeur);
        expect(res[0].datemaj).toContain(response[0].datemaj);

      });
    })
  );

});
