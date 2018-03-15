import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { DatesDiffusionsService } from './diffusions-dates.service';
import { urlDiffDates_checkProgramNumber } from '.privates-url';


fdescribe('DatesDiffusionsService', () => {


  let injector: TestBed;
  let service: DatesDiffusionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatesDiffusionsService]
    });
    injector = getTestBed();
    service = injector.get(DatesDiffusionsService);
    httpMock = injector.get(HttpTestingController);
  });

  describe('#getUsers', () => {
    it('should return an Observable<User[]>', () => {
      const dummyUsers = 'true';
      service.checkProgramNumber('2015-00000').subscribe(users => {
        expect(users).toBeTruthy();
      });
      const mockReq = httpMock.expectOne(urlDiffDates_checkProgramNumber + '2015-00000');
      expect(mockReq.request.method).toBe('GET');
      mockReq.flush(dummyUsers);
    });
  });
  /*

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('Test récupération chaines ', () => {
      service.checkProgramNumber('1996-00001')
      .subscribe(result => {
       alert(result);
      });
    });


    it('Test récupération chaines ', () => {
          const expectedChanels: DiffusionsChanel[] = [{ code: 1, libelle: 'AB 1'}];
          service.getChanelsDiffusions().subscribe((datas) =>
           expect(datas.length).toBeDefined('helloloo')
          );
        });
    it(`should issue a request`,
        // 1. declare as async test since the HttpClient works with Observables
        async(
          // 2. inject HttpClient and HttpTestingController into the test
          inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
            // 3. send a simple request
            service.checkProgramNumber('1996-00001').subscribe();
          })
        )
      );

    it('Program Number Check Function ', () => {

      service.checkProgramNumber('1996-00001').subscribe(
        data =>  expect(data).toBeTruthy(),
        fail
      );

    });


      */
  });
