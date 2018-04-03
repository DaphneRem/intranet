import {
  JsonpModule,
  Jsonp,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from '@angular/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { CustomThemesService } from './custom-datatables-themes.service';

describe('Service: CustomThemesService', () => {
  let service: CustomThemesService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JsonpModule],
      providers: [
        CustomThemesService,
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
    service = TestBed.get(CustomThemesService);
  });

  it(
    'should return Theme',
    fakeAsync(() => {
      let response = {
        name : 'blue theme',
        firstColumnColor: {
            'background' : '#39ADB5'
        },
        headerColor: {
            'background' : '#fff',
            'border' : '1px solid',
            'border-color' : '#39ADB5',
            'color' : '#39ADB5'
        },
        buttonViewMore : {
            'color' : '#39ADB5',
            'border-color' : '#39ADB5',
        },
        alertColor :  {
            'background' : '#ebebeb'
        }
      };
      backend.connections.subscribe(connection => {
        connection.mockRespond(
          new Response(<ResponseOptions>{
            body: JSON.stringify(response)
          })
        );
      });
      service.getTheme('blue theme');
      tick();

      expect(service.getTheme.length).toBe(1);
      expect(service.getTheme('blue theme')).toBeDefined();
    })
  );
});
